// Entity module - global scope for KaiOS compatibility

var p;
var Entity;

function initEntities(p5) {
  p = p5;
}

Entity = class Entity {
  constructor(xPos, yPos, speed) {
    this.pos = p.createVector(xPos, yPos);
    this.speed = speed;
    this.vel = 0;
  }

  render() {
    throw new Error('Unimplemented render method');
  }

  showPos() {
    p.push();
    p.strokeWeight(3);
    p.stroke(0, 255, 255);
    p.point(this.pos.x, this.pos.y);
    p.pop();
  }

  forceFieldEffect(ship){
    throw new Error('Unimplemented forceFieldEffect method');
  }
}