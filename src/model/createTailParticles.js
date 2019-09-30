var createTailParticle = require('./createTailParticle')

module.exports = function (state, wave, p) {
  var tail = wave.options.tail

  var i, pi
  var tailParticles = []
  for (i = 0; i < tail.length; i += 1) {
    pi = createTailParticle(state, wave, p, i)
    tailParticles.push(pi)
  }
  return tailParticles
}
