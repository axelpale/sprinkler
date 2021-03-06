// Animate: call model update and view render at each animation frame.
//
var tick = require('./model/tick')
var render = require('./view/render')

var animationLoop = function (state) {
  var present, dtms

  // Time difference from previous frame in milliseconds
  present = Date.now()
  dtms = (state.prevFrameTime === null) ? 0 : present - state.prevFrameTime
  state.prevFrameTime = present

  // Slow or speed up the animation
  dtms *= state.options.renderingStrategy.speedMultiplier

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
  // Allow only one animationLoop recursion at a time.
  if (state.running) {
    window.requestAnimationFrame(function () {
      animationLoop(state)
    })
  }

  // Allow hooking ccapture to record the animation frame by frame.
  if (state.options.postAnimationFrame) {
    state.options.postAnimationFrame(state)
  }
}

var constantLoop = function (state) {
  var strategy = state.options.renderingStrategy
  tick(state, strategy.simulatedInterval / 1000)
  render(state)
  window.setTimeout(function () {
    constantLoop(state)
  }, strategy.frameInterval)
}

module.exports = function (state) {
  if (!state.running) {
    state.running = true

    if (state.options.renderingStrategy.type === 'fixed') {
      constantLoop(state)
    } else {
      animationLoop(state)
    }
  }
}
