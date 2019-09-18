var stat = require('./lib/stat')
var samplePoisson = stat.samplePoisson
var randomPick = stat.randomPick
var randomIn = stat.randomIn

// We use this to add particles in to the model.
var createParticle = function (wave) {
  var opts = wave.options
  var imageUrl = randomPick(wave.imageUrls)

  return {
    x: randomIn(0, wave.canvasState.width), // randomize start point
    y: -wave.canvasState.height / 3, // above canvas top
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

module.exports = function (wave, dt) {
  var i
  var particlesInDt = dt * wave.options.imagesInSecond
  var numOfNewParticles = samplePoisson(particlesInDt)
  var newParticles = []

  for (i = 0; i < numOfNewParticles; i += 1) {
    newParticles.push(createParticle(wave))
  }

  return newParticles
}