export const distance_from_left = 150;
const move_y_speed = 35;
const max_y_speed = 50;

import { green } from '@tailwindcss/typography/src/styles.js';
import * as laser from './laser.js';

var p;
export function initPlayer(p5js){
  p = p5js;
}

export class Player {
  constructor(ypos) {
    this.gameNotStarted = true;
    this.score = 0;
    this.speed = 7;
    this.shipsize = 15;
    this.shotCooldown = false;
    this.movement = 0;
    this.vel = p.createVector(0, 0);
    this.pos = p.createVector(distance_from_left, ypos);
    this.angle = 0;
    this.alive = true;
    this.lives = 3;
    this.invincible = false;
    this.forcefield = true;
    const forcefield_radius = 8 * this.shipsize;

    this.render = function (xPos, yPos) {
      if (yPos > p.height - this.shipsize) {
        yPos = p.height - this.shipsize;
      }
      if (yPos < this.shipsize) {
        yPos = this.shipsize;
      }
      if(this.gameNotStarted || !p.focused){
        yPos = p.height/3 + (p.height / 5 * (1 + Math.sin(p.frameCount/60)));
        xPos = p.width * 3 /4;
      }
      const distToTarget = Math.abs(yPos - this.pos.y);
      // Calculate the maximum speed based on the distance to the target
      const speed = (distToTarget / p.height) * max_y_speed;
      // Move the ship towards the target position with the maximum speed
      this.pos.y += sign(yPos - this.pos.y) * Math.min(speed, move_y_speed);

      p.push(); //Start Drawing
      p.translate(this.pos.x, this.pos.y);
      if (this.forcefield) {
        this.drawForcefield();
      }
      // Calculate the angle between the ship and the mouse
      this.angle = p.atan2(yPos - this.pos.y, xPos - this.pos.x);
      // Rotate the ship to face the angle of the mouse
      p.rotate(this.angle);

      this.drawFlame();
      this.drawShipDesign();

      p.pop(); //End Drawing
    };

    this.drawFlame = function () {
      p.strokeWeight(3);
      p.noFill();
      p.stroke(238,109,115);
      const y = p.map(-(Math.sin(this.angle)), -1, 1, -this.shipsize/2, this.shipsize/2);
      p.triangle(0, this.shipsize/3 + y, 0, -this.shipsize/3 + y, -this.shipsize/2, y);
    };

    this.drawShipDesign = function () {
      p.stroke(0, 0, 255);
      p.fill(0, 0, 255);
      p.strokeWeight(.5);
      p.triangle(this.shipsize / 4, this.shipsize / 5, this.shipsize / 4, -this.shipsize / 5, this.shipsize * 3, 0);
      p.noFill();
      p.strokeWeight(3);
      if (this.invincible && p.frameCount % 10 < 5) {
        p.stroke(255, 0, 0); // Flashing red stroke when invincible
      } else {
        p.stroke(255);
      }
      // Draw the ship as a triangle
      p.triangle(0, this.shipsize / 2, 0, -this.shipsize / 2, this.shipsize * (3 / 2), 0);
      p.triangle(0, this.shipsize, 0, -this.shipsize, this.shipsize * 3, 0);
    };
    function sign(val) {
      return val >= 0 ? 1 : -1;
    }
    this.collides = function (obj) {
      var d = p.dist(this.pos.x, this.pos.y, obj.pos.x, obj.pos.y);
      if (d < this.shipsize) {
        return true;
      }
      return false;
    };
    this.showPos = function () {
      p.push();
      p.strokeWeight(3);
      p.stroke(0, 255, 0);
      p.point(this.pos.x - 5, this.pos.y);
      p.pop();
    };
    this.getTipPosition = function () {
      const tipX = this.pos.x + (this.shipsize * 3) * Math.cos(this.angle);
      const tipY = this.pos.y + (this.shipsize * 3) * Math.sin(this.angle);
      return p.createVector(tipX, tipY);
    };
    this.drawForcefield = function () {
      p.push();
      p.strokeWeight(2.5);
      p.rotate(0);
      p.noFill();
      p.stroke(109, 180, 238);
      p.translate();
      p.arc(0, 0, forcefield_radius, forcefield_radius, -p.HALF_PI / 1.2, p.HALF_PI / 1.2);

      if(!this.gameNotStarted){
        p.stroke(65,255,0);
        if (p.frameCount % 40 < 20) {
          p.strokeWeight(2);
        }
        else
        {
          p.strokeWeight(1);
        }
        const tooltip = "SPACE TO\nTOGGLE SHIELD";
        const tooltipSize = p.height/60;
        p.textSize(tooltipSize);

        const tooltipOffset = p.textWidth(tooltip);

        p.textAlign(p.CENTER, p.LEFT)
        p.text(tooltip, distance_from_left + tooltipOffset/6, 0);
      }

      p.pop();
    };
  }
}

export function playerGetsHit(playerUser){
  if(!playerUser.invincible)
  {
    playerUser.invincible = true;
    playerUser.lives -= 1;
    if(playerUser.lives < 1)
    {
      playerUser.score = 0;
      playerUser.lives = 3;
    }
    setTimeout(function() {
      playerUser.invincible = false;
    }, 1000);
    return true;
  }
  return false;
}

export function handlePlayerClick(playerUser, mousePressed) {
  if (mousePressed && !playerUser.shotCooldown && !playerUser.forcefield && !playerUser.gameNotStarted) {
    playerUser.shotCooldown = true;
    laser.lasers.push(new laser.Laser(playerUser.getTipPosition(), playerUser.angle, 0, 0, 0, 255));
    setTimeout(function() {
      playerUser.shotCooldown = false;
    }, 75);
  }
}