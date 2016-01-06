var nodemailer 	= require('nodemailer');
var config = require('../config/index');

var transporter;
var mailOptions;

module.exports = {

	initialize: function() {
		transporter = nodemailer.createTransport({
		    service: 'Gmail',
		    auth: {
		        user: config.SystemEmail,
		        pass: config.SystemEmailPassword
		    }
		});

		console.log(transporter);
	},

	setOptions: function(htmlString, email, subjectLine) {
	    mailOptions = {
	        from: 'Treasury Admin <soCal458@gamil.com>', // sender address', // sender address
	        to: email, // list of receivers
	        subject: subjectLine, // Subject line
	        //text: 'See below for your event information:', // plaintext body
	        html: htmlString // html body
	    }; 
	},

	sendEmail: function() {
		console.log("sending email...");
		transporter.sendMail(mailOptions, function(error, info) {
		    if (error) {
		        console.log(error);
		    } else {
		        console.log('Message sent: ' + info.response);
		    }
		});
	}

}