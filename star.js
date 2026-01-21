// Star module - global scope for KaiOS compatibility

// === STAR CONFIGURATION ===
var STAR_COUNT = 15;
var STAR_STROKE_WEIGHT = 0.75;

var stars = [];
var number_of_stars = STAR_COUNT;

var p;
var Star;

function initStars(p5) {
  p = p5;
}

Star = class Star {
  constructor(posX, posY, speed) {
    this.pos = p.createVector(posX, posY);
    this.render = function () {
      p.push();
      p.stroke(255);
      p.strokeWeight(STAR_STROKE_WEIGHT);
      p.point(this.pos.x, this.pos.y);
      this.pos.x -= speed;
      p.pop();
    };
    this.offscreen = function () {
      if (this.pos.x > p.width || this.pos.x < 0) {
        return true;
      }
      return false;
    };
  }
}

function generateStar(speed) {
  let posX = p.width;
  let posY = p.height * Math.random();
  let star = new Star(posX, posY, speed - (4 + Math.random()));
  stars.push(star);
}

function generateInitStars(num, speed) {
  for (let i = 0; i < num; i++) {
    let posX = p.width * Math.random();
    let posY = p.height * Math.random();
    let star = new Star(posX, posY, speed - (4 + Math.random()));
    stars.push(star);
  }
}

function starTickCheck(player_user_speed) {
  for (let i = 0; i < stars.length; i++) {
    stars[i].render();
    if (stars[i].offscreen()) {
      stars.splice(i, 1);
    }
  }
  if (stars.length < number_of_stars) {
    generateStar(player_user_speed);
  }
}