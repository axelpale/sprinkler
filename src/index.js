var pickValid = require('./lib/pickValid')
var fitOnResize = require('./lib/fitOnResize')
var DEFAULT_OPTIONS = require('./defaultOptions')
var animate = require('./animate')

var state = {
  canvases: [] // an array of canvasStates
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

  // Filter: pick all valid options, take others from defaults.
  options = pickValid(options, DEFAULT_OPTIONS)

  // Create a new canvasState object if needed.
  var canvasState = state.canvases.find(function (canvasState) {
    return canvasState.canvasId === canvasId
  })

  // If not found, create.
  if (typeof canvasState === 'undefined') {
    var c = document.getElementById(canvasId)

    // Make canvas resize automatically to full window area
    fitOnResize(c)

    canvasState = {
      canvasId: canvasId,
      waves: [],
      width: 0,
      height: 0
    }

    state.canvases.push(canvasState)
  }

  // Create a new wave object.
  var waveState = {
    particles: [],
    imageUrls: imageUrls,
    options: options,
    canvasState: canvasState // for width and height
  }
  canvasState.waves.push(waveState)

  // Ensure animation has begun
  animate(state)

  return function () {
    // A stop function
    var cs = state.canvases.find(function (c) {
      return c.canvasId === canvasId
    })

    // Remove the wave
    cs.waves = cs.waves.filter(function (wave) {
      return wave !== waveState
    })

    // TODO if no waves, delete canvas
    // TODO if no canvases, stop animation.
  }
}

// *******
// Version
// *******
exports.version = require('./version')
