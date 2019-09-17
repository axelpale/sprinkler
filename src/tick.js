
var tickParticle = function (p, dt) {

}

var tickCanvas = function (canvasState, dt) {
  // Parameter
  //   dt
  //     simulation time, seconds
  var i, k, l, load, startOptions, h
  var bufferParticles, visible, pw, ph, maxRadius

  // To avoid huge wave of particles when the page gains focus after a while,
  // the particles are created only if dt is close to given framerate.
  if (dt > 0.5) {
    return
  }

  var cw = canvasState.width
  var ch = canvasState.height
  var minDistance = Math.max(cw, ch) / 2

  for each canvasState.waves {
    // Simulate each wave. Each wave has its own options.
    var wave = canvasState.waves[waveId]

    // Remove old particles
    wave.particles = wave.particles.filter(function (p) {
      // Return true if particle at least partially inside the canvas
      // or if the particle has traveled less than sprite height
      var left = p.x - p.z * p.w
      var right = p.x + p.z * p.w
      var top = p.y - p.z * p.h
      var bottom = p.y + p.z * p.h

      if (left < cw && right > 0 && top < ch && bottom > 0) {
        return true
      }

      if (p.d < minDistance) {
        return true
      }

      return false
    })

    // Simulate existing particles
    for (i = 0; i < wave.particles.length; i += 1) {
      tickParticle(wave.particles[i], dt)
    }

    // Create new particles.
    var newParticles = createParticles(imageUrls, wave.options, dt)
    wave.particles = wave.particles.concat(newParticles)
  }
}

// Model is simulated forward every frame
module.exports = function (state, dt) {
  var canvasId
  for (canvasId in state.canvases) {
    if (state.canvases.hasOwnProperty(canvasId)) {
      // Everything is drawn on canvas.
      var canvasState = state.canvases[canvasId]
      var canvas = document.getElementById(canvasId)
      canvasState.width = canvas.width
      canvasState.height = canvas.height
      tickCanvas(canvasState, dt)
    }
  }
}
