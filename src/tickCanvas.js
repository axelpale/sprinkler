var hasProp = require('./lib/hasProp')
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
  var waveId, wave, i, newParticles
  for (waveId in canvasState.waves) {
    if (hasProp(canvasState.waves, waveId)) {
      wave = canvasState.waves[waveId]

      // Remove old particles
      wave.particles = wave.particles.filter(isNeeded)

      // Simulate existing particles
      for (i = 0; i < wave.particles.length; i += 1) {
        tickParticle(wave.particles[i], dt)
      }

      // Create new particles.
      newParticles = createParticles(wave, dt)
      wave.particles = wave.particles.concat(newParticles)
    }
  }
}
