var fitOnResize = require('./lib/fitOnResize')
var start = require('./start')

exports.create = function (canvas) {
  var state = {
    canvas: canvas,
    loadedImages: {}, // a map from URL-string to Image object.
    waves: []
  }

  // Make canvas resize automatically to full window area
  fitOnResize(canvas)

  return {
    start: start(state)
  }
}

// *******
// Version
// *******
exports.version = require('./version')
