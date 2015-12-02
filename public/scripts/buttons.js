var submitButton = document.querySelector('#submitChargeButton');
var cancelChargeButton = document.querySelector('#cancel-buttons');
var closeSuccessModalButton = document.querySelector('#close-success-button');

submitButton.addEventListener("click", function() {
	$.ajax({
		type: 'PUT',
		url: '/file-upload', //API request
		data: JSON.stringify(),  //NEED THESE       
		contentType: 'application/json; charset=UTF-8', //NEED THESE
		success: function(resp) {        
			closeAndEmptyModal('#charge-review-modal', 'ul.charge-preview-list');
			console.log('hererere');
			populateSuccessModal(resp);
			$('.tooltipped').tooltip({delay: 10});
			$('#charge-review-modal-success').openModal({dismissible: false});
		},
		error: function(resp) {
			closeAndEmptyModal('#charge-review-modal', 'ul.charge-preview-list');
			alert('Excel file not in correct format! Try again...');
		}
	});
});

cancelChargeButton.addEventListener('click', function() {
  	closeAndEmptyModal('#charge-review-modal', 'ul.charge-preview-list');
});

closeSuccessModalButton.addEventListener('click', function() {
  	closeAndEmptyModal('#charge-review-modal-success', 'ul.charge-receipt-list');
});  


var populateSuccessModal = function (response) {
  	var myUL = $('.charge-receipt-list'); 
	for (var i = 0; i < response.length; i++) {
		var user = response[i];
		var amt = (user.amount < 0) ? user.amount * -1 : user.amount; // can only do charges    
		var myIconType = (user.err) ? 'clear' : 'done';
		var myIconType = (user.warning) ?  'warning' : myIconType;
		var iconClass =  (user.err) ? 'not-connected-icon' : 'connected-icon';
		iconClass = (user.warning) ? 'warning-icon' : iconClass;
		var tooltipString =  (user.err) ? user.err : 'success';
		var userName = (user.name) ? (user.name+' - ')  : '';
		var str = '<li id="chargeLI" class="collection-item avatar"><i class="material-icons circle">account_circle</i><span class="title">'+userName + user.phone+'</span><p>for: '+user.note+'</p><br>$'+amt+'<a href="#!" class="secondary-content tooltipped" data-position="top" data-delay="50" data-tooltip="'+tooltipString+'"><i class="material-icons '+iconClass+'">'+myIconType+'</i></a></li>';
		myUL.append(str);
	}
}

var populatePreviewModal = function (returnedArray) {                                          
  	var myUL = $('ul.charge-preview-list');
	for (var i = 0; i < returnedArray.length; i++) {
		var user = returnedArray[i];
		var amt = (user.amount < 0) ? user.amount * -1 : user.amount; // can only do charges
		var str = '<li id="chargeLI" class="collection-item avatar"><i class="material-icons circle">account_circle</i><span class="title">'+user.phone+'</span><p>for: '+user.note+'</p><br>$'+amt+'</li>';
		myUL.append(str);
	}
}

var closeAndEmptyModal = function (modalIdentifier, listIdentifier) {
	$(modalIdentifier).closeModal();
	$(listIdentifier).empty();
}

// so dropzone can access functions
module.exports = {
	populateSuccessModal: populateSuccessModal,
	populatePreviewModal: populatePreviewModal,
	closeAndEmptyModal: closeAndEmptyModal
}