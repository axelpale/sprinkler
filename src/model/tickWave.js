var createParticleFilter = require('./createParticleFilter')
var tickParticle = require('./tickParticle')
var createParticles = require('./createParticles')

module.exports = function (state, wave, dt) {
  // Parameters
  //   state
  //   dt
  //     simulation time, seconds
  //

  var isNeeded = createParticleFilter(state.canvas.width, state.canvas.height)

  // Remove old particles
  wave.particles = wave.particles.filter(isNeeded)

  // Simulate existing particles
  wave.particles.forEach(function (p) {
    tickParticle(p, dt)
  })

  if (wave.running) {
    // Create new particles.
    var newParticles = createParticles(state, wave, dt)
    wave.particles = wave.particles.concat(newParticles)
  } else {
    // Wave is not running.
    if (wave.started && wave.particles.length === 0) {
      // Wave has run and has no particles anymore.
      // Thus it can be removed.
      wave.alive = false
    }
  }
}
