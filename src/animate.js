// Animate: call model update and view render at each animation frame.
//
var tickState = require('./tickState')
var render = require('./view/render')

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

  // DEBUG
  // console.log('num of particles', state.canvases.reduce(function (acc, c) {
  //   return c.waves.reduce((ac, w) => {
  //     return ac + w.particles.length
  //   }, acc)
  // }, 0))

  // Draw; View current model
  render(state)

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
