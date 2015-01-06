!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Sprinkler=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function loadImages(imgSrcs, then) {
  // then(err, imgElements)
  // Calls then after all the images were loaded.
  var i, imgs, numberOfImages, onload, onloadsCalled,
    thereWasError, thereWasSuccess;
  numberOfImages = imgSrcs.length;
  thereWasSuccess = false;
  thereWasError = false;

  imgs = [];

  onloadsCalled = 0;
  onload = function () {
    // Note:
    //   this = Image
    if (!thereWasError) {
      onloadsCalled += 1;
      var isFinalImage = (onloadsCalled === numberOfImages);
      if (isFinalImage) {
        thereWasSuccess = true;
        then(null, imgs);
      }
    }
  };

  onerror = function (errMsg) {
    // Note:
    //   this = Image

    // No errors after success.
    if (!thereWasSuccess) {
      thereWasError = true;
      then(errMsg, null);
    }

    // Prevent firing the default event handler
    // https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers.onerror#Parameters
    return true;
  };

  for (i = 0; i < imgSrcs.length; i += 1) {
    imgs.push(new Image());
    imgs[i].onload = onload;
    imgs[i].onerror = onerror;
    imgs[i].src = imgSrcs[i];
  }
};

},{}],2:[function(require,module,exports){

var Particle = function ( x, y, z, r, a,
                          dx, dy, dz, dr, da,
                          ddx, ddy, ddz, ddr, dda,
                          img, w, h) {
  this.x = x;
  this.y = y;
  this.z = z; // scale
  this.r = r;
  this.a = a; // opacity
  this.dx = dx;
  this.dy = dy;
  this.dz = dz;
  this.dr = dr;
  this.da = da;
  this.ddx = ddx;
  this.ddy = ddy;
  this.ddz = ddz;
  this.ddr = ddr;
  this.dda = dda;

  this.img = img; // source image // read-only
  this.w = w; // source image width // read-only
  this.h = h; // source image height // read-only
};

Particle.prototype.tick = function (dt) {
  // Parameter
  //   dt
  //     seconds
  this.x += this.dx * dt;
  this.y += this.dy * dt;
  this.z += this.dz * dt;
  this.r += this.dr * dt;
  this.a = Math.min(1, Math.max(0, this.a + this.da * dt));
  this.dx += this.ddx * dt;
  this.dy += this.ddy * dt;
  this.dz += this.ddz * dt;
  this.dr += this.ddr * dt;
  this.da += this.dda * dt;
};

exports.Particle = Particle;

},{}],3:[function(require,module,exports){

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

        // Map image indices to actual image objects.
        if (options.hasOwnProperty('selectImages')) {
          for (i = 0; i < options.selectImages.length; i += 1) {
            options.selectImages[i] = imageElements[options.selectImages[i]];
          }
        }

        // Push all valid options to defaultOptions.
        extendValid(options, defaultOptions);
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
exports.version = '0.4.2';

},{"./loadimages":1,"./particle":2,"./stat":4}],4:[function(require,module,exports){
exports.randomIn = function (min, max) {
  // Continuous uniform distribution.
  // Return x: min <= x < max
  var d = max - min;
  return min + d * Math.random();
};

exports.randomPick = function (array) {
  // Return one randomly picked element.
  // Discrete uniform distribution.
  var min = 0;
  var max = array.length;
  var continuousIndex = exports.randomIn(min, max);
  var discreteIndex = Math.floor(continuousIndex);
  var i = discreteIndex;
  return array[i];
};

exports.samplePoisson = function (rate) {
  // Purpose: number of images to drop in each interval.
  // Take a sample from poisson distribution.
  // https://en.wikipedia.org/wiki/Poisson_distribution#Generating_Poisson-distributed_random_variables
  var L, k, p, u;
  L = Math.exp(-rate);
  k = 0;
  p = 1;
  do {
    k += 1;
    u = Math.random();
    p *= u;
  } while (p > L);
  return k - 1;
};

},{}]},{},[3])(3)
});