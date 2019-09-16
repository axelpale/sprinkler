var hasProp = require('./hasProp')

module.exports = function (source, dest) {
  // Purpose: fill valid options to default options object.
  // Valid option in a source exist in dest and is same type.
  // Return
  //   nothing, modifies dest in place.
  var k
  for (k in source) {
    if (hasProp(source, k)) {
      if (hasProp(dest, k)) {
        if (typeof source[k] === typeof dest[k]) {
          dest[k] = source[k]
        }
      }
    }
  }
}
