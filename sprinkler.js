// *****************************
// UMD pattern commonjsStrict.js
// https://github.com/umdjs/umd
// *****************************
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['exports'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS & Node
    factory(exports);
  } else {
    // Browser globals
    factory((root.Sprinkler = {}));
  }
}(this, function (exports) {
  'use strict';



  // ****************
  // Helper functions
  // ****************

  var loadImages = function (imgSrcs, then) {
    // then(err, imgElements)
    // Calls then after all the images were loaded.
    var i, imgs, numberOfImages, onload, onloadsCalled;
    numberOfImages = imgSrcs.length;

    imgs = [];

    onloadsCalled = 0;
    onload = function () {
      // Note:
      //   this = Image
      onloadsCalled += 1;
      var isFinalImage = (onloadsCalled === numberOfImages);
      if (isFinalImage) {
        then(null, imgs);
      }
    };

    for (i = 0; i < imgSrcs.length; i += 1) {
      imgs.push(new Image());
      imgs[i].onload = onload;
      imgs[i].src = imgSrcs[i];
    }
  };

  var randomIn = function (min, max) {
    // Continuous uniform distribution.
    // Return x: min <= x < max
    var d = max - min;
    return min + d * Math.random();
  };

  var randomPick = function (array) {
    // Return one randomly picked element.
    // Discrete uniform distribution.
    var min = 0;
    var max = array.length;
    var continuousIndex = randomIn(min, max);
    var discreteIndex = Math.floor(continuousIndex);
    var i = discreteIndex;
    return array[i];
  };

  var samplePoisson = function (rate) {
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

  // TODO Remove useless parameters
  var Particle = function (x, y, z, r, a, dx, dy, dz, dr, da,
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
    this.a += Math.min(1, Math.max(0, this.a + this.da * dt));
    this.dx += this.ddx * dt;
    this.dy += this.ddy * dt;
    this.dz += this.ddz * dt;
    this.dr += this.ddr * dt;
    this.da += this.dda * dt;
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
    var createParticle = function () {
      // Turn images to particles
      var p, w, h, image;
      w = canvas.width;
      h = canvas.height;

      image = randomPick(sourceImages);

      return new Particle(
        randomIn(0, w), // randomize start point
        -Math.max(image.width, image.height) / 2, // maxRadius above canvas top
        randomIn(0.38, 0.62), // z, scale
        2 * Math.PI * randomIn(0, 1), // rotation
        1, // a, alpha, opacity
        randomIn(-1, 1), // dx, horizontal movement
        randomIn(70, 100), // dy, falling speed
        0, // dz
        randomIn(-0.5, 0.5), // dr, rotation speed, rads/sec
        0, // da
        0, 0, // ddx, ddy
        0, // ddz
        0, // ddr
        0, // dda
        image,
        image.width, image.height
      );
    };

    // Model is simulated forward every frame
    var tickModel = function (dt) {
      // Parameter
      //   dt
      //     simulation time, seconds
      var i, h, bufferParticles,visible, maxRadius;

      // Simulate each particle
      for (i = 0; i < particles.length; i += 1) {
        particles[i].tick(dt);
      }

      // Create particles.
      var particlesInSecond = 10;
      var particlesInDt = dt * particlesInSecond;
      var numOfNewParticles = samplePoisson(particlesInDt);
      for (i = 0; i < numOfNewParticles; i += 1) {
        particles.push(createParticle());
      }

      // Clean up.
      // Remove particles that are out of screen
      // by replacing particles array.
      h = canvas.height;
      bufferParticles = [];
      for (i = 0; i < particles.length; i += 1) {
        maxRadius = Math.max(particles[i].w, particles[i].h) / 2;
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
      //     function (start, stop)
      loadImages(imagePaths, function then(err, imageElements) {
        if (err) { console.error(err); return; }
        [].push.apply(sourceImages, imageElements);
        callback(startAnimation, stopAnimation);
      });
    };
  };

  exports.create = function (canvas) {
    return new Sprinkler(canvas);
  };



  // ****************
  // Instance methods
  // ****************
  // ...



  // **************
  // Module methods
  // **************
  // exports.someMethod = ...



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
  exports.version = '0.1.0';

}));
