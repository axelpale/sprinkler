var renderWave = require('./renderWave')

// Cache images here.
// A map from image urls to Image objects.
var loadedImages = {}

module.exports = function (state) {
  // Everything is drawn on canvas.
  var ctx = state.canvas.getContext('2d')

  // First, clear the canvas
  ctx.clearRect(0, 0, state.canvas.width, state.canvas.height)

  // Then, render waves
  state.waves.forEach(function (wave) {
    renderWave(loadedImages, ctx, wave)
  })
}
