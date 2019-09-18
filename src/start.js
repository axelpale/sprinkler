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
    //     imagesInSecond: number of images per second per 1000 px of width
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
    // TODO
    //   options.delay or .wait
    //   options.stopAfter ... Rather easy for user to implement w/ setTimeout
    //   options.onStop: optional function, called on stop
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
      alive: true,
      imageUrls: imageUrls,
      options: options,
      particles: [],
      running: true,
      started: true // for possible future delay option
    }
    state.waves.push(wave)

    // Prerun the wave according to options to
    // fill the canvas immediately.
    burnIn(state, wave)

    // Ensure animation has begun
    animate(state)

    return function () {
      // A stop function. Stop the wave.
      // We cannot yet remove the wave because there are particles.
      wave.running = false
      // wave.alive is still true.
    }
  }
}
