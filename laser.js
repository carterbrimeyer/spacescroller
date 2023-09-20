export var lasers = [];

import * as asteroid from './asteroid.js';
import * as entity from './entity.js';
import * as enemy from './enemy.js';
import { playerGetsHit } from './player.js';
import p5 from 'p5';

var p;
export function initLasers(p5) {
  p = p5;
}

export class Laser extends entity.Entity {
  constructor(pos, angle, speed, r, g, b){
    super(pos.x, pos.y, speed);
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.setMag(15);
    this.r = r;
    this.g = g;
    this.b = b;
  }
  render() {
    this.pos.add(this.vel);
    this.pos.x += this.speed;
    p.push();
    p.stroke(this.r,this.g,this.b);
    p.strokeWeight(4);
    p.point(this.pos.x, this.pos.y);
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
    var d = p.dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    
    if (d < asteroid.radius) {
      return true;
    } else {
      return false;
    }
  }

  hitsShip(ship) {
    var d = p.dist(this.pos.x, this.pos.y, ship.pos.x, ship.pos.y);
    if (d < ship.shipsize) {
      return true;
    } else {
      return false;
    }
  }
  forceFieldEffect(ship){ 
    const distToField = p.dist(this.pos.x, this.pos.y, ship.pos.x, ship.pos.y);
     if (distToField < ship.shipsize * 20) {
      const pushVector = p5.Vector.sub(this.pos, ship.pos).normalize().mult(1500/distToField);
      this.pos.add(pushVector);
    }
  }
}

export function lasersTickUpdate(playerUser) {
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
    if(enemy.checkEnemyHit(playerUser, lasers[i]) || asteroid.checkAsteroidHit(playerUser, lasers[i])){
      lasers.splice(i, 1);
      continue;
    }
  }
}