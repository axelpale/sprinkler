var fitOnResize = require('./lib/fitOnResize')
var start = require('./start')
var drop = require('./drop')

exports.create = function (canvas) {
  var state = {
    canvas: canvas,
    loadedImages: {}, // a map from URL-string to Image object.
    waves: []
  }

  // Make canvas resize automatically to full window area
  fitOnResize(canvas)

  return {
    start: start(state),
    drop: drop(state)
  }
}

// *******
// Version
// *******
exports.version = require('./version')
