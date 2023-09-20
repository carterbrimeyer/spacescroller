import * as effects from './effects.js';
import * as enemy from './enemy.js';
import * as entity from './entity.js';
import * as laser from './laser.js';
import * as player from './player.js';
import * as score from './score.js';
import * as star from './star.js';
import * as asteroid from './asteroid.js';

export * from './player.js';
export * from './asteroid.js';
export * from './effects.js';
export * from './laser.js';
export * from './enemy.js';
export * from './score.js';
export * from './star.js';

let p;

let button;
const isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
let mouseIsPressed = false;
let playerUser;
let myFont;

export function init(p5) {
    p = p5;
    player.initPlayer(p5);
    star.initStars(p5);
    asteroid.initAsteroids(p5);
    effects.initEffects(p5);
    enemy.initEnemies(p5);
    entity.initEntities(p5);
    laser.initLasers(p5);
    score.initScore(p5);
}

export const preload = () => {
    const loc = window.top.location.href.concat('scroller/fonts/DSEG14Classic-Regular.ttf');
    if (location.protocol !== 'file:') {
        myFont = p.loadFont(loc);
    }
};

export const setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight);
    if (location.protocol !== 'file:') {
      p.textFont(myFont);
    } 
    playerUser = new player.Player(p.innerHeight / 2);
    star.generateInitStars(star.number_of_stars, playerUser.speed);
    asteroid.asteroidWave(playerUser);
    enemy.enemyWave(playerUser);
  
    button = p.createButton('Start Game');
    button.hide();
    if(playerUser.gameNotStarted && p.width > 700 && !isMobile){
      button.show();
      button.style('background-color', 'white');
      button.style('color', 'black');
      button.style('border', '2px solid black');
      button.style('padding', '10px 20px');
      button.style('font-size', '150%');
      button.style('font-family', 'old7seg');
      button.parent('cardstack');
      const myDiv = document.getElementById('cardstack');
      const rect = myDiv.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      button.position(centerX - (button.width + 40 /2) , centerY);
      
      button.mousePressed(() => {
        playerUser.gameNotStarted = false;
        button.hide();
      });
      
    }
  };

export const draw = () => {
    p.background(1);
    
    if(playerUser.gameNotStarted && p.width > 700 && !isMobile){
      p.stroke(255);
      p.strokeWeight(0.5);
      p.fill(255);
  
      p.textAlign(p.CENTER, p.CENTER);
      const controltip = "Controls\nLeft Click: Shoot\nSpace: Toggle Shield\n\nUse your mouse to move\nthe ship up and down\n\nClick START GAME to play";
      const controltipSize = p.height/70;
      p.textSize(controltipSize);
      const controltipOffset = p.textWidth(controltip);
  
      p.text(controltip, player.distance_from_left + controltipOffset/6, playerUser.pos.y);
    }
    
    if(!p.focused){
      playerUser.forcefield = true;
    }
    // Stars
    star.starTickCheck(playerUser.speed);
  
    // Enemies
    enemy.enemyTickCheck(playerUser);
  
    // Asteroids
    asteroid.asteroidsTickCheck(playerUser);
  
    // Effects
    effects.particlesTickCheck();
  
    // Handle Player Click
    player.handlePlayerClick(playerUser, mouseIsPressed);
  
    // Lasers 
    laser.lasersTickUpdate(playerUser);
  
    if(!playerUser.gameNotStarted){
      score.renderScore(playerUser.score, playerUser.pos.y, playerUser.lives);
    }
  
    playerUser.render(p.mouseX, p.mouseY);
  };

export const mousePressed = () => {
    mouseIsPressed = true;
  };

export const mouseReleased = () => {
    mouseIsPressed = false;
  };

export const keyPressed = () => {
    if (p.keyCode === 32 && !playerUser.gameNotStarted) { // Toggle forcefield if space is pressed
      playerUser.forcefield = !playerUser.forcefield;
    }
  };

export const windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    if(playerUser.gameNotStarted){
      const myDiv = document.getElementById('cardstack');
      const rect = myDiv.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      button.position(centerX - (button.width+40 /2) , centerY);
      if(p.width > 700 && !isMobile){
        button.show();
      }
      else
      {
        button.hide();
      }
    }
  };