// Effects module - global scope for KaiOS compatibility

var particles = [];

var p;
var Particle;
var Explosion;

function initEffects(p5) {
  p = p5;
}

Particle = class Particle {
    constructor(pos) {
      this.pos = pos.copy();
      this.vel = p.constructor.Vector.random2D().mult(Math.floor(Math.random() * (5 - 2 + 1)) + 2);
      this.acc = p.createVector(0, 0.1);
      this.alpha = 255;
      this.size = Math.random() * 1.5 + 0.5; // Smaller particles: 0.5 to 2 pixels
    }
  
    update() {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.alpha -= 5;
    }
  
    display() {
      p.noStroke();
      p.fill(255, this.alpha);
      p.ellipse(this.pos.x, this.pos.y, this.size);
    }
  
    isDone() {
      return this.alpha <= 0;
    }
  }

function generateParticles(pos, numParticles) {
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(pos));
  }
}

function particlesTickCheck(){
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDone()) {
      particles.splice(i, 1);
    }
  }
}

// Explosion class using particles
Explosion = class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.created = Date.now();
    this.duration = 300;
    // Create explosion particles (reduced from 20 to 12)
    const p = window.p5Instance;
    if (p) {
      generateParticles(p.createVector(x, y), 12);
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