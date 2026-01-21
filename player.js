// Player module - global scope for KaiOS compatibility

// === PLAYER CONFIGURATION ===
var PLAYER_SHIP_SIZE = 7.5;
var PLAYER_FLAME_STROKE = 1.5;
var PLAYER_SHIP_STROKE = 1.5;
var PLAYER_FORCEFIELD_STROKE = 1.25;
var FORCEFIELD_TOOLTIP_TEXT_DIVISOR = 30; // p.height / this value
var SHOT_COOLDOWN_MS = 75;
var INVINCIBLE_DURATION_MS = 1000;
var INITIAL_LIVES = 3;
var LASER_HEAT_PER_SHOT = 10; // Heat added per shot
var LASER_HEAT_MAX = 200; // Maximum heat before overheat
var LASER_HEAT_COOLDOWN_RATE = 1; // Heat removed per frame when not shooting
var LASER_OVERHEAT_DURATION_MS = 5000; // 5 seconds

var distance_from_left = 25;
var move_y_speed = 35;
var max_y_speed = 50;

var p;
var Player;

function initPlayer(p5js) {
  p = p5js;
}

Player = class Player {
  constructor(ypos) {
    this.gameNotStarted = true;
    this.score = 0;
    this.speed = 7;
    this.shipsize = PLAYER_SHIP_SIZE;
    this.shotCooldown = false;
    this.movement = 0;
    this.vel = p.createVector(0, 0);
    this.pos = p.createVector(distance_from_left, ypos);
    this.angle = 0;
    this.alive = true;
    this.lives = INITIAL_LIVES;
    this.invincible = false;
    this.forcefield = true;
    this.laserHeat = 0; // Current heat level
    this.overheated = false; // Is the laser overheated?
    const forcefield_radius = 8 * this.shipsize;

    this.render = function (xPos, yPos) {
      if (yPos > p.height - this.shipsize) {
        yPos = p.height - this.shipsize;
      }
      if (yPos < this.shipsize) {
        yPos = this.shipsize;
      }
      if (this.gameNotStarted || !p.focused) {
        yPos = p.height / 3 + (p.height / 5 * (1 + Math.sin(p.frameCount / 60)));
        xPos = p.width * 3 / 4;
      }
      const distToTarget = Math.abs(yPos - this.pos.y);
      // Calculate the maximum speed based on the distance to the target
      const speed = (distToTarget / p.height) * max_y_speed;
      // Move the ship towards the target position with the maximum speed
      this.pos.y += sign(yPos - this.pos.y) * Math.min(speed, move_y_speed);

      p.push(); //Start Drawing
      p.translate(this.pos);
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

      // Draw heat bar below ship
      this.drawHeatBar();

      // Draw overheat warning if overheated
      if (this.overheated) {
        this.drawOverheatWarning();
      }
    };

    this.drawFlame = function () {
      p.strokeWeight(PLAYER_FLAME_STROKE);
      p.noFill();
      p.stroke(238, 109, 115);
      const y = p.map(-(Math.sin(this.angle)), -1, 1, -this.shipsize / 2, this.shipsize / 2);
      p.triangle(0, this.shipsize / 3 + y, 0, -this.shipsize / 3 + y, -this.shipsize / 2, y);
    };

    this.drawShipDesign = function () {
      p.stroke(0, 0, 255);
      p.fill(0, 0, 255);
      p.strokeWeight(.5);
      p.triangle(this.shipsize / 4, this.shipsize / 5, this.shipsize / 4, -this.shipsize / 5, this.shipsize * 3, 0);
      p.noFill();
      p.strokeWeight(PLAYER_SHIP_STROKE);
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
    this.drawHeatBar = function () {
      if (this.gameNotStarted) return;

      const barWidth = this.shipsize * 4;
      const barHeight = 2;
      const barX = this.pos.x - barWidth / 2;
      const barY = this.pos.y + this.shipsize * 1.5;


      // Heat fill
      const heatPercent = this.laserHeat / LASER_HEAT_MAX;
      const fillWidth = barWidth * heatPercent;

      // Color: green -> yellow -> red based on heat
      let barColor;
      if (this.overheated) {
        barColor = p.color(255, 0, 0); // Solid red when overheated
      } else if (heatPercent < 0.5) {
        barColor = p.color(0, 255, 0); // Green
      } else if (heatPercent < 0.8) {
        barColor = p.color(255, 255, 0); // Yellow
      } else {
        barColor = p.color(255, 0, 0); // Red
      }

      p.fill(barColor);
      p.noStroke();
      p.rect(barX + this.shipsize, barY, fillWidth, barHeight);
      p.pop();
    };
    this.drawOverheatWarning = function () {
      p.push();
      p.fill(255, 0, 0);
      if (p.frameCount % 10 < 5) {
        p.stroke(255, 0, 0);
      } else {
        p.stroke(255, 100, 100);
      }
      p.strokeWeight(0.5);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(p.height / 40);
      p.text("OVERHEAT!", this.pos.x + this.shipsize / 2, this.pos.y + this.shipsize * 3);
      p.pop();
    };
    this.drawForcefield = function () {
      p.push();
      p.strokeWeight(PLAYER_FORCEFIELD_STROKE);
      p.rotate(0);
      p.noFill();
      p.stroke(109, 180, 238);
      p.arc(0, 0, forcefield_radius, forcefield_radius, -p.HALF_PI / 1.2, p.HALF_PI / 1.2);

      if (!this.gameNotStarted) {
        p.stroke(65, 255, 0);
        if (p.frameCount % 40 < 20) {
          p.strokeWeight(2);
        }
        else {
          p.strokeWeight(1);
        }
        const tooltip = "SOFTKEY TO\nTOGGLE SHIELD";
        const tooltipSize = p.height / FORCEFIELD_TOOLTIP_TEXT_DIVISOR;
        p.textSize(tooltipSize);

        const tooltipOffset = p.textWidth(tooltip);

        p.textAlign(p.CENTER, p.LEFT)
        p.text(tooltip, distance_from_left + tooltipOffset / 3, 0);
      }

      p.pop();
    };
  }
}

function playerGetsHit(playerUser) {
  if (!playerUser.invincible) {
    playerUser.invincible = true;
    playerUser.lives -= 1;
    if (playerUser.lives < 1) {
      //GAME OVER - Save high score
      saveHighScore(playerUser.score);
      playerUser.score = 0;
      playerUser.lives = INITIAL_LIVES;
    }
    setTimeout(function () {
      playerUser.invincible = false;
    }, INVINCIBLE_DURATION_MS);
    return true;
  }
  return false;
}

function handlePlayerClick(playerUser, mousePressed) {
  // Cool down heat over time
  if (playerUser.laserHeat > 0) {
    playerUser.laserHeat = Math.max(0, playerUser.laserHeat - LASER_HEAT_COOLDOWN_RATE);

    // Reset overheat flag when heat reaches 0
    if (playerUser.laserHeat === 0 && playerUser.overheated) {
      playerUser.overheated = false;
    }
  }

  // Check if can shoot
  if (mousePressed && !playerUser.shotCooldown && !playerUser.forcefield && !playerUser.gameNotStarted && !playerUser.overheated) {
    playerUser.shotCooldown = true;
    lasers.push(new Laser(playerUser.getTipPosition(), playerUser.angle, 0, 0, 0, 255));

    // Add heat
    playerUser.laserHeat += LASER_HEAT_PER_SHOT;

    // Check for overheat
    if (playerUser.laserHeat >= LASER_HEAT_MAX) {
      playerUser.overheated = true;
      playerUser.laserHeat = LASER_HEAT_MAX;
    }

    setTimeout(function () {
      playerUser.shotCooldown = false;
    }, SHOT_COOLDOWN_MS);
  }
}