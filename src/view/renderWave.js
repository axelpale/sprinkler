module.exports = function (ctx, wave) {
  var i, p
  var renderParticle = wave.options.particleRenderer

  for (i = 0; i < wave.particles.length; i += 1) {
    p = wave.particles[i]
    renderParticle(ctx, p, p.image)
    // NOTE: p.image is for compatibility with the custom particle renderers.
  }
}
