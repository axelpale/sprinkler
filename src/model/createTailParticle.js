var stat = require('../lib/stat')

module.exports = function (state, wave, p, i) {
  var tail = wave.options.tail

  var imageUrl
  if (typeof tail.imageUrls === 'object') {
    if (Array.isArray(tail.imageUrls)) {
      imageUrl = stat.randomPick(tail.imageUrls)
    } else {
      imageUrl = stat.sampleDistribution(tail.imageUrls)
    }
  } else {
    throw new Error('Invalid tail.imageUrls')
  }

  var angle = wave.options.angle
  var sn = Math.sin(angle)
  var cs = Math.cos(angle)

  var xo = tail.xOff * cs - tail.yOff * sn
  var yo = tail.xOff * sn + tail.yOff * cs

  // Cumulative decay product
  var dprod = Math.pow(tail.decay, i)

  // Cumulative decay sum
  var dsum
  if (tail.decay === 1) {
    dsum = tail.decay * i
  } else {
    dsum = (1 - dprod) / (1 - tail.decay)
  }

  return {
    x: p.x + xo + dsum * (tail.x * cs - tail.y * sn),
    y: p.y + yo + dsum * (tail.x * sn + tail.y * cs),
    z: dprod * p.z,
    r: p.r,
    a: p.a,
    dx: p.dx,
    dy: p.dy,
    dz: p.dz,
    dr: p.dr,
    da: p.da,
    ddx: p.ddx,
    ddy: p.ddy,
    ddz: p.ddz,
    ddr: p.ddr,
    dda: p.dda,
    imageUrl: imageUrl,
    dist: 0
  }
}
