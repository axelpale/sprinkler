
var Particle = function (
  x, y, z, r, a,
  dx, dy, dz, dr, da,
  ddx, ddy, ddz, ddr, dda,
  img, w, h
) {
  this.x = x
  this.y = y
  this.z = z // scale
  this.r = r
  this.a = a // opacity
  this.dx = dx
  this.dy = dy
  this.dz = dz
  this.dr = dr
  this.da = da
  this.ddx = ddx
  this.ddy = ddy
  this.ddz = ddz
  this.ddr = ddr
  this.dda = dda

  this.img = img // source image // read-only
  this.w = w // source image width // read-only
  this.h = h // source image height // read-only
}

Particle.prototype.tick = function (dt) {
  // Parameter
  //   dt
  //     seconds
  this.x += this.dx * dt
  this.y += this.dy * dt
  this.z += this.dz * dt
  this.r += this.dr * dt
  this.a = Math.min(1, Math.max(0, this.a + this.da * dt))
  this.dx += this.ddx * dt
  this.dy += this.ddy * dt
  this.dz += this.ddz * dt
  this.dr += this.ddr * dt
  this.da += this.dda * dt
}

exports.Particle = Particle
