var stat = require('../lib/stat')
var samplePoisson = stat.samplePoisson
var randomPick = stat.randomPick
var randomIn = stat.randomIn

// We use this to add particles in to the model.
var createParticle = function (state, wave) {
  var opts = wave.options
  var imageUrl = randomPick(wave.imageUrls)

  return {
    x: randomIn(0, state.canvas.width), // randomize start point
    y: -state.canvas.height / 3, // begin above canvas top
    z: randomIn(opts.zMin, opts.zMax),
    r: randomIn(opts.rMin, opts.rMax),
    a: randomIn(opts.aMin, opts.aMax),
    dx: randomIn(opts.dxMin, opts.dxMax),
    dy: randomIn(opts.dyMin, opts.dyMax),
    dz: randomIn(opts.dzMin, opts.dzMax),
    dr: randomIn(opts.drMin, opts.drMax),
    da: randomIn(opts.daMin, opts.daMax),
    ddx: randomIn(opts.ddxMin, opts.ddxMax),
    ddy: randomIn(opts.ddyMin, opts.ddyMax),
    ddz: randomIn(opts.ddzMin, opts.ddzMax),
    ddr: randomIn(opts.ddrMin, opts.ddrMax),
    dda: randomIn(opts.ddaMin, opts.ddaMax),
    imageUrl: imageUrl
  }
}

module.exports = function (state, wave, dt) {
  var i
  var widthFactor = state.canvas.width / 1000
  var particlesInDt = dt * wave.options.imagesInSecond * widthFactor
  var numOfNewParticles = samplePoisson(particlesInDt)
  var newParticles = []

  for (i = 0; i < numOfNewParticles; i += 1) {
    newParticles.push(createParticle(state, wave))
  }

  return newParticles
}
