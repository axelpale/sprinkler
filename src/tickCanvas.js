var createParticleFilter = require('./createParticleFilter')
var tickParticle = require('./tickParticle')
var createParticles = require('./createParticles')

module.exports = function (canvasState, dt) {
  // Parameters
  //   canvasState
  //   dt
  //     simulation time, seconds
  //

  // To avoid huge wave of particles when the page gains focus after a while,
  // the particles are created only if dt is close to given framerate.
  if (dt > 0.5) {
    return
  }

  var isNeeded = createParticleFilter(canvasState.width, canvasState.height)

  // Simulate each wave. Each wave has its own options.
  canvasState.waves.forEach(function (wave) {
    // Remove old particles
    wave.particles = wave.particles.filter(isNeeded)

    // Simulate existing particles
    wave.particles.forEach(function (p) {
      tickParticle(p, dt)
    })

    // Create new particles.
    var newParticles = createParticles(wave, dt)
    wave.particles = wave.particles.concat(newParticles)
  })
}
