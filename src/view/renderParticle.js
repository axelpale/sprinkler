module.exports = function (ctx, p, img) {
  if (!img.complete) {
    return
  }

  var w = p.z * img.width
  var h = p.z * img.height

  ctx.globalAlpha = p.a
  ctx.translate(p.x, p.y)
  ctx.rotate(p.r)
  ctx.drawImage(
    img,
    -Math.floor(w / 2), // gravity to image center
    -Math.floor(h / 2),
    w, h
  )

  ctx.setTransform(1, 0, 0, 1, 0, 0) // resetTransform
  ctx.globalAlpha = 1 // reset alpha
}
