exports.randomIn = function (min, max) {
  // Continuous uniform distribution.
  // Return x: min <= x < max
  var d = max - min
  return min + d * Math.random()
}

exports.randomPick = function (array) {
  // Return one randomly picked element.
  // Discrete uniform distribution.
  var min = 0
  var max = array.length
  var continuousIndex = exports.randomIn(min, max)
  var discreteIndex = Math.floor(continuousIndex)
  return array[discreteIndex]
}

exports.randomPicks = function (array, n) {
  // Return an array of randomly picked elements.
  var i, idx
  var max = array.length
  var picks = []
  for (i = 0; i < n; i += 1) {
    idx = Math.floor(exports.randomIn(0, max))
    picks.push(array[idx])
  }
  return picks
}

exports.samplePoisson = function (rate) {
  // Purpose: number of images to drop in each interval.
  // Take a sample from poisson distribution.
  // https://en.wikipedia.org/wiki/Poisson_distribution#Generating_Poisson-distributed_random_variables
  var L, k, p, u
  L = Math.exp(-rate)
  k = 0
  p = 1
  do {
    k += 1
    u = Math.random()
    p *= u
  } while (p > L)
  return k - 1
}
