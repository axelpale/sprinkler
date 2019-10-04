var hasProp = require('../lib/hasProp')

module.exports = function (loadedImages, ctx, wave) {
  var i, p, img

  var renderParticle = wave.options.particleRenderer

  for (i = 0; i < wave.particles.length; i += 1) {
    p = wave.particles[i]

    if (typeof p.imageUrl === 'string') {
      // Init or reuse image
      if (hasProp(loadedImages, p.imageUrl)) {
        img = loadedImages[p.imageUrl]
      } else {
        img = new window.Image()
        img.src = p.imageUrl
        loadedImages[p.imageUrl] = img
      }
    } else {
      // Possibly data for custom particle renderer.
      img = p.imageUrl
    }

    renderParticle(ctx, p, img)
  }
}
