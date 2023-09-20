var p;

import { distance_from_left } from "./player";

export function initScore(p5) {
  p = p5;
}

export function renderScore(score, yPos, playerLives){
    p.stroke(255);
    p.strokeWeight(1.25);
    p.noFill();
    p.textSize(p.height/40);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("SCORE\n" + Math.round(score), distance_from_left - 25, yPos - 80 - (3*p.height)/80);
    var lives = "LIFE\n";
    for(var i = 0; i < playerLives; i++){
        lives += "*  ";
    } 
    p.text(lives, distance_from_left - 25, yPos + 80 + (3*p.height)/80);
}