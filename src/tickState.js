var tickWave = require('./tickWave')

module.exports = function (state, dt) {
  // Parameters
  //   state
  //   dt
  //     simulation time, seconds
  //

  // To avoid huge wave of particles when the page gains focus after a while,
  // the particles are created only if dt is close to given framerate.
  if (dt > 0.5) {
    return
  }

  // Simulate each wave. Each wave has its own options.
  state.waves.forEach(function (wave) {
    tickWave(state, wave, dt)
  })
}
