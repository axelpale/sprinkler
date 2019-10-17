module.exports = function (angle, width, height) {
  // The width of a rectangle when looked from a certain angle.
  return Math.abs(width * Math.sin(angle)) + Math.abs(height * Math.cos(angle))
}
