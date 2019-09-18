module.exports = function (cw, ch) {
  // Parameters:
  //   cw: canvas width
  //   ch: canvas height
  //
  // Returns a filter which filters out old particles.
  //
  var minDistance = Math.max(cw, ch) / 2

  return function (p) {
    // Return true if particle at least partially inside the canvas
    // or if the particle has traveled less than sprite height
    var left = p.x - minDistance
    var right = p.x + minDistance
    var top = p.y - minDistance
    var bottom = p.y + minDistance

    if (left < cw && right > 0 && top < ch && bottom > 0) {
      return true
    }

    if (p.dist < minDistance) {
      return true
    }

    return false
  }
}
