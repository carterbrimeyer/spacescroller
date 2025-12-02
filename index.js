import { initEffects } from './effects.js';
import { initEnemies } from './enemy.js';
import { initEntities } from './entity.js';
import { initLasers } from './laser.js';
import { initPlayer } from './player.js';
import { initScore } from './score.js';
import { initStars } from './star.js';
import { initAsteroids } from './asteroid.js';

export * from './player.js';
export * from './asteroid.js';
export * from './effects.js';
export * from './laser.js';
export * from './enemy.js';
export * from './score.js';
export * from './star.js';

export function init(p) {
    initPlayer(p);
    initStars(p);
    initAsteroids(p);
    initEffects(p);
    initEnemies(p);
    initEntities(p);
    initLasers(p);
    initScore(p);
}
