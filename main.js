// Main KaiOS game loop - global scope for KaiOS compatibility

// === GAME CONFIGURATION ===
var CANVAS_WIDTH = 240;
var CANVAS_HEIGHT = 320;
var FRAME_RATE = 30;
var ASTEROID_SPAWN_INTERVAL = 60; // frames
var ENEMY_SPAWN_INTERVAL = 180; // frames
var INITIAL_STAR_COUNT = 50;
var STAR_SPEED_BASE = 2;
var STAR_SPEED_VARIANCE = 1;
var PLAYER_MOVE_SPEED = 3;
var TITLE_TEXT_SIZE = 14;
var INSTRUCTION_TEXT_SIZE = 10;
var EXPLOSION_PARTICLE_COUNT = 10;
var ASTEROID_BASE_SPEED = 3;

// KaiOS D-pad state management
var dpadState = {
    up: false,
    down: false,
    left: false,
    right: false,
    center: false
};

var player;

var sketch = function (p) {
    p.setup = () => {
        const canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        canvas.parent('game-container');
        p.frameRate(FRAME_RATE);

        // Initialize the game
        init(p);

        // Create player
        player = new Player(p.height / 2);

        // Generate initial stars using existing function
        generateInitStars(number_of_stars, player.speed);

        // Start asteroid wave spawning
        asteroidWave(player);

        // Start enemy wave spawning
        enemyWave(player);
    };

    p.draw = () => {
        p.background(0);

        // Handle player movement based on D-pad - simulate mouse position for smooth movement
        let mouseX = p.width; // Simulate mouse on right side for rotation
        let mouseY = player.pos.y; // Default to current position

        if (dpadState.up) {
            // Simulate mouse closer above the player for slower upward movement
            mouseY = player.pos.y - 50;
        } else if (dpadState.down) {
            // Simulate mouse closer below the player for slower downward movement
            mouseY = player.pos.y + 50;
        }

        // Stars - using existing tick function
        starTickCheck(player.speed);

        // Enemies - using existing tick function
        enemyTickCheck(player);

        // Asteroids - using existing tick function
        asteroidsTickCheck(player);

        // Effects/Particles - using existing tick function
        particlesTickCheck();

        // Handle player click/shooting
        handlePlayerClick(player, dpadState.center);

        // Lasers - using existing tick function
        lasersTickUpdate(player);

        // Render score (only when game has started)
        if (!player.gameNotStarted) {
            renderScore(player.score, player.lives);
        }

        // Render player with simulated mouse position
        player.render(mouseX, mouseY);

        // Show instructions on start screen
        if (player.gameNotStarted) {
            p.push();
            p.fill(255);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(TITLE_TEXT_SIZE);
            p.text("SPACE SCROLLER", p.width / 2, p.height / 2 - 60);
            p.textSize(INSTRUCTION_TEXT_SIZE);
            p.text("↑↓ Move", p.width / 2, p.height / 2 - 20);
            p.text("⊙ Shoot", p.width / 2, p.height / 2);
            p.text("SoftKey Toggle Shield", p.width / 2, p.height / 2 + 20);
            p.text("Press ⊙ to Start", p.width / 2, p.height / 2 + 60);
            p.pop();
        }
    };

    // Handle key presses for D-pad
    p.keyPressed = () => {
        handleKeyEvent(p.keyCode, true);
    };

    p.keyReleased = () => {
        handleKeyEvent(p.keyCode, false);
    };
};

function handleKeyEvent(keyCode, isPressed) {
    switch (keyCode) {
        case 38: // Up arrow
        case 87: // W
            dpadState.up = isPressed;
            break;
        case 40: // Down arrow
        case 83: // S
            dpadState.down = isPressed;
            break;
        case 37: // Left arrow (for future use)
        case 65: // A
            dpadState.left = isPressed;
            break;
        case 39: // Right arrow (for future use)
        case 68: // D
            dpadState.right = isPressed;
            break;
        case 13: // Enter (center button on KaiOS)
        case 32: // Space
            if (isPressed) {
                if (player && player.gameNotStarted) {
                    player.gameNotStarted = false;
                    player.forcefield = false;
                }
                dpadState.center = true;
            } else {
                dpadState.center = false;
            }
            break;
        case 112: // F1 (desktop testing)
        case 174: // SoftLeft on KaiOS
            if (player && !player.gameNotStarted) {
                player.forcefield = isPressed; // Hold to activate
            }
            break;
    }
}

// Initialize p5.js sketch
new p5(sketch);
