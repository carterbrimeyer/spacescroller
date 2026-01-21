// Score module - global scope for KaiOS compatibility

// === SCORE DISPLAY CONFIGURATION ===
var SCORE_STROKE_WEIGHT = 0.625;
var SCORE_TEXT_SIZE_DIVISOR = 25; // p.height / this value

var p;
var highScore = 0;

function initScore(p5) {
  p = p5;
  loadHighScore();
}

function loadHighScore() {
  try {
    const saved = localStorage.getItem('spaceScrollerHighScore');
    if (saved) {
      highScore = parseInt(saved, 10);
    }
  } catch (e) {
    console.warn('Could not load high score:', e);
    highScore = 0;
  }
}

function saveHighScore(score) {
  try {
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('spaceScrollerHighScore', highScore.toString());
    }
  } catch (e) {
    console.warn('Could not save high score:', e);
  }
}

function renderScore(score, playerLives){
    p.stroke(255);
    p.strokeWeight(SCORE_STROKE_WEIGHT);
    p.noFill();
    p.textSize(p.height/SCORE_TEXT_SIZE_DIVISOR);
    p.textAlign(p.LEFT, p.TOP);
    
    // Score at top left
    p.text("SCORE\n" + Math.round(score), 10, 5);
    
    // Centered high score at top
    p.textSize(p.height / (SCORE_TEXT_SIZE_DIVISOR * 1.3));
    p.stroke(150, 150, 255);
    p.textAlign(p.CENTER, p.TOP);
    p.text("HI: " + Math.round(highScore), p.width / 2, 5);
    
    // Lives at top right
    p.stroke(255);
    p.textSize(p.height/SCORE_TEXT_SIZE_DIVISOR);
    var lives = "LIFE\n";
    for(var i = 0; i < playerLives; i++){
        lives += "*  ";
    }
    p.textAlign(p.RIGHT, p.TOP);
    p.text(lives, p.width - 10, 5);
}