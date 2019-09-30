var createTailParticle = require('./createTailParticle')

module.exports = function (state, wave, p) {
  var tail = wave.options.tail

  if (typeof tail === 'object') {

  } else {
    return []
  }

  if (Number.isInteger(tail.length) && tail.length > 0) {
    var i, pi
    var tailParticles = []
    for (i = 0; i < tail.length; i += 1) {
      pi = createTailParticle(state, wave, p, i)
      tailParticles.push(pi)
    }
    return tailParticles
  }

  return []
}
