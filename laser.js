// Laser module - global scope for KaiOS compatibility

// === LASER CONFIGURATION ===
var LASER_SPEED = 10;
var LASER_STROKE_WEIGHT = 2;

var lasers = [];

var p;
var Laser;

function initLasers(p5) {
  p = p5;
}

Laser = class Laser extends Entity {
  constructor(pos, angle, speed, r, g, b){
    super(pos.x, pos.y, speed);
    this.vel = p.constructor.Vector.fromAngle(angle);
    this.vel.setMag(LASER_SPEED);
    this.r = r;
    this.g = g;
    this.b = b;
    this.prevPos = p.createVector(pos.x, pos.y); // Track previous position
  }
  render() {
    // Store previous position before moving
    this.prevPos.set(this.pos.x, this.pos.y);
    
    // Move laser (only once per frame)
    this.pos.add(this.vel);
    this.pos.x += this.speed;
    
    // Draw laser as a short line (3 pixels long in direction of movement)
    const lineLength = 3;
    const direction = this.vel.copy().normalize().mult(lineLength);
    const startX = this.pos.x - direction.x;
    const startY = this.pos.y - direction.y;
    
    p.push();
    p.stroke(this.r, this.g, this.b);
    p.strokeWeight(LASER_STROKE_WEIGHT);
    p.line(startX, startY, this.pos.x, this.pos.y);
    p.pop();
  }

  offscreen() {
    if (this.pos.x > p.width || this.pos.x < 0) {
      return true;
    }
    if (this.pos.y > p.height || this.pos.y < 0) {
      return true;
    }
    return false;
  }

  hits(asteroid) {
    // Line-circle collision detection using the laser's movement path
    // Check both current position and the line segment from previous to current position
    
    // First check current position (simple distance check)
    var d = p.dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < asteroid.radius) {
      return true;
    }
    
    // Then check if the line segment intersects the circle
    // Find the closest point on the line segment to the asteroid center
    const dx = this.pos.x - this.prevPos.x;
    const dy = this.pos.y - this.prevPos.y;
    const fx = this.prevPos.x - asteroid.pos.x;
    const fy = this.prevPos.y - asteroid.pos.y;
    
    const a = dx * dx + dy * dy;
    const b = 2 * (fx * dx + fy * dy);
    const c = (fx * fx + fy * fy) - asteroid.radius * asteroid.radius;
    
    // Solve quadratic equation for line-circle intersection
    const discriminant = b * b - 4 * a * c;
    
    if (discriminant >= 0 && a !== 0) {
      const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
      const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
      
      // Check if intersection happens within the line segment (t between 0 and 1)
      if ((t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1)) {
        return true;
      }
    }
    
    return false;
  }

  hitsShip(ship) {
    var d = p.dist(this.pos.x, this.pos.y, ship.pos.x, ship.pos.y);
    // Larger hitbox to match visual size of enemy ships (they extend shipsize * 2)
    if (d < ship.shipsize * 2) {
      return true;
    } else {
      return false;
    }
  }
  forceFieldEffect(ship){ 
    const distToField = p.dist(this.pos.x, this.pos.y, ship.pos.x, ship.pos.y);
    if (distToField < ship.shipsize * 20 && distToField > 0) {
      // Use inverse square for more gradual push - stronger when closer
      const pushStrength = 12000 / (distToField * distToField);
      const pushVector = p.constructor.Vector.sub(this.pos, ship.pos).normalize().mult(pushStrength);
      this.pos.add(pushVector);
    }
  }
}

function lasersTickUpdate(playerUser) {
  for (var i = lasers.length - 1; i >= 0; i--) {
    lasers[i].render();
    if(playerUser.forcefield){
      lasers[i].forceFieldEffect(playerUser);
    }
    if (lasers[i].offscreen()) {
      lasers.splice(i, 1);
      continue;
    }
    if (playerUser.collides(lasers[i])) {
      playerGetsHit(playerUser);
    }
    if(checkEnemyHit(playerUser, lasers[i]) || checkAsteroidHit(playerUser, lasers[i])){
      lasers.splice(i, 1);
      continue;
    }
  }
}