var projectedWidth = require('../lib/projectedWidth')
var hasProp = require('../lib/hasProp')
var bins = require('../lib/bins')
var stat = require('../lib/stat')
var randomIn = stat.randomIn

// We use this to add particles into the model.
module.exports = function (state, wave) {
  // Return a particle object.
  //
  var opts = wave.options

  // Pick image for the particle.
  var imageUrl
  if (wave.imageUrlsBins) {
    imageUrl = bins.sample(wave.imageUrlsBins)
  } else {
    // Urls given as a plain array. Uniform distribution.
    imageUrl = stat.randomPick(wave.imageUrls)
  }

  // Setup Image object
  var image
  if (typeof imageUrl === 'string') {
    // Init or reuse image
    if (hasProp(state.loadedImages, imageUrl)) {
      image = state.loadedImages[imageUrl]
    } else {
      // Download begins.
      image = new window.Image()
      image.src = imageUrl
      state.loadedImages[imageUrl] = image
    }
  } else {
    // Possibly data for custom particle renderer.
    image = imageUrl
  }

  // Find distance to the spawn line.
  var angle = opts.angle
  var w = state.canvas.width
  var h = state.canvas.height
  var diag = projectedWidth(angle, w, h) // NOTE 0 angle here means to right.
  // Particle size affects the spawning distance.
  // We try to spawn particles as close to the canvas as possible to keep
  // the number of particles low.
  var psize = wave.options.particleSize({
    image: image,
    imageUrl: imageUrl
  })
  var radius = opts.zMax * Math.max(psize.width, psize.height) + diag / 2

  // A vector from the canvas center to the spawn line center.
  // sin(0) = 0
  // cos(0) = 1
  // sin(270) = 0.6
  // cos(270) = -0.6
  var sn = Math.sin(angle)
  var cs = Math.cos(angle)
  var ax = radius * sn
  var ay = radius * -cs

  // The spawn line: a vector orthogonal to [ax, ay].
  var splen = projectedWidth(angle + Math.PI / 2, w, h)
  var spx = splen * -ay / radius
  var spy = splen * ax / radius

  // Define x-wise distribution.
  // Continuous or discrete.
  var unit
  var steps = opts.xSteps + 1 // +1 to correlate what is visible
  if (Number.isInteger(opts.xSteps)) {
    unit = Math.floor(steps * Math.random()) / steps
  } else {
    unit = Math.random()
  }

  // Pick a random point from the spawn line.
  var r = unit - 0.5 + opts.xOff
  var bx = spx * r
  var by = spy * r

  var rdx = randomIn(opts.dxMin, opts.dxMax)
  var rdy = randomIn(opts.dyMin, opts.dyMax)
  var rddx = randomIn(opts.ddxMin, opts.ddxMax)
  var rddy = randomIn(opts.ddyMin, opts.ddyMax)

  return {
    x: w / 2 + ax + bx, // start point
    y: h / 2 + ay + by,
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
    image: image,
    dist: 0
  }
}
