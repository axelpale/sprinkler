var defaultParticleRenderer = require('./view/renderParticle')

var defaultParticleSize = function (p) {
  if (p.image.complete) {
    return {
      width: p.image.width,
      height: p.image.height
    }
  }
  return {
    width: 512,
    height: 512
  }
}

module.exports = {
  angle: 0, // radians
  imagesInSecond: 7,
  burnInSeconds: 0,
  constantDensity: true,
  xOff: 0,
  xSteps: Infinity,
  zMin: 0.38,
  zMax: 1,
  rMin: 0,
  rMax: 2 * Math.PI,
  aMin: 1,
  aMax: 1,
  dxMin: -1,
  dxMax: 1,
  dyMin: 100,
  dyMax: 100,
  dzMin: 0,
  dzMax: 0,
  drMin: -1,
  drMax: 1,
  daMin: 0,
  daMax: 0,
  ddxMin: 0,
  ddxMax: 0,
  ddyMin: 0,
  ddyMax: 0,
  ddzMin: 0,
  ddzMax: 0,
  ddrMin: 0,
  ddrMax: 0,
  ddaMin: 0,
  ddaMax: 0,
  tail: {
    imageUrls: [],
    length: 0,
    decay: 1,
    xOff: 0,
    yOff: 0,
    x: 0,
    y: 0
  },
  particleRenderer: defaultParticleRenderer,
  clickModifier: function (p) { return p },
  particleSize: defaultParticleSize
}
