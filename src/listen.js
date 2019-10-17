var hit = function (p, x, y) {
  // Test if the (x,y) hits the particle.
  if (p.image.complete) {
    var wr = p.z * p.image.width / 2
    var hr = p.z * p.image.height / 2
    return (Math.abs(p.x - x) < wr) && (Math.abs(p.y - y) < hr)
  }
  return false
}

module.exports = function (canvas, state) {
  // On click, search for a particle that is under the point of the event.
  // Search in order that is a reverse of the drawing order.
  // This way the topmost particle is found first.
  //
  canvas.addEventListener('click', function (ev) {
    var i, j, wave, p
    for (i = state.waves.length - 1; i >= 0; i -= 1) {
      wave = state.waves[i]
      for (j = wave.particles.length - 1; j >= 0; j -= 1) {
        p = wave.particles[j]

        if (hit(p, ev.offsetX, ev.offsetY)) {
          wave.particles[j] = wave.options.clickModifier(p)

          // Hit only one
          return
        }
      }
    }
  })
}
