var pickValid = require('./lib/pickValid')
var hasProp = require('./lib/hasProp')
var DEFAULT_OPTIONS = require('./defaultOptions')

// A map from image urls to window.Image objects
var state = {
  loadedImages: {},
  canvases: {} // a map from canvasId -> waveId -> waveState
}

exports.start = function (canvasId, imageUrls, options) {
  // Begin dropping given images on the given canvas.
  //
  // Parameters:
  //   canvasId: an element id string e.g. 'myCanvas'
  //   imageUrls: array of image url strings
  //   options: an optional object
  //     imageUrls: an array of images url strings
  //     imagesInSecond: 7,
  //     stopAfter: Infinity,
  //     onStop: optional function, called on stop
  //     // Particle positions at spawn
  //     zMin, zMax: initial scale range
  //     rMin, rMax: initial rotation range
  //     aMin, aMax: initial sprite alpha/transparency range
  //     // Particle speeds at spawn
  //     dxMin, dxMax: horizontal
  //     dyMin, dyMax: vertical
  //     dzMin, dzMax: scale
  //     drMin, drMax: angular velocity
  //     daMin, daMax: transparency (fade speed)
  //     // Particle acceleration
  //     ddxMin, ddxMax: horizontal
  //     ddyMin, ddyMax: vertical
  //     ddzMin, ddzMax: scale
  //     ddrMin, ddrMax: rotation
  //     ddaMin, ddaMax: transparency
  //
  // Return
  //   a stop function. Call to stop the animation.
  //

  // No options object given.
  if (typeof options === 'undefined') {
    options = {}
  }

  // Invalid parameter
  if (Object.prototype.toString.call(options) !== '[object Object]') {
    throw new Error('Invalid options: ' + JSON.stringify(options))
  }

  // Filter: pick all valid options.
  var options = pickValid(options, DEFAULT_OPTIONS)

  // Create new wave object
  var waveId = Math.random().toString()
  if (typeof state.canvases[canvasId] === 'undefined') {
    state.canvases[canvasId] = {}
  }
  state.canvases[canvasId][waveId] = {
    particles: [],
    options: options
  }

  // Ensure animation has begun
  animate(state)

  return function () {
    // A stop function
    delete state.canvases[canvasId][waveId]
  }
}
