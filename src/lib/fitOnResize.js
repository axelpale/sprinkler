module.exports = function (canvas) {
  // Canvas is resized when window size changes, e.g.
  // when a mobile device is tilted.
  //
  // Parameter
  //   canvas
  //     HTML Canvas element
  //
  var resizeCanvas = function () {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
  }
  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false)
  // Initially resized to fullscreen.
  resizeCanvas()
}
