// Main game initialization - global scope for KaiOS compatibility

// Explosion class using particles
var Explosion = class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.created = Date.now();
    this.duration = 300;
    // Create explosion particles
    const p = window.p5Instance;
    if (p) {
      generateParticles(p.createVector(x, y), 20);
    }
  }
  
  update() {
    // Particles handle themselves
  }
  
  render() {
    // Particles render themselves
  }
  
  done() {
    return Date.now() - this.created > this.duration;
  }
}

var effects = [];
var entities = [];

function init(p) {
    window.p5Instance = p;
    initPlayer(p);
    initStars(p);
    initAsteroids(p);
    initEffects(p);
    initEnemies(p);
    initEntities(p);
    initLasers(p);
    initScore(p);
}
