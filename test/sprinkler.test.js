var unit = require('../sprinkler.js');
var should = require('should');

describe('Sprinkler', function () {

  describe('#create', function () {
    it('should be a function', function () {
      unit.create.should.be.a.Function;
    });
  });

  describe('instance', function () {
    it('should be startable and stoppable', function (done) {
      done();
    });
  });

  it('should have a version with the format #.#.#', function() {
    unit.version.should.match(/^\d+\.\d+\.\d+$/);
  });
});
