var tickWave = require('./model/tickWave')

module.exports = function (state, wave) {
  var dt = 0.1
  var ticks = wave.options.burnInSeconds / dt

  for (var i = 0; i < ticks; i += 1) {
    tickWave(state, wave, 0.1)
  }
}
