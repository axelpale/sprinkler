module.exports = function (cw, ch) {
  // Parameters:
  //   cw: canvas width
  //   ch: canvas height
  //
  // Returns a filter which filters out old particles.
  //
  // The filter returns true if particle at least partially inside the canvas
  // or if the particle has traveled less than sprite height
  //
  var diagonal = Math.sqrt(cw * cw, ch * ch)

  // Assumed particle max radius (width / 2 or height / 2)
  var pr = diagonal / 4

  return function (p) {
    var left = p.x - pr
    var right = p.x + pr
    var top = p.y - pr
    var bottom = p.y + pr

    // Is inside or partially inside canvas
    if (left < cw && right > 0 && top < ch && bottom > 0) {
      return true
    }

    if (p.dist < diagonal * 2) {
      return true
    }

    return false
  }
}
