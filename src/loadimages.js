module.exports = function loadImages(imgSrcs, then) {
  // then(err, imgElements)
  // Calls then after all the images were loaded.
  var i, imgs, numberOfImages, onload, onloadsCalled,
    thereWasError, thereWasSuccess;
  numberOfImages = imgSrcs.length;
  thereWasSuccess = false;
  thereWasError = false;

  imgs = [];

  onloadsCalled = 0;
  onload = function () {
    // Note:
    //   this = Image
    if (!thereWasError) {
      onloadsCalled += 1;
      var isFinalImage = (onloadsCalled === numberOfImages);
      if (isFinalImage) {
        thereWasSuccess = true;
        then(null, imgs);
      }
    }
  };

  onerror = function (errMsg) {
    // Note:
    //   this = Image

    // No errors after success.
    if (!thereWasSuccess) {
      thereWasError = true;
      then(errMsg, null);
    }

    // Prevent firing the default event handler
    // https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers.onerror#Parameters
    return true;
  };

  for (i = 0; i < imgSrcs.length; i += 1) {
    imgs.push(new Image());
    imgs[i].onload = onload;
    imgs[i].onerror = onerror;
    imgs[i].src = imgSrcs[i];
  }
};
