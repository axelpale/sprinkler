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
  state.canvases.forEach(function (canvasState) {
    // Everything is drawn on canvas.
    var canvas = document.getElementById(canvasState.canvasId)
    var ctx = canvas.getContext('2d')

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw each wave
    canvasState.waves.forEach(function (wave) {
      drawWave(ctx, wave)
    })
  })
}
