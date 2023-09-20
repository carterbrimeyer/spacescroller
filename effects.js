let particles = [];

var p;
export function initEffects(p5) {
  p = p5;
}
import p5 from 'p5';

export class Particle {
    constructor(pos) {
      this.pos = pos.copy();
      this.vel = p5.Vector.random2D().mult(Math.floor(Math.random() * (5 - 2 + 1)) + 2);
      this.acc = p.createVector(0, 0.1);
      this.alpha = 255;
      this.size = Math.floor(Math.random() * (4 - 1 + 1)) + 1;;
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

  export function generateParticles(pos, numParticles) {
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle(pos));
    }
  }

export function particlesTickCheck(){
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDone()) {
      particles.splice(i, 1);
    }
  }
}