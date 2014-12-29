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
  //...



  // **********
  // Exceptions
  // **********
  //...



  // ***********
  // Constructor
  // ***********

  var Sprinkler = function () {
    this.timeout = null;
  };

  exports.create = function () {
    return new Sprinkler();
  };



  // ****************
  // Instance methods
  // ****************

  Sprinkler.prototype.start = function () {
    var interval = 100;
    var that = this;
    this.timeout = setTimeout(function () {
      that.start();
    }, interval);
  };

  Sprinkler.prototype.stop = function () {
    clearTimeout(this.timeout);
  };



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
