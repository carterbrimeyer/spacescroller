// Asteroid module - global scope for KaiOS compatibility

// === ASTEROID CONFIGURATION ===
var ASTEROID_SIZE = 14;
var ASTEROID_MAX_COUNT = 30;
var ASTEROID_STROKE_WEIGHT = 0.75;
var ASTEROID_MIN_BREAKUP_SIZE = 9; // Reduced so asteroids can actually break up

var asteroid_size = ASTEROID_SIZE;
var number_of_asteroids = ASTEROID_MAX_COUNT;
var asteroids = [];

var p;
var Asteroid;

function initAsteroids(p5js) {
  p = p5js;
}

Asteroid = class Asteroid extends Entity {
  constructor(speed, pos, radius) {
    super(pos.x, pos.y, speed);
    this.radius = radius;
    this.vel = p.constructor.Vector.random2D();
    this.total = Math.floor(5 + Math.random() * 10);
    this.offset = [];
    for (var i = 0; i < this.total; i++) {
      this.offset[i] = -this.radius * 0.5 + Math.random() * (this.radius);
    }

    // Calculate the area of the asteroid shape
    var area = 0;
    this.vertices = [];
    for (var i = 0; i < this.total; i++) {
      var angle = (i / this.total) * (Math.PI * 2);
      var r = this.radius + this.offset[i];
      var x = r * Math.cos(angle);
      var y = r * Math.sin(angle);
      this.vertices.push(p.createVector(x, y));
    }
    for (var i = 0; i < this.vertices.length; i++) {
      var j = (i + 1) % this.vertices.length;
      area += this.vertices[i].x * this.vertices[j].y -
          this.vertices[j].x * this.vertices[i].y;
    }
    this.area = Math.abs(area / 2) / 20;
    this.health = 1; // Add health property
  }
  update() {
    this.pos.x -= this.speed;
    this.pos.add(this.vel);
  }

  render() {
    p.push();
    p.strokeWeight(ASTEROID_STROKE_WEIGHT);
    p.stroke(255);
    p.noFill();
    p.translate(this.pos);
    p.beginShape();
    for (var i = 0; i < this.total; i++) {
      var angle = (i / this.total) * (2 * Math.PI);
      var r = this.radius + this.offset[i];
      var x = r * Math.cos(angle);
      var y = r * Math.sin(angle);
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);
    p.pop();
  }
  nearby(obj) {
    var d = p.dist(this.pos.x, this.pos.y, obj.pos.x, obj.pos.y);
    if (d < this.radius * 1.7) {
      return true;
    }
    return false;
  }
  
  collides(obj) {
    var d = p.dist(this.pos.x, this.pos.y, obj.pos.x, obj.pos.y);
    if (d < this.radius * 1.2) {
      return true;
    }
    return false;
  }
  
  hit() {
    this.health--;
  }
  
  breakup() {
    var newA = [];
    if (this.radius > ASTEROID_MIN_BREAKUP_SIZE) {
      newA[0] = new Asteroid(this.speed, this.pos, this.radius / 2);
      newA[1] = new Asteroid(this.speed, this.pos, this.radius / 2);
      // Note: calling code must add these to asteroids_game array
      this.newAsteroids = newA;
    }
    generateParticles(this.pos, (this.radius / 4) + Math.random() * (this.radius / 2 - this.radius / 4));
    return this.area;
  }

  offscreen() {
    if (this.pos.x < -(asteroid_size * 3)) {
      return true;
    }
    return false;
  }
  forceFieldEffect(ship) {
    const distToField = p.constructor.Vector.dist(this.pos, ship.pos);
    if (distToField < ship.shipsize * 20 && distToField > 0) {
      // Use inverse square for more gradual push - stronger when closer
      const pushStrength = 5000 / (distToField * distToField);
      const pushVector = p.constructor.Vector.sub(this.pos, ship.pos).normalize().mult(pushStrength);
      this.pos.add(pushVector);
    }
  }
}

function asteroidWave(playerUser) {
  setInterval(function() {
    if (asteroids.length < number_of_asteroids) {
      asteroids.push(new Asteroid(
          playerUser.speed, p.createVector(p.width + 100, p.height * Math.random()),
          (asteroid_size / 2) + Math.random() * (asteroid_size - asteroid_size / 2)));
    }
  }, 250);
}

function checkAsteroidHit(playerUser, laser) {
  for (var j = 0; j < asteroids.length; j++) {
    if (laser.hits(asteroids[j])) {
      // Hit the asteroid (reduce health)
      asteroids[j].hit();
      
      // Check if asteroid is destroyed
      if (asteroids[j].health <= 0) {
        // Award score for breakup
        if (asteroids[j].radius > ASTEROID_MIN_BREAKUP_SIZE) {
          playerUser.score += asteroids[j].breakup();
        }
        // Award score for the asteroid itself
        playerUser.score += asteroids[j].area;
        
        // Create explosion effect
        effects.push(new Explosion(asteroids[j].pos.x, asteroids[j].pos.y));
        
        // Add broken pieces if any
        if (asteroids[j].newAsteroids) {
          asteroids = asteroids.concat(asteroids[j].newAsteroids);
        }
        
        // Remove the destroyed asteroid
        asteroids.splice(j, 1);
      } else {
        // Just damaged, give small score
        playerUser.score += 10;
      }
      
      return true;
    }
  }
  return false;
}

function asteroidsTickCheck(playerUser){
  for (var i = 0; i < asteroids.length; i++) {
    asteroids[i].render();
    asteroids[i].update();
    if(playerUser.forcefield){
      asteroids[i].forceFieldEffect(playerUser);
    }
    if(asteroids[i].offscreen()){
      asteroids.splice(i, 1);
      continue;
    }
    if(asteroids[i].nearby(playerUser) && playerGetsHit(playerUser)){
      asteroids[i].breakup();
      asteroids.splice(i, 1);
      continue;
    }
  }
}