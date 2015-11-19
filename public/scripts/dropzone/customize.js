var THUMBNAIL_PATH = './img/fileUploadThumbnail.png';
var venmoRequest;

Dropzone.options.myDropzone = {

  // Prevents Dropzone from uploading dropped files immediately
  autoProcessQueue: false,

  init: function() {

    var uploadButton = document.querySelector("#upload-all");
    var submitButton = document.querySelector('#submitChargeButton');
    var cancelChargeButton = document.querySelector('#cancel-buttons');
    this.fileCount = 0;

    myDropzone = this; // closure
    $("#upload-all").hide();

    uploadButton.addEventListener("click", function() {
      myDropzone.processQueue(); // Tell Dropzone to process all queued files.
    });

    submitButton.addEventListener("click", function() {

          $.ajax({
            type: 'PUT',
            url: '/file-upload', //API request
            data: JSON.stringify(venmoRequest),  //NEED THESE       
            contentType: 'application/json; charset=UTF-8', //NEED THESE
            success: function(resp) {  //line 95 from usergroupRoutes.js            
              $('#charge-review-modal').closeModal();
              $('ul.charge-preview-list').empty();
              $('#charge-review-modal-success').openModal({dismissable: false});
            },
            error: function() {
              $('#charge-review-modal').closeModal();
              $('ul.charge-preview-list').empty();
              alert('Excel file not in correct format! Try again...');
            }
          });
    }); 

    cancelChargeButton.addEventListener('click', function() {
      $('#charge-review-modal').closeModal();
      $('ul.charge-preview-list').empty();
    });   

    // You might want to show the submit button only when 
    // files are dropped here:
    this.on("addedfile", function() {
      myDropzone.fileCount++;
      $("#upload-all").show();
    });

    this.on("removedfile", function() {
      myDropzone.fileCount--;
      if (myDropzone.fileCount == 0) $("#upload-all").hide();  
    });

    this.on("success", function(file, responseText) {
      console.log('reeived response text');
      if (responseText.err) {
        alert(responseText.err);
        myDropzone.removeFile(file);
      } else {
        populateModal(responseText);
        venmoRequest = responseText;
        setTimeout(function() {
          $('#charge-review-modal').openModal({dismissible: false});
          myDropzone.removeFile(file);
        }, 1000);
      }
    });

    this.on('maxfilesexceeded', function(file) {
      myDropzone.removeFile(file);
      alert('You can only upload one file at a time.');
    });

    this.on("error", function(file, responseText) {
      if (responseText == "You can't upload files of this type.") {
        myDropzone.removeFile(file);
        alert(responseText);                                     
      }
    });    

  },
  acceptedFiles: '.xls, .xlsx',
  maxFiles: 1,
  addRemoveLinks: true,
  previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-image\"><img src='"+THUMBNAIL_PATH+"' data-dz-thumbnail /></div>\n  <div class=\"dz-details\">\n    <div class=\"dz-size\"><span data-dz-size></span></div>\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n  <div class=\"dz-success-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Check</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <path d=\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill-opacity=\"0.816519475\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n      </g>\n    </svg>\n  </div>\n  <div class=\"dz-error-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Error</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Check-+-Oval-2\" sketch:type=\"MSLayerGroup\" stroke=\"#747474\" stroke-opacity=\"0.198794158\" fill=\"#FFFFFF\" fill-opacity=\"0.816519475\">\n          <path d=\"M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" sketch:type=\"MSShapeGroup\"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>",
  dictDefaultMessage: "Drop .xls or .xlsx file here to create charge"

};



function populateModal(returnedArray) {                                          
  var myUL = $('ul.charge-preview-list');
  for (var i = 0; i < returnedArray.length; i++) {
    var user = returnedArray[i];
    var amt = (user.amount < 0) ? user.amount * -1 : user.amount; // can only do charges
    var str = '<li id="chargeLI" class="collection-item avatar"><i class="material-icons circle">account circle</i></span><span class="title">'+user.phone+'</span><p>for: '+user.note+'</p><br>$'+amt+'</li>';
    myUL.append(str);
  }
}