
// ****************
// Helper functions
// ****************

var loadImages = require('./lib/loadimages')
var fitOnResize = require('./lib/fitOnResize')
var extendValid = require('./lib/extendValid')
var hasProp = require('./lib/hasProp')
var Particle = require('./particle').Particle
var DEFAULT_OPTIONS = require('./defaultOptions')

var stat = require('./lib/stat')
var randomIn = stat.randomIn
var randomPick = stat.randomPick
var samplePoisson = stat.samplePoisson

// ***********
// Constructor
// ***********

var Sprinkler = function (canvas) {
  // Parameters:
  //   canvas: HTML Canvas
  //

  // Each load has a separate id and a set of starts.
  // New load is created on load call. New start for a load is
  // created on start call.
  var loads = {}

  // Images are modeled as particles and stored here
  var particles = []

  // To pause animation loop
  var running = false

  // number, unix timestamp milliseconds of most recent frame.
  var past = null

  // Everything is drawn on canvas.
  var ctx = canvas.getContext('2d')

  // Make canvas resize automatically to full window area
  fitOnResize(canvas)

  // We use this to add particles in to the model.
  var createParticle = function (options) {
    // Turn images to particles
    var w = canvas.width
    // var h = canvas.height

    var image = randomPick(options.selectImages)

    return new Particle(
      randomIn(0, w), // x, randomize start point
      -options.zMax * Math.max(image.width, image.height) / 2, // y, maxRadius above canvas top
      randomIn(options.zMin, options.zMax), // z, scale
      randomIn(options.rMin, options.rMax), // rotation
      randomIn(options.aMin, options.aMax), // a, alpha, opacity
      randomIn(options.dxMin, options.dxMax), // dx, horizontal movement
      randomIn(options.dyMin, options.dyMax), // dy, falling speed
      randomIn(options.dzMin, options.dzMax), // dz
      randomIn(options.drMin, options.drMax), // dr, rotation speed, rads/sec
      randomIn(options.daMin, options.daMax), // da
      randomIn(options.ddxMin, options.ddxMax), // ddx
      randomIn(options.ddyMin, options.ddyMax), // ddy
      randomIn(options.ddzMin, options.ddzMax), // ddz
      randomIn(options.ddrMin, options.ddrMax), // ddr
      randomIn(options.ddaMin, options.ddaMax), // dda
      image,
      image.width, image.height
    )
  }

  var createParticles = function (options, dt) {
    var i
    var particlesInSecond = options.imagesInSecond
    var particlesInDt = dt * particlesInSecond
    var numOfNewParticles = samplePoisson(particlesInDt)
    for (i = 0; i < numOfNewParticles; i += 1) {
      particles.push(createParticle(options))
    }
  }

  // Model is simulated forward every frame
  var tickModel = function (dt) {
    // Parameter
    //   dt
    //     simulation time, seconds
    var i, k, l, load, startOptions, h
    var bufferParticles, visible, pw, ph, maxRadius

    // To avoid huge wave of particles, they are created only
    // if dt is close to given framerate.
    if (dt < 0.5) {
      // Simulate each particle
      for (i = 0; i < particles.length; i += 1) {
        particles[i].tick(dt)
      }

      // Create particles. Each start call has its own configuration.
      for (k in loads) {
        if (hasProp(loads, k)) {
          load = loads[k]
          for (l in load) {
            if (hasProp(load, l)) {
              startOptions = load[l]
              createParticles(startOptions, dt)
            }
          }
        }
      }
    }

    // Clean up.
    // Remove particles that are out of screen
    // by replacing particles array.
    h = canvas.height
    bufferParticles = []
    for (i = 0; i < particles.length; i += 1) {
      pw = particles[i].w
      ph = particles[i].h
      maxRadius = particles[i].z * Math.max(pw, ph) / 2
      visible = (particles[i].y < h + maxRadius)
      if (visible) {
        bufferParticles.push(particles[i])
      }
    }
    particles = bufferParticles
  }

  // View is rendered each frame
  var tickView = function () {
    // Draw; View current model
    var i, imgW, imgH
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (i = 0; i < particles.length; i += 1) {
      ctx.globalAlpha = particles[i].a
      imgW = particles[i].z * particles[i].w
      imgH = particles[i].z * particles[i].h
      ctx.translate(particles[i].x, particles[i].y)
      ctx.rotate(particles[i].r)
      ctx.drawImage(
        particles[i].img,
        -Math.floor(imgW / 2), // gravity to image center
        -Math.floor(imgH / 2),
        imgW, imgH
      )
      ctx.setTransform(1, 0, 0, 1, 0, 0) // resetTransform
      ctx.globalAlpha = 1 // reset alpha
    }
  }

  var startAnimationLoop = function loopFn () {
    var present, dt

    // Time difference from previous frame in milliseconds
    present = Date.now()
    dt = (past === null) ? 0 : present - past
    past = present

    // Update Model
    tickModel(dt / 1000) // secs

    // Draw; View current model
    tickView()

    // Recursion
    // Allow only one viewLoop recursion at a time.
    if (running) {
      window.requestAnimationFrame(loopFn)
    }
  }

  var startAnimation = function () {
    if (!running) {
      running = true
      startAnimationLoop()
    }
  }

  this.load = function (imagePaths, callback) {
    // Parameter
    //   imagePaths
    //     array
    //   callback
    //     function (err, start)
    //
    // Throw
    //   'InvalidOptionsError'
    loadImages(imagePaths, function (err, imageElements) {
      if (err) {
        callback(err, null)
        return
      }

      // loads is browsed through when creating particles.
      var loadId = Math.random().toString()
      loads[loadId] = {}

      var start = function (options) {
        // Parameter
        //   options
        //     Do not modify this object as start might be called
        //     with it multiple times.
        var i

        // Default parameter
        if (typeof options === 'undefined') {
          options = {}
        }

        // Invalid parameter
        if (Object.prototype.toString.call(options) !== '[object Object]') {
          throw new Error('Invalid options object')
        }

        // Various start options
        var defaultOptions = DEFAULT_OPTIONS

        // Push all valid options to defaultOptions.
        var startOptions = extendValid(options, defaultOptions)
        // selectImages needs still to be defined.

        // Map image indices to actual image objects.
        if (hasProp(options, 'selectImages')) {
          startOptions.selectImages = []
          for (i = 0; i < options.selectImages.length; i += 1) {
            startOptions.selectImages[i] = imageElements[options.selectImages[i]]
          }
        }

        var startId = Math.random().toString()
        loads[loadId][startId] = startOptions

        startAnimation()
        return function stop () {
          delete loads[loadId][startId]
        }
      }

      callback(null, start)
    })
  }
}

exports.create = function (canvas, options) {
  return new Sprinkler(canvas, options)
}

// *************
// Extendability
// *************
// Usage
//   var s = Sprinkler.create(...)
//   Sprinkler.extension.myFunction = function (...) {...}
//   s.myFunction()
exports.extension = Sprinkler.prototype

// *******
// Version
// *******
exports.version = require('./version')
