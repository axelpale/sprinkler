var prepareOptions = require('./prepareOptions')
var createParticle = require('./model/createParticle')
var createTailParticles = require('./model/createTailParticles')
var animate = require('./animate')
var burnIn = require('./burnIn')
var bins = require('./lib/bins')

module.exports = function (state) {
  return function (imageUrls, options) {
    // Drop single image.
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
    //   -
    //

    var validOptions = prepareOptions(options)

    if (typeof imageUrls !== 'object') {
      throw new Error('Invalid imageUrls')
    }

    // Prepare possible distribution for O(log n) efficiency. See issue #14
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
      running: false, // to prevent creation of new particles.
      started: true
    }

    // Create the particle and its tail.
    var p = createParticle(state, wave)
    var t = createTailParticles(state, wave, p)
    wave.particles = t.concat([p])

    // Add wave to the animation.
    state.waves.push(wave)

    // Prerun the wave according to options to
    // fill the canvas immediately.
    burnIn(state, wave)

    // Ensure animation has begun.
    animate(state)
  }
}
