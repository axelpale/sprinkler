module.exports = function (p, dt) {
  // Parameter
  //   dt
  //     seconds
  p.x += p.dx * dt
  p.y += p.dy * dt
  p.z += p.dz * dt
  p.r += p.dr * dt
  p.a = Math.min(1, Math.max(0, p.a + p.da * dt))
  p.dx += p.ddx * dt
  p.dy += p.ddy * dt
  p.dz += p.ddz * dt
  p.dr += p.ddr * dt
  p.da += p.dda * dt

  // Traveled Manhattan distance
  p.dist += (p.dx + p.dy) * dt
}
