// // JS For form validation on sign up form


var parsley_options = {
	successClass: 'valid',
	errorClass: 'invalid'
};


// for sign up form - options

var nameOptions = [
				{selector: '#for_name', attribute: 'data-parsley-required', value: ''},
				{selector: '#for_name_label', attribute: 'data-error', value: 'Required'}
				];

var emailOptions = [
				{selector: '#for_email', attribute: 'data-parsley-required', value: ''},
				{selector: '#for_email', attribute: 'data-parsley-type', value: 'email'},
				{selector: '#for_email', attribute: 'type', value: 'email'},
				{selector: '#for_email_label', attribute: 'data-error', value: 'Not a valid email'}
				];

var passwordOptions = [
				{selector: '#for_password', attribute: 'data-parsley-required', value: ''}
				];

var reenterPasswordOptions = [
				{selector: '#for_password-1', attribute: 'data-parsley-required', value: ''},
				{selector: '#for_password_1_label', attribute: 'data-error', value: 'Passwords don\'t match'},				
				{selector: '#for_password-1', attribute: 'data-parsley-equalto', value: '#for_password'}
				];

// For login form options												

var loginEmailOptions = [
				{selector: '#for_email_login', attribute: 'data-parsley-required', value: ''},
				{selector: '#for_email', attribute: 'data-parsley-type', value: 'email'},
				{selector: '#for_email', attribute: 'type', value: 'email'},	
				{selector: '#for_email_login_label', attribute: 'data-error', value: 'Not a valid email'}
				];

var loginPasswordOptions = [
				{selector: '#for_password_login', attribute: 'data-parsley-required', value: ''},
				{selector: '#for_password_login_label', attribute: 'data-error', value: 'Required'}
				];				

// bind forms to parsley
var myParsleyForm = $('#signup-form').parsley(parsley_options);
$('#signup-form').attr('data-parsley-errors-messages-disabled', '');

var loginParsleyForm = $('#login-form').parsley(parsley_options);
$('#login-form').attr('data-parsley-errors-messages-disabled', '');

// set options for form fields
setParsleyAttributes(nameOptions);
setParsleyAttributes(emailOptions);
setParsleyAttributes(passwordOptions);
setParsleyAttributes(reenterPasswordOptions);
setParsleyAttributes(loginEmailOptions);
setParsleyAttributes(loginPasswordOptions);


// $('#signup-form').on('change', function() {
// 	myParsleyForm.validate();
// });

function setParsleyAttributes(attrArray) {
	attrArray.forEach(function (obj) {
		$(obj.selector).attr(obj.attribute, obj.value);
	})
}