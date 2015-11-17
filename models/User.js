var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');
    collectionName = "usersC";

var deepPopulate = require('mongoose-deep-populate');
    


// note: other fields (email) are created by the .plugin() method below
var UserSchema = new Schema({
	name: String,
	venmo_username: {type: String, default: null},
	venmo_id: {type: String, default: null},
    venmoEmail: String,
    myBalance: Number,
    access_token: {type: String, default: null},
    refresh_token: {type: String, default: null},
    tokenExpireDate: Date,
	dateCreated: {type: Date, default: Date.now},
    isConnected: Boolean
}, {collection: collectionName});

var options = {usernameField: 'email'};

UserSchema.plugin(passportLocalMongoose, options);

UserSchema.plugin(deepPopulate);


module.exports = mongoose.model('User', UserSchema);