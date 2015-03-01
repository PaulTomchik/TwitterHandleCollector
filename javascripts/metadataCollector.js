'use strict';

$( document ).ready(function() {

  var metadataForm  = $('#metadataForm'),
      screenName    = $('#screen_name'),
      state         = $('#state'),
      firstName     = $('#first_name'),
      lastName      = $('#last_name'),
      party         = $('#party'),
      office        = $('#office'),
      levelOfGovt   = $('#level_of_government'),
      termStartDate = $('#term_start_date'),
      termEndDate   = $('#term_end_date');


  function initForm () {
    metadataForm.find('input:text').val('');

    screenName.watermark('Twitter Screen Name');
    state.watermark('State');
    firstName.watermark('First Name');
    lastName.watermark('Last Name');
    party.watermark('Party');
    office.watermark('Office');
    levelOfGovt.watermark('Level of Government');
    termStartDate.watermark('Term Start Date');
    termEndDate.watermark('Term End Date');
  }


  function handleFormSubmit(event) {

    var formData = metadataForm.serializeObject(),
        data = {};

    Object.keys(formData).forEach( function(key) {
      if (formData[key] !== "") {
        data[key] = formData[key];
      }
    });

    console.debug("DEBUG: POST Parameters = " + JSON.stringify(data));


    if (!formData['screen_name']) {
      alert('Twitter Screen Name is manditory.');
      console.error("ERROR: No Twitter sceen_name.");
    }

    $.ajax({
      type: "POST",
      url: "/upsertPoliticianMetadata",
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data){
        if (!data['message']) {
          "ERROR: Why come you no have a server message???"
        } else {
          if (data['message'].substring(0,6) !== 'ERROR') {
            initForm();
            console.debug(data['message']);
          } else {
            console.error(data['message']);
          }
        }
      },
      failure: function(errMsg) {
        alert(errMsg);
        console.error(errMsg);
       }
  });

};

   
  initForm();
  metadataForm.submit(handleFormSubmit);

});

