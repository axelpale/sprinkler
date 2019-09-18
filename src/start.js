var DEFAULT_OPTIONS = require('./defaultOptions')
var pickValid = require('./lib/pickValid')
var animate = require('./animate')
var burnIn = require('./burnIn')

module.exports = function (state) {
  return function (imageUrls, options) {
    // Begin dropping images.
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

    // Create a new wave object.
    var wave = {
      particles: [],
      imageUrls: imageUrls,
      options: options
    }
    state.waves.push(wave)

    // Prerun the wave according to options to
    // fill the canvas immediately.
    burnIn(state, wave)

    // Ensure animation has begun
    animate(state)

    return function () {
      // A stop function. Remove the wave.
      state.waves = state.waves.filter(function (w) {
        return w !== wave
      })

      // TODO if no waves, delete canvas
      // TODO if no canvases, stop animation.
    }
  }
}
