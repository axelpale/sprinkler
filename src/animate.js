// Animate: call model update and view render at each animation frame.
//
var tick = require('./model/tick')
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
  tick(state, dtms / 1000) // secs

  // DEBUG Number of Particles
  // console.log('num of particles', state.waves.reduce(function (acc, w) {
  //   var p = w.particles[0]
  //   if (p) console.log('x', p.x, '| y', p.y)
  //   return acc + w.particles.length
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

  // Allow hooking ccapture to record the animation frame by frame.
  if (state.options.postAnimationFrame) {
    state.options.postAnimationFrame(state)
  }
}

module.exports = function (state) {
  if (!running) {
    running = true
    animationLoop(state)
  }
}
