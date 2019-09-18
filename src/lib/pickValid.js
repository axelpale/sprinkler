var hasProp = require('./hasProp')

module.exports = function (source, reference) {
  // Pick valid properties from source and others from the reference.
  // A valid option exist in the reference object and is same type.
  //
  // Return
  //   an object validated by the reference
  //
  var r = {}
  var k
  for (k in reference) {
    if (hasProp(reference, k)) {
      r[k] = reference[k]
      if (hasProp(source, k)) {
        if (typeof source[k] === typeof reference[k]) {
          r[k] = source[k]
        }
      }
    }
  }
  return r
}
