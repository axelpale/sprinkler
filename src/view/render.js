var renderWave = require('./renderWave')

module.exports = function (state) {
  // Everything is drawn on canvas.
  var ctx = state.canvas.getContext('2d')

  // First, clear the canvas
  ctx.clearRect(0, 0, state.canvas.width, state.canvas.height)

  // Then, render waves
  state.waves.forEach(function (wave) {
    renderWave(ctx, wave)
  })
}
