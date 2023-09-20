let stars = [];
export const number_of_stars = 40;

var p;
export function initStars(p5) {
  p = p5;
}

export class Star {
  constructor(posX, posY, speed) {
    this.pos = p.createVector(posX, posY);
    this.render = function () {
      p.push();
      p.stroke(255);
      p.strokeWeight(1.5);
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

export function generateStar(speed) {
  let posX = p.width;
  let posY = p.height * Math.random();
  let star = new Star(posX, posY, speed - (4 + Math.random()));
  stars.push(star);
}
export function generateInitStars(num, speed) {
  for (let i = 0; i < num; i++) {
    let posX = p.width * Math.random();
    let posY = p.height * Math.random();
    let star = new Star(posX, posY, speed - (4 + Math.random()));
    stars.push(star);
  }
}

export function starTickCheck(player_user_speed) {
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