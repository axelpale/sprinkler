var hasProp = require('./lib/hasProp')
var tickCanvas = require('./tickCanvas')

// Model is simulated forward every frame
module.exports = function (state, dt) {
  var canvasId
  for (canvasId in state.canvases) {
    if (hasProp(state.canvases, canvasId)) {
      // Everything is drawn on canvas.
      var canvasState = state.canvases[canvasId]
      var canvas = document.getElementById(canvasId)

      // Ensure up-to-date width and height
      canvasState.width = canvas.width
      canvasState.height = canvas.height

      tickCanvas(canvasState, dt)
    }
  }
}
