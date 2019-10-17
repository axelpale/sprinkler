var prepareOptions = require('./prepareOptions')
var animate = require('./animate')
var burnIn = require('./burnIn')
var bins = require('./lib/bins')

module.exports = function (state) {
  return function (imageUrls, options) {
    // Begin dropping images.
    //
    // Parameters:
    //   imageUrls: array or distribution of image url strings
    //   options: an optional object. See README for docs.
    //
    // TODO
    //   options.delay or .wait
    //   options.stopAfter ... Rather easy for user to implement w/ setTimeout
    //   options.onStop: optional function, called on stop
    //
    // Return
    //   a stop function. Call to stop the animation.
    //

    var validOptions = prepareOptions(options)

    if (typeof imageUrls !== 'object') {
      throw new Error('Invalid imageUrls')
    }

    // Prepare distributions. See issue #14
    var imageUrlsBins = null
    if (!Array.isArray(imageUrls)) {
      // Is a distribution.
      imageUrlsBins = bins.create(imageUrls)
    }

    // Create a new wave object.
    var wave = {
      alive: true,
      imageUrls: imageUrls,
      imageUrlsBins: imageUrlsBins,
      options: validOptions,
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
