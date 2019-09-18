// A bit of pseudo-code
//
// tickModel
//   var dt
//   for each canvas
//   canvasParticles = canvasParticles.filterOut(particlesOutsideOrTimeout)
//
//   for each particle in canvasParticles
//     tick(particle)
//
//   for each startOptions
//     var newParticles = createParticles(imageUrls, startOptions, dt)
//     canvasParticles = [].concat(canvasParticles, newParticles)
//
// tickView
//   drawCanvas(canvasId, loadedImages, canvasParticles)
//
var tickState = require('./tickState')
var drawState = require('./drawState')

// To indicate if started.
// Maybe to pause the animation in the future.
var running = false

// number, unix timestamp milliseconds of most recent frame.
var past = null

var animationLoop = function (state) {
  var present, dtms

  // Time difference from previous frame in milliseconds
  present = Date.now()
  dtms = (past === null) ? 0 : present - past
  past = present

  // Update Model
  tickState(state, dtms / 1000) // secs

  // Draw; View current model
  drawState(state)

  // Recursion
  // Allow only one viewLoop recursion at a time.
  if (running) {
    window.requestAnimationFrame(function () {
      animationLoop(state)
    })
  }
}

module.exports = function (state) {
  if (!running) {
    running = true
    animationLoop(state)
  }
}
