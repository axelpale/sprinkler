var stat = require('../lib/stat')
var bins = require('../lib/bins')
var createTailParticles = require('./createTailParticles')
var randomIn = stat.randomIn

// We use this to add particles in to the model.
var createParticle = function (state, wave) {
  var opts = wave.options

  var imageUrl
  if (wave.imageUrlsBins) {
    imageUrl = bins.sample(wave.imageUrlsBins)
  } else {
    // Urls given as a plain array. Uniform distribution.
    imageUrl = stat.randomPick(wave.imageUrls)
  }

  var angle = opts.angle
  var w = state.canvas.width
  var h = state.canvas.height

  // Use screen diagonal as distance from screen center.
  // This leaves room for large sprites.
  var radius = Math.sqrt(w * w, h * h)

  // sin(0) = 0
  // cos(0) = 1
  // sin(270) = 0.6
  // cos(270) = -0.6

  var sn = Math.sin(angle)
  var cs = Math.cos(angle)
  var ax = radius * sn
  var ay = radius * -cs

  // Define x distribution.
  // Continuous or discrete.
  var unit
  var steps = opts.xSteps + 1 // +1 to correlate what is visible
  if (Number.isInteger(opts.xSteps)) {
    unit = Math.floor(steps * Math.random()) / steps
  } else {
    unit = Math.random()
  }

  // Use diagonal as rain width. OPTIMIZE use real minimal width.
  // Take a point on orthogonal diagonal. Then a vector from its center.
  // Enlarge the vector so that the rain is wide enough to fill corners.
  var r = unit - 0.5
  var bx = 1.5 * -ay * r
  var by = 1.5 * ax * r

  var rdx = randomIn(opts.dxMin, opts.dxMax)
  var rdy = randomIn(opts.dyMin, opts.dyMax)
  var rddx = randomIn(opts.ddxMin, opts.ddxMax)
  var rddy = randomIn(opts.ddyMin, opts.ddyMax)

  return {
    x: (w / 2) + ax + bx, // randomize start point
    y: (h / 2) + ay + by,
    z: randomIn(opts.zMin, opts.zMax),
    r: angle + randomIn(opts.rMin, opts.rMax),
    a: randomIn(opts.aMin, opts.aMax),
    dx: rdx * cs - rdy * sn,
    dy: rdx * sn + rdy * cs,
    dz: randomIn(opts.dzMin, opts.dzMax),
    dr: randomIn(opts.drMin, opts.drMax),
    da: randomIn(opts.daMin, opts.daMax),
    ddx: rddx * cs - rddy * sn, // rotate
    ddy: rddx * sn + rddy * cs,
    ddz: randomIn(opts.ddzMin, opts.ddzMax),
    ddr: randomIn(opts.ddrMin, opts.ddrMax),
    dda: randomIn(opts.ddaMin, opts.ddaMax),
    imageUrl: imageUrl,
    dist: 0
  }
}

module.exports = function (state, wave, dt) {
  // Create particles
  var i, p, t
  var widthFactor = state.canvas.width / 1000
  var particlesInDt = dt * wave.options.imagesInSecond * widthFactor
  var numOfNewParticles = stat.samplePoisson(particlesInDt)
  var newParticles = []

  for (i = 0; i < numOfNewParticles; i += 1) {
    p = createParticle(state, wave)
    t = createTailParticles(state, wave, p)
    newParticles = newParticles.concat([p], t)
  }

  return newParticles
}
