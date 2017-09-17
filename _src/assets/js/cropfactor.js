$(document).ready(function () {
  console.log('ready');

  var cameraPicker = $('.select--camera-picker');
  var lensPicker = $('.select--lens-picker');

  // remove all the optgroups from the lens picker
  function clearLensPicker() {
    lensPicker.find('optgroup').hide();
  }

  cameraPicker.on('change', function() {
    var cameraSensor = $(this).find(':selected').attr('data-sensor');
        cameraCrop = $(this).find(':selected').attr('data-crop');
        cameraWidth = $(this).find(':selected').attr('data-mmwidth');
        cameraHeight = $(this).find(':selected').attr('data-mmheight');

        cameraOptGroupId = cameraPicker.find(':selected').closest('optgroup').attr('data-groupid');
        lensOptGroupId = lensPicker.find('optgroup').attr('data-groupid');

        cameraDisplaySensor = $('.camera-details--sensor');
        cameraDisplayCrop = $('.camera-details--crop');
        cameraDisplayWidthHeight = $('.camera-details--width-height');

    // enable the lens picker
    lensPicker.removeAttr('disabled');

    clearLensPicker();

    // display the appropriate lenses
    lensPicker.find('optgroup[data-groupid=' + cameraOptGroupId +']').show();

    cameraDisplaySensor.text(cameraSensor);
    cameraDisplayCrop.text(cameraCrop);
    cameraDisplayWidthHeight.html(cameraWidth + '<span>mm</span> x ' + cameraHeight + '<span>mm</span>');

    displayLists();
  });



  lensPicker.on('change', function() {
    var fstop = $(this).find(':selected').attr('data-fstop');
        resultsFstop = $('.results--fstop');
    resultsFstop.html('<span>f</span>' + fstop);

    doTheCalc();

    displayLists();
  });

  function displayLists() {

    var cameraOptGroupId = cameraPicker.find(':selected').closest('optgroup').attr('data-groupid');
        lensOptGroupId = lensPicker.find(':selected').closest('optgroup').attr('data-groupid');



    console.log('camera group id' + cameraOptGroupId);
    console.log('lens group id' + lensOptGroupId);
  }

  function doTheCalc() {

    var cameraCrop = cameraPicker.find(':selected').attr('data-crop');
        focalLength = lensPicker.find(':selected').attr('data-focal-length');

        calcResult = cameraCrop * focalLength;
        calcResult = Math.round(calcResult);
        newFocalLength = $('.crop-result--value');

    newFocalLength.html(calcResult);

    console.log('camera crop', cameraCrop);
    console.log('focal length', focalLength);
    console.log('calc result', calcResult);

    if (cameraOptGroupId != null && lensOptGroupId != null) {
      console.log('both cam and lens have values');
    }
  }

  // var cameraPicker = $('.select--camera-picker');
  //     focalLength = $('.input--focal-length');
  //     cropSize = $('.input--crop-size');
  //     calcButton = $('.button--calculate');
  //
  // // get the camera
  // cameraPicker.on('change', function() {
  //   var cropVal = $(this).val();
  //   console.log(cropVal);
  // });
  //
  // function doTheCalc() {
  //
  //   var cropVal = cameraPicker.val();
  //       focalLengthVal = focalLength.val();
  //       cropSizeVal = cropSize.val();
  //
  //   var result = cropVal * focalLengthVal;
  //
  //   cropSize.val(Math.round(result));
  // }
  //
  // calcButton.on('click', function() {
  //   doTheCalc();
  // });

});
