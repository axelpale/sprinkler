var fitOnResize = require('./lib/fitOnResize')
var listen = require('./listen')
var start = require('./start')
var drop = require('./drop')

exports.create = function (canvas, opts) {
  var state = {
    canvas: canvas,
    loadedImages: {}, // a map from URL-string to Image object.
    waves: []
  }

  if (typeof opts !== 'object') {
    opts = {}
  }

  // Make canvas resize automatically to full window area
  if (opts.responsive !== false) {
    fitOnResize(canvas)
  }

  // Make particles clickable.
  listen(canvas, state)

  return {
    start: start(state),
    drop: drop(state)
  }
}

// *******
// Version
// *******
exports.version = require('./version')
