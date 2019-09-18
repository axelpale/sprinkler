var hasProp = require('./lib/hasProp')

// Cache images here.
// A map from image urls to Image objects.
var loadedImages = {}

var drawWave = function (ctx, wave) {
  var i, p, img, w, h

  for (i = 0; i < wave.particles.length; i += 1) {
    p = wave.particles[i]

    if (hasProp(loadedImages, p.imageUrl)) {
      img = loadedImages[p.imageUrl]
    } else {
      img = new window.Image()
      img.src = p.imageUrl
      loadedImages[p.imageUrl] = img
    }

    // Draw only completed images
    if (img.complete) {
      w = p.z * img.width
      h = p.z * img.height

      ctx.globalAlpha = p.a
      ctx.translate(p.x, p.y)
      ctx.rotate(p.r)
      ctx.drawImage(
        img,
        -Math.floor(w / 2), // gravity to image center
        -Math.floor(h / 2),
        w, h
      )

      ctx.setTransform(1, 0, 0, 1, 0, 0) // resetTransform
      ctx.globalAlpha = 1 // reset alpha
    }
  }
}

module.exports = function (state) {
  var canvasId, waveId, canvas, ctx, canvasState
  for (canvasId in state.canvases) {
    if (hasProp(state.canvases, canvasId)) {
      // Everything is drawn on canvas.
      canvas = document.getElementById(canvasId)
      ctx = canvas.getContext('2d')
      canvasState = state.canvases[canvasId]

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw each wave
      for (waveId in canvasState.waves) {
        if (hasProp(canvasState.waves, waveId)) {
          drawWave(ctx, canvasState.waves[waveId])
        }
      }
    }
  }
}
