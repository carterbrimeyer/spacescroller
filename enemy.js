// Enemy module - global scope for KaiOS compatibility

// === ENEMY CONFIGURATION ===
var ENEMY_MAX_COUNT = 6;
var ENEMY_SHIP_SIZE = 7.5;
var ENEMY_STROKE_WEIGHT = 1.5;
var ENEMY_INNER_STROKE_WEIGHT = 0.75;
var ENEMY_SCORE_VALUE = 1000;
var ENEMY_SPEED = 5;
var SHOOTER_ENEMY_SPEED = 3;
var SHOOTER_COOLDOWN_MS = 2000;
var SHOTGUN_COOLDOWN_MS = 5500;
var SHOTGUN_PELLET_COUNT = 4;
var SHOTGUN_SPREAD_ANGLE = 0.5; // radians

var enemies = [];
var number_of_enemies = ENEMY_MAX_COUNT;

var p;
var Enemy;
var ShooterEnemy;
var ShotgunEnemy;

function initEnemies(p5) {
  p = p5;
}

Enemy = class Enemy extends Entity {
  constructor(xpos, ypos) {
    super(xpos, ypos, ENEMY_SPEED);
    this.score = ENEMY_SCORE_VALUE;
    this.shipsize = ENEMY_SHIP_SIZE;
    this.vel = p.createVector(0, 0);
    this.angle = 0;
    this.health = 1;
  }
  
  update() {
    // Movement handled in render
  }
  
  render(target) {
    const distToTarget = p.dist(this.pos.x, this.pos.y, target.x, target.y)

    // Calculate the maximum speed based on the distance to the target
    const maxSpeed = Math.min(
      (distToTarget * distToTarget) * (this.speed / (2 * p.height)),
      this.speed
    );

    // Calculate the desired velocity towards the target
    const desiredVel = p.constructor.Vector.sub(target, this.pos).setMag(maxSpeed);

    // Apply a steering force towards the desired velocity
    const steeringForce =
        p.constructor.Vector.sub(desiredVel, this.vel).limit(this.speed / 2);
    this.vel.add(steeringForce);
    this.pos.add(this.vel);

    p.push();
    p.strokeWeight(ENEMY_STROKE_WEIGHT);
    p.noFill();
    p.stroke(255, 0, 0);

    // Calculate the angle between the ship and the mouse
    this.angle = this.vel.heading();

    // Rotate the ship to face the angle of the velocity
    p.translate(this.pos);
    p.rotate(this.angle);

    // Draw the ship as a triangle
    p.triangle(this.shipsize * 2, 0, 0, this.shipsize, 0, -this.shipsize);
    p.strokeWeight(ENEMY_INNER_STROKE_WEIGHT);
    p.triangle(this.shipsize, 0, 0, this.shipsize / 2, 0, -this.shipsize / 2);
    p.triangle(
        -this.shipsize / 4, 0, 0, this.shipsize / 4, 0, -this.shipsize / 4);

    p.pop();
  }
  collides(obj) {
    var d = p.dist(this.pos.x, this.pos.y, obj.pos.x, obj.pos.y);
    if (d < obj.shipsize * 7.5) {
      return true;
    }
    return false;
  }
  
  hit() {
    this.health--;
  }
  
  offscreen() {
    if (this.pos.x < -50 || this.pos.x > p.width + 50) {
      return true;
    }
    return false;
  }
  
  destroy() {
    generateParticles(this.pos, Math.floor(Math.random() * (9 - 5 + 1)) + 5);
    return this.score;
  }
  forceFieldEffect(ship) {
    const distToField = p.constructor.Vector.dist(this.pos, ship.pos);
    if (distToField < ship.shipsize * 6) {
      this.destroy();
      return true;
    }
    return false;
  }
}

ShooterEnemy = class ShooterEnemy extends Enemy {
  constructor(xpos, ypos) {
    super(xpos, ypos);
    this.speed = SHOOTER_ENEMY_SPEED;
    this.shotCooldown = false;
  }
  shootLaser() {
    if (!this.shotCooldown && 10 * Math.random() < 1) {
      this.shotCooldown = true;
      lasers.push(new Laser(
          this.getTipPosition(), this.angle, -this.speed, 238, 109, 115));
      setTimeout(() => {
        this.shotCooldown = false;
      }, SHOOTER_COOLDOWN_MS);
    }
  }
  render(target) {
    const offsetTarget = target.copy();

    offsetTarget.x = target.x + this.shipsize * 10 + (Math.random() * 35);
    offsetTarget.y = target.y + 20 - (Math.random() * 100);

    const distToTarget =
        p.dist(this.pos.x, this.pos.y, offsetTarget.x, offsetTarget.y);

    // Calculate the maximum speed based on the distance to the target
    const maxSpeed =
        Math.min(p.map(2 * distToTarget, 0, p.height, 0, this.speed / 2), this.speed);
    // Calculate the angle between the ship and the mouse
    // Calculate the desired velocity towards the target
    const desiredVel = p.constructor.Vector.sub(offsetTarget, this.pos).setMag(maxSpeed);


    // Apply a steering force towards the desired velocity
    const steeringForce =
        p.constructor.Vector.sub(desiredVel, this.vel).limit(this.speed / 2);
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

ShotgunEnemy = class ShotgunEnemy extends Enemy {
  constructor(xpos, ypos) {
    super(xpos, ypos);
    this.speed = SHOOTER_ENEMY_SPEED;
    this.shotCooldown = false;
    this.score = ENEMY_SCORE_VALUE * 2; // Worth more points
    // Start in a corner position
    this.targetY = ypos < p.height / 2 ? p.height * 0.15 : p.height * 0.85;
    this.targetX = p.width - 50;
  }
  
  shootShotgun() {
    if (!this.shotCooldown && 10 * Math.random() < 1) {
      this.shotCooldown = true;
      
      // Shoot 4 pellets symmetrically
      const baseAngle = this.angle;
      const angleStep = SHOTGUN_SPREAD_ANGLE;
      
      for (let i = 0; i < SHOTGUN_PELLET_COUNT; i++) {
        // Spread pellets symmetrically around base angle
        const offset = (i - (SHOTGUN_PELLET_COUNT - 1) / 2) * angleStep;
        const pelletAngle = baseAngle + offset;
        
        lasers.push(new Laser(
          this.getTipPosition(), 
          pelletAngle, 
          -this.speed, 
          0, 255, 0  // Green color
        ));
      }
      
      // After shooting, 50% chance to move to other corner
      setTimeout(() => {
        this.shotCooldown = false;
        if (Math.random() < 0.5) {
          // Toggle between top and bottom corner
          if (this.targetY < p.height / 2) {
            this.targetY = p.height * 0.85; // Move to bottom corner
          } else {
            this.targetY = p.height * 0.15; // Move to top corner
          }
        }
      }, SHOTGUN_COOLDOWN_MS);
    }
  }
  
  render(target) {
    // Move to target corner position
    const targetPos = p.createVector(this.targetX, this.targetY);
    const distToTarget = p.dist(this.pos.x, this.pos.y, targetPos.x, targetPos.y);
    
    if (distToTarget > 5) {
      const maxSpeed = Math.min(distToTarget / 10, this.speed);
      const desiredVel = p.constructor.Vector.sub(targetPos, this.pos).setMag(maxSpeed);
      const steeringForce = p.constructor.Vector.sub(desiredVel, this.vel).limit(this.speed / 2);
      this.vel.add(steeringForce);
    } else {
      // Slow down when near target position
      this.vel.mult(0.9);
    }
    
    this.pos.add(this.vel);
    
    p.push();
    p.strokeWeight(3);
    p.noFill();
    p.stroke(0, 255, 0); // Green color
    
    // Aim at player
    this.angle = p.atan2(target.y - this.pos.y, target.x - this.pos.x);
    
    p.translate(this.pos);
    p.rotate(this.angle);
    
    // Draw the ship as a triangle (larger than ShooterEnemy)
    p.triangle(this.shipsize * 2.5, 0, 0, this.shipsize * 1.2, 0, -this.shipsize * 1.2);
    
    p.strokeWeight(1.5);
    p.triangle(
      -this.shipsize / 4, 0, 0, this.shipsize / 4, 0, -this.shipsize / 4);
    p.stroke(0, 200, 0);
    p.triangle(this.shipsize * 1.5, 0, 0, this.shipsize / 2, 0, -this.shipsize / 2);
    
    this.shootShotgun();
    p.pop();
  }
  
  getTipPosition() {
    const tipX = this.pos.x + (this.shipsize * 2.5) * Math.cos(this.angle);
    const tipY = this.pos.y + (this.shipsize * 2.5) * Math.sin(this.angle);
    return p.createVector(tipX, tipY);
  }
}

function enemyWave(playerUser) {
  setInterval(function() {
    if (enemies.length < number_of_enemies && p.focused) {
      var rand = Math.floor(60 * Math.random());
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
        case 6:
          if(!playerUser.gameNotStarted)
          {
            enemies.push(
                new ShotgunEnemy(p.width + 50, p.height * Math.random()));
          }
          break;
      }
    }
  }, 1000);
}

function checkEnemyHit(playerUser, laser) {
  for (var u = 0; u < enemies.length; u++) {
    if (laser.hitsShip(enemies[u])) {
      playerUser.score += enemies[u].destroy();
      enemies.splice(u, 1);
      return true;
    }
  }
  return false;
}

function enemyTickCheck(playerUser){
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].render(playerUser.pos);
    enemies[i].showPos();
    if(playerUser.forcefield && enemies[i].forceFieldEffect(playerUser)){
      enemies.splice(i, 1);
      continue;
    }
    if(enemies[i].collides(playerUser)){
      enemies[i].destroy();
      enemies.splice(i, 1);
      playerGetsHit(playerUser);
      continue;
    }
  }
}