var drawWave = function (ctx, wave) {
  var i, p, imgW, imgH

  for (i = 0; i < wave.particles.length; i += 1) {
    p = wave.particles[i]
    if (p.complete) {
      ctx.globalAlpha = p.a
      imgW = p.z * p.w
      imgH = p.z * p.h
      ctx.translate(p.x, p.y)
      ctx.rotate(p.r)
      ctx.drawImage(
        p.img,
        -Math.floor(imgW / 2), // gravity to image center
        -Math.floor(imgH / 2),
        imgW, imgH
      )
      ctx.setTransform(1, 0, 0, 1, 0, 0) // resetTransform
      ctx.globalAlpha = 1 // reset alpha
    }
  }
}

module.exports = function (state) {
  var canvasId, waveId
  for (canvasId in state.canvases) {
    if (state.canvases.hasOwnProperty(canvasId)) {
      // Everything is drawn on canvas.
      var canvas = document.getElementById(canvasId)
      var ctx = canvas.getContext('2d')
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // Draw each wave
      for (waveId in state.canvases[canvasId]) {
        if (state.canvases[canvasId].hasOwnProperty(waveId)) {
          drawWave(ctx, state.canvases[canvasId][waveId])
        }
      }
    }
  }
}
