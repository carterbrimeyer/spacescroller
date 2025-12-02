var enemies = [];
const number_of_enemies = 6;

import * as player from './player.js';
import * as laser from './laser.js';
import * as entity from './entity.js';
import * as effects from './effects.js';

import p5 from 'p5';

var p;
export function initEnemies(p5) {
  p = p5;
}

export class Enemy extends entity.Entity {
  constructor(xpos, ypos) {
    super(xpos, ypos, 8);
    this.score = 1000;
    this.shipsize = 15;
    this.vel = p.createVector(0, 0);
    this.angle = 0;
  }
  render(target) {
    const distToTarget = p.dist(this.pos.x, this.pos.y, target.x, target.y)

    // Calculate the maximum speed based on the distance to the target
    const maxSpeed = Math.min(
      (distToTarget * distToTarget) * (this.speed / (2 * p.height)),
      this.speed
    );

    // Calculate the desired velocity towards the target
    const desiredVel = p5.Vector.sub(target, this.pos).setMag(maxSpeed);

    // Apply a steering force towards the desired velocity
    const steeringForce =
        p5.Vector.sub(desiredVel, this.vel).limit(this.speed / 2);
    this.vel.add(steeringForce);
    this.pos.add(this.vel);

    p.push();
    p.strokeWeight(3);
    p.noFill();
    p.stroke(255, 0, 0);

    // Calculate the angle between the ship and the mouse
    this.angle = this.vel.heading();

    // Rotate the ship to face the angle of the velocity
    p.translate(this.pos);
    p.rotate(this.angle);

    // Draw the ship as a triangle
    p.triangle(this.shipsize * 2, 0, 0, this.shipsize, 0, -this.shipsize);
    p.strokeWeight(1.5);
    p.triangle(this.shipsize, 0, 0, this.shipsize / 2, 0, -this.shipsize / 2);
    p.triangle(
        -this.shipsize / 4, 0, 0, this.shipsize / 4, 0, -this.shipsize / 4);

    p.pop();
  }
  collides(obj) {
    var d = p.dist(this.pos.x, this.pos.y, obj.pos.x, obj.pos.y);
    if (d < obj.shipsize * 4) {
      return true;
    }
    return false;
  }
  destroy() {
    effects.generateParticles(this.pos, Math.floor(Math.random() * (9 - 5 + 1)) + 5);
    return this.score;
  }
  forceFieldEffect(ship) {
    const distToField = p5.Vector.dist(this.pos, ship.pos);
    if (distToField < ship.shipsize * 6) {
      this.destroy();
      return true;
    }
    return false;
  }
}
export class ShooterEnemy extends Enemy {
  constructor(xpos, ypos) {
    super(xpos, ypos);
    this.speed = 5;
    this.shotCooldown = false;
  }
  shootLaser() {
    if (!this.shotCooldown && 10 * Math.random() < 1) {
      this.shotCooldown = true;
      laser.lasers.push(new laser.Laser(
          this.getTipPosition(), this.angle, -this.speed, 238, 109, 115));
      setTimeout(() => {
        this.shotCooldown = false;
      }, 1000);
    }
  }
  render(target) {
    const offsetTarget = target.copy();

    offsetTarget.x = target.x + this.shipsize * 10 + (Math.random() * 300);
    offsetTarget.y = target.y + 20 - (Math.random() * 100);

    const distToTarget =
        p.dist(this.pos.x, this.pos.y, offsetTarget.x, offsetTarget.y);

    // Calculate the maximum speed based on the distance to the target
    const maxSpeed =
        Math.min(p.map(2 * distToTarget, 0, p.height, 0, this.speed / 2), this.speed);
    // Calculate the angle between the ship and the mouse
    // Calculate the desired velocity towards the target
    const desiredVel = p5.Vector.sub(offsetTarget, this.pos).setMag(maxSpeed);


    // Apply a steering force towards the desired velocity
    const steeringForce =
        p5.Vector.sub(desiredVel, this.vel).limit(this.speed / 2);
    this.vel.add(steeringForce);
    this.pos.add(this.vel);

    p.push();
    p.strokeWeight(3);
    p.noFill();
    p.stroke(255, 0, 255);

    this.angle = p.atan2(target.y - this.pos.y, target.x - this.pos.x);

    // Rotate the ship to face the angle of the velocity
    p.translate(this.pos);
    p.rotate(this.angle);

    // Draw the ship as a triangle
    p.triangle(this.shipsize * 2, 0, 0, this.shipsize, 0, -this.shipsize);

    p.strokeWeight(1);
    p.triangle(
        -this.shipsize / 4, 0, 0, this.shipsize / 4, 0, -this.shipsize / 4);
        p.stroke(255, 0, 0);
        p.triangle(this.shipsize, 0, 0, this.shipsize / 2, 0, -this.shipsize / 2);
    this.shootLaser();
    p.pop();
  }
  getTipPosition() {
    const tipX = this.pos.x + (this.shipsize * 2) * Math.cos(this.angle);
    const tipY = this.pos.y + (this.shipsize * 2) * Math.sin(this.angle);
    return p.createVector(tipX, tipY);
  };
}
export function enemyWave(playerUser) {
  setInterval(function() {
    if (enemies.length < number_of_enemies && p.focused) {
      var rand = Math.floor(40 * Math.random());
      switch (rand) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
          enemies.push(new Enemy(p.width + 50, p.height * Math.random()));
          break;
        case 5:
          if(!playerUser.gameNotStarted)
          {
            enemies.push(
                new ShooterEnemy(p.width + 50, p.height * Math.random()));
          }
          break;
      }
    }
  }, 1000);
}

export function checkEnemyHit(playerUser, laser) {
  for (var u = 0; u < enemies.length; u++) {
    if (laser.hitsShip(enemies[u])) {
      playerUser.score += enemies[u].destroy();
      enemies.splice(u, 1);
      return true;
    }
  }
  return false;
}

export function enemyTickCheck(playerUser){
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].render(playerUser.pos);
    enemies[i].showPos();
    if(playerUser.forcefield && enemies[i].forceFieldEffect(playerUser)){
      enemies.splice(i, 1);
      continue;
    }
    if(enemies[i].collides(playerUser)){
      playerUser.score += enemies[i].destroy();
      enemies.splice(i, 1);
      player.playerGetsHit(playerUser);
      continue;
    }
  }
}