var minibus = require('minibus')
var fitOnResize = require('./lib/fitOnResize')
var listen = require('./listen')
var start = require('./start')
var drop = require('./drop')

exports.create = function (canvas, opts) {
  if (typeof opts !== 'object') {
    opts = {}
  }

  // It is important to create the bus separately from the state object
  // because somewhere someone can replace the current state object
  // thus breaking bus bindings here.
  var bus = minibus.create()

  var state = {
    bus: bus,
    canvas: canvas,
    loadedImages: {}, // a map from URL-string to Image object.
    waves: [],
    options: opts
  }

  // Make canvas resize automatically to full window area
  if (opts.responsive !== false) {
    fitOnResize(canvas)
  }

  // Make particles clickable.
  // TODO if (opts.clickable === true) {}
  listen(canvas, state)

  return {
    start: start(state),
    drop: drop(state),
    on: function (evName, cb) {
      // User app calls rain.on('particle-created')
      // User app calls rain.on('particle-deleted')
      bus.on(evName, cb)
    }
  }
}

// *******
// Version
// *******
exports.version = require('./version')
