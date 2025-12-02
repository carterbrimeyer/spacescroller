export const asteroid_size = 25;
export const number_of_asteroids = 30;
var asteroids = [];

import * as effects from './effects';
import * as player from './player.js';
import * as entity from './entity.js';
import p5 from 'p5';

var p;
export function initAsteroids(p5js) {
  p = p5js;
}

export class Asteroid extends entity.Entity {
  constructor(speed, pos, radius) {
    super(pos.x, pos.y, speed);
    this.radius = radius;
    this.vel = p5.Vector.random2D();
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
  }
  update() {
    this.pos.x -= this.speed;
    this.pos.add(this.vel);
  }

  render() {
    p.push();
    p.strokeWeight(1.5);
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
  breakup() {
    var newA = [];
    if (this.radius > 15) {
      newA[0] = new Asteroid(this.speed, this.pos, this.radius / 2);
      newA[1] = new Asteroid(this.speed, this.pos, this.radius / 2);
      asteroids = asteroids.concat(newA)
    }
    effects.generateParticles(this.pos, (this.radius / 4) + Math.random() * (this.radius / 2 - this.radius / 4));
    return this.area;
  }

  offscreen() {
    if (this.pos.x < -(asteroid_size * 3)) {
      return true;
    }
    return false;
  }
  forceFieldEffect(ship) {
    const distToField = p5.Vector.dist(this.pos, ship.pos);
    if (distToField < ship.shipsize * 20) {
      const pushVector = p5.Vector.sub(this.pos, ship.pos).normalize().mult(500/distToField);
      this.pos.add(pushVector);
    }
  }
}

export function asteroidWave(playerUser) {
  setInterval(function() {
    if (asteroids.length < number_of_asteroids) {
      asteroids.push(new Asteroid(
          playerUser.speed, p.createVector(p.width + 100, p.height * Math.random()),
          (asteroid_size / 2) + Math.random() * (asteroid_size - asteroid_size / 2)));
    }
  }, 250);
}

export function checkAsteroidHit(playerUser, laser) {
  for (var j = 0; j < asteroids.length; j++) {
    if (laser.hits(asteroids[j])) {
      if (asteroids[j].radius > 10) {
        playerUser.score += asteroids[j].breakup();
      }
      playerUser.score += asteroids[j].area;
      asteroids.splice(j, 1);
      return true;
    }
  }
  return false;
}

export function asteroidsTickCheck(playerUser){
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
    if(asteroids[i].nearby(playerUser) && player.playerGetsHit(playerUser)){
      asteroids[i].breakup();
      asteroids.splice(i, 1);
      continue;
    }
  }
}