var hasProp = require('./hasProp')

module.exports = function (source, reference) {
  // Pick valid properties from source.
  // A valid option exist in the reference object and is same type.
  //
  // Return
  //   an object validated by the reference
  //
  var r = {}
  var k
  for (k in source) {
    if (hasProp(source, k)) {
      if (hasProp(dest, k)) {
        if (typeof source[k] === typeof dest[k]) {
          r[k] = source[k]
        }
      }
    }
  }
  return r
}
