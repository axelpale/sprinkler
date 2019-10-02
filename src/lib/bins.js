var hasProp = require('./hasProp')

exports.searchBin = function (ar, x) {
  // Find bin for x in an ordered array ar.
  //
  // Parameters:
  //   ar: an ordered array of numbers
  //   x: a number
  //
  // Return:
  //   integer as an index to bin in ar.
  //   -1 if array is empty.

  // Inclusive range [m, n]
  var m = 0
  var n = ar.length - 1

  var k, cum

  while (m < n) {
    k = (m + n) >> 1 // floor divide by two
    cum = ar[k]

    if (x <= cum) {
      // Correct bin is on the left side of divider k.
      // Last possible element is at k.
      //
      // Note: ar might have subsequent duplicates.
      // The one with lowest index is the correct one.
      // Thus if x == cum, the right call is to place the tail n to k.
      n = k
    } else {
      // x on the right side of k
      m = k + 1
    }
  }

  return n
}

exports.create = function (dist) {
  // Parameters:
  //   dist
  //     object, a map from key to weight
  //
  // Returns:
  //   prepared bin distribution object
  //
  var cumulative = []
  var keys = []
  var sum = 0

  var key
  for (key in dist) {
    if (hasProp(dist, key)) {
      sum += dist[key]
      keys.push(key)
      cumulative.push(sum)
    }
  }

  return {
    keys: keys,
    cumulative: cumulative,
    total: sum
  }
}

exports.sample = function (bins) {
  // Parameters:
  //   bins
  //     a prepared bin distribution object. See create().
  //
  var r = bins.total * Math.random()
  var index = exports.searchBin(bins.cumulative, r)
  return bins.keys[index]
}
