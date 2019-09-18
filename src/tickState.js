var tickCanvas = require('./tickCanvas')

module.exports = function (state, dt) {
  state.canvases.forEach(function (canvasState) {
    var canvas = document.getElementById(canvasState.canvasId)
    // TODO there is no such canvas

    // Ensure up-to-date width and height
    canvasState.width = canvas.width
    canvasState.height = canvas.height

    tickCanvas(canvasState, dt)
  })
}
