var stat = require('../lib/stat')
var projectedWidth = require('../lib/projectedWidth')
var createParticle = require('./createParticle')
var createTailParticles = require('./createTailParticles')

module.exports = function (state, wave, dt) {
  // Create particles.
  var i, p, t

  // Scale the spawn rate according to canvas width
  // if constantDensity is wanted.
  var w = state.canvas.width
  var h = state.canvas.height
  var widthFactor
  if (wave.options.constantDensity) {
    widthFactor = projectedWidth(wave.options.angle + Math.PI / 2, w, h) / 1000
  } else {
    widthFactor = 1
  }
  var particlesInDt = dt * wave.options.imagesInSecond * widthFactor
  var numOfNewParticles = stat.samplePoisson(particlesInDt)

  var newParticles = []
  for (i = 0; i < numOfNewParticles; i += 1) {
    p = createParticle(state, wave)
    t = createTailParticles(state, wave, p)
    newParticles = newParticles.concat([p], t)
  }

  return newParticles
}
