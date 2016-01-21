var router = require('express').Router();
var fs = require('fs');
var xlsx = require('node-xlsx');
var multer = require('multer');
var Q = require('q');
var request = require('request');
var User = require('../models/User');

var Emailer = require('../my_modules/emailer');

var config = require('../config/index');
var BASE_URL = config.Venmo_BASE_URL;

var storage = multer.diskStorage({
  destination: './uploads',
  filename: function (req, file, cb) {
    cb(null, 'uploadedGroup.xlsx');	
  }

});

var upload = multer({storage: storage});

// route handles uploading of the file, will send back preview
// of the charge to client

router.get('/query', function(req, res, next) {
	User.findOne({_id: req.session.user._id}, function(err, user) {
		res.send(user);
	});
});

router.post('/', upload.any(), function (req, res, next) {
	
	console.log('received file...');
	console.log('saved file: ' + req.files[0].filename);
	console.log('parsing file...');
	var obj = xlsx.parse('./uploads/'+req.files[0].filename);
	console.log('new object');
	console.log(obj[0].data);

	// check if excel document correct format
	var venmoArray;
	if(obj[0].data[0].length != 3) venmoArray = {err: 'file not in correct format!'};
	else venmoArray = createVenmoObjects(obj[0].data, req);
	
	// console.log(venmoArray);

	User.findOneAndUpdate({_id: req.session.user._id}, {lastRequestBody: venmoArray}, function (err, doc) {
		if (err) next(err);
		res.status(200).send(venmoArray);	
	});
		
});

// issues the charges to venmo
router.put('/', function (req, res, next) {
	console.log('issuing venmo charges...');
	User.findOne({_id: req.session.user._id}).exec(function(err, user) {
		if (err) next(err);
		console.log(user.lastRequestBody);
		issueAllVenmoCharges(user.lastRequestBody, req.session.user.access_token).then(function(results) {
			console.log('got results');
			console.log(results);
			var allGood = true;
			var toRet = createReturnBody(results, user.lastRequestBody);

			sendConfirmationEmail(req.session.user.email, toRet, function() {
				res.status(200).send(toRet);
			});
						
		});
	});

});


function sendConfirmationEmail(userEmail, statusObj, cb) {
	Emailer.initialize();
	Emailer.setOptions(createHTMLString(statusObj), userEmail, 'Charge Log from Your Recent Transaction');
	Emailer.sendEmail();
	cb();
}

function createHTMLString(arrayofObjs) {
	var htmlString = '';
	arrayofObjs.forEach(function (entry, index) {
		htmlString += '<b>Charge ' + index + ':</b> ' + entry.phone + ', ' + entry.name + ', status - ' + (entry.err ? entry.err : 'OK') + '<br>';
	});
	return htmlString;
}

// function that parses return from venmo server responses
// and sends easy to use form to front end
function createReturnBody(results, originalBody) {
	var toRet = [];

	for (var i = 0; i < results.length; i++) {
		var myLI = originalBody[i];
		delete myLI.access_token;
		// promise returned an error
		if (results[i].reason) {
			myLI.err = 'Error, charge did not issue: ' + results[i].reason.error.message;
			myLI.name = 'unknown';
		} else { // it worked, now check if user in system
			if (results[i].value.data.payment.target.user == null) {
				myLI.err = 'Charge issued succesfully, but user not found in system. Check phone number';
				myLI.warning = true;
			} else {
				console.log("USER INFORMATION");
				console.log(results[i].value.data.payment.target);
				console.log(results[i].value.data.payment.target.user.display_name);
				myLI.name = results[i].value.data.payment.target.user.display_name;	
			}
		}

		toRet.push(myLI);
	}
	console.log(toRet);
	return toRet;
}

// returns promise that resolves when all charges have resolved
// resolve or reject, must check status upon return of this method
function issueAllVenmoCharges (venmoBodyArray, access_token) {
	console.log('Charge count: ' + venmoBodyArray.length);
	return Q.allSettled(venmoBodyArray.map(function(venmoBody, index) {
		return issueVenmoChargeAsynch(venmoBody, index, access_token);
	}));
}

// asynch part of the function, will create a promise and return it
// on a per charge basis
function issueVenmoChargeAsynch(venmoBody, index, access_token) {
	var deferred = Q.defer();
	venmoBody.access_token = access_token;
	request.post(BASE_URL, {form: venmoBody}, function (err, resp, receipt) {
		console.log('received Venmo response ' + index);
		receipt = JSON.parse(receipt);
		if (err || receipt.error) deferred.reject(receipt);
		else deferred.resolve(receipt);			
	});

	return deferred.promise;
}

// creates array of vemmo objects to be sent to venmo
function createVenmoObjects(excel, req) {
	var toRet = [];
	for (var i = 1; i < excel.length; i++) {
		var amt = excel[i][2];
		amt = (amt < 0) ? amt : amt * -1; // can only do charges
		amt = amt.toFixed(2); // only two decimals
		console.log('amount: ' + amt);
		var obj = {
					phone: excel[i][0],
					note: excel[i][1],
					amount: amt,
					audience: 'public'
					};
		toRet.push(obj);
	}

	return toRet;
}

module.exports = router;