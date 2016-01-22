// // JS For form validation on sign up form

var parsley_options = {
	successClass: 'valid',
	errorClass: 'invalid'
};

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


var myParsleyForm = $('#signup-form').parsley(parsley_options);
$('#signup-form').attr('data-parsley-errors-messages-disabled', '');


setParsleyAttributes(nameOptions);
setParsleyAttributes(emailOptions);
setParsleyAttributes(passwordOptions);
setParsleyAttributes(reenterPasswordOptions);


// $('#signup-form').on('change', function() {
// 	myParsleyForm.validate();
// });

function setParsleyAttributes(attrArray) {
	attrArray.forEach(function (obj) {
		$(obj.selector).attr(obj.attribute, obj.value);
	})
}