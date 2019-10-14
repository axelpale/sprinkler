module.exports = function (ctx, p) {
  if (!p.image.complete) {
    return
  }

  var w = p.z * p.image.width
  var h = p.z * p.image.height

  ctx.globalAlpha = p.a
  ctx.translate(p.x, p.y)
  ctx.rotate(p.r)
  ctx.drawImage(
    p.image,
    -w / 2, // gravity to image center
    -h / 2,
    w, h
  )

  ctx.setTransform(1, 0, 0, 1, 0, 0) // resetTransform
  ctx.globalAlpha = 1 // reset alpha
}
