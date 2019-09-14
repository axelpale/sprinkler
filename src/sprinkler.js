
// ****************
// Helper functions
// ****************

var loadImages = require('./loadimages');
var Particle = require('./particle').Particle;

var stat = require('./stat');
var randomIn = stat.randomIn;
var randomPick = stat.randomPick;
var samplePoisson = stat.samplePoisson;

var extendValid = function (source, dest) {
  // Purpose: fill valid options to default options object.
  // Valid option in a source exist in dest and is same type.
  // Return
  //   nothing, modifies dest in place.
  var k;
  for (k in source) {
    if (source.hasOwnProperty(k)) {
      if (dest.hasOwnProperty(k)) {
        if (typeof source[k] === typeof dest[k]) {
          dest[k] = source[k];
        }
      }
    }
  }
};

var makeCanvasAutoFullwindow = function (canvas) {
  // Canvas is resized when window size changes, e.g.
  // when a mobile device is tilted.
  //
  // Parameter
  //   canvas
  //     HTML Canvas element
  //
  var resizeCanvas = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);
  // Initially resized to fullscreen.
  resizeCanvas();
};



// **********
// Exceptions
// **********
//...



// ***********
// Constructor
// ***********

var Sprinkler = function (canvas) {

  // All the loaded images are stored here
  var sourceImages = [];

  // Each load has a separate id and a set of starts.
  // New load is created on load call. New start for a load is
  // created on start call.
  var loads = {};

  // Images are modeled as particles and stored here
  var particles = [];

  // To pause animation loop
  var running = false;

  // number, unix timestamp milliseconds of most recent frame.
  var past = null;

  // Everything is drawn on canvas.
  var ctx = canvas.getContext('2d');

  // Make canvas resize automatically to full window area
  makeCanvasAutoFullwindow(canvas);

  // We use this to add particles in to the model.
  var createParticle = function (options) {
    // Turn images to particles
    var p, w, h, image;
    w = canvas.width;
    h = canvas.height;

    image = randomPick(options.selectImages);

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
    );
  };

  var createParticles = function (options, dt) {
    var i;
    var particlesInSecond = options.imagesInSecond;
    var particlesInDt = dt * particlesInSecond;
    var numOfNewParticles = samplePoisson(particlesInDt);
    for (i = 0; i < numOfNewParticles; i += 1) {
      particles.push(createParticle(options));
    }
  };

  // Model is simulated forward every frame
  var tickModel = function (dt) {
    // Parameter
    //   dt
    //     simulation time, seconds
    var i, k, l, load, startOptions, h,
        bufferParticles, visible, pw, ph, maxRadius;

    // To avoid huge wave of particles, they are created only
    // if dt is close to given framerate.
    if (dt < 0.5) {
      // Simulate each particle
      for (i = 0; i < particles.length; i += 1) {
        particles[i].tick(dt);
      }

      // Create particles. Each start call has its own configuration.
      for (k in loads) {
        if (loads.hasOwnProperty(k)) {
          load = loads[k];
          for (l in load) {
            if (load.hasOwnProperty(l)) {
              startOptions = load[l];
              createParticles(startOptions, dt);
            }
          }
        }
      }
    }

    // Clean up.
    // Remove particles that are out of screen
    // by replacing particles array.
    h = canvas.height;
    bufferParticles = [];
    for (i = 0; i < particles.length; i += 1) {
      pw = particles[i].w;
      ph = particles[i].h;
      maxRadius = particles[i].z * Math.max(pw, ph) / 2;
      visible = (particles[i].y < h + maxRadius);
      if (visible) {
        bufferParticles.push(particles[i]);
      }
    }
    particles = bufferParticles;
  };

  // View is rendered each frame
  var tickView = function () {
    // Draw; View current model
    var i, imgW, imgH;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (i = 0; i < particles.length; i += 1) {
      ctx.globalAlpha = particles[i].a;
      imgW = particles[i].z * particles[i].w;
      imgH = particles[i].z * particles[i].h;
      ctx.translate(particles[i].x, particles[i].y);
      ctx.rotate(particles[i].r);
      ctx.drawImage(
        particles[i].img,
        -Math.floor(imgW / 2), // gravity to image center
        -Math.floor(imgH / 2),
        imgW, imgH
      );
      ctx.setTransform(1, 0, 0, 1, 0, 0); // resetTransform
      ctx.globalAlpha = 1; // reset alpha
    }
  };

  var startAnimationLoop = function loopFn() {
    var present, dt;

    // Time difference from previous frame in milliseconds
    present = Date.now();
    dt = (past === null) ? 0 : present - past;
    past = present;

    // Update Model
    tickModel(dt / 1000); // secs

    // Draw; View current model
    tickView();

    // Recursion
    // Allow only one viewLoop recursion at a time.
    if (running) {
      window.requestAnimationFrame(loopFn);
    }
  };

  var startAnimation = function () {
    if (!running) {
      running = true;
      startAnimationLoop();
    }
  };

  var stopAnimation = function () {
    running = false;
  };

  this.load = function (imagePaths, callback) {
    // Parameter
    //   imagePaths
    //     array
    //   callback
    //     function (err, start)
    //
    // Throw
    //   'InvalidOptionsError'
    loadImages(imagePaths, function then(err, imageElements) {
      if (err) { callback(err, null); return; }

      // loads is browsed through when creating particles.
      var loadId = Math.random().toString();
      loads[loadId] = {};

      var start = function start(options) {
        // Parameter
        //   options
        //     Do not modify this object as start might be called
        //     with it multiple times.
        var i, defaultOptions;

        // Default parameter
        if (typeof options === 'undefined') {
          options = {};
        }

        // Invalid parameter
        if (Object.prototype.toString.call(options) !== '[object Object]') {
          throw 'InvalidOptionsError';
        }

        // Various start options
        defaultOptions = {
          type: 'default',
          selectImages: imageElements,
          zMin: 0.38, zMax: 1,
          rMin: 0, rMax: 2 * Math.PI,
          aMin: 1, aMax: 1,
          dxMin: -1, dxMax: 1,
          dyMin: 100, dyMax: 100,
          dzMin: 0, dzMax: 0,
          drMin: -1, drMax: 1,
          daMin: 0, daMax: 0,
          ddxMin: 0, ddxMax: 0,
          ddyMin: 0, ddyMax: 0,
          ddzMin: 0, ddzMax: 0,
          ddrMin: 0, ddrMax: 0,
          ddaMin: 0, ddaMax: 0,
          imagesInSecond: 7,
          stopAfter: Infinity,
          onStop: function noop() {}
        };

        // Push all valid options to defaultOptions.
        extendValid(options, defaultOptions);
        // selectImages needs still to be defined.

        // Map image indices to actual image objects.
        if (options.hasOwnProperty('selectImages')) {
          defaultOptions.selectImages = [];
          for (i = 0; i < options.selectImages.length; i += 1) {
            defaultOptions.selectImages[i] = imageElements[options.selectImages[i]];
          }
        }

        options = defaultOptions;

        var startId = Math.random().toString();
        loads[loadId][startId] = options;

        startAnimation();
        return function stop() {
          delete loads[loadId][startId];
        };
      };

      callback(null, start);
    });
  };
};

exports.create = function (canvas, options) {
  return new Sprinkler(canvas, options);
};



// *************
// Extendability
// *************
// Usage
//   var s = Sprinkler.create(...)
//   Sprinkler.extension.myFunction = function (...) {...}
//   s.myFunction()
exports.extension = Sprinkler.prototype;



// *******
// Version
// *******
exports.version = require('./version');
