# spacescroller game

This is the code for the space scroller game that can be found as the background of my [website](https://carterbrimeyer.com/portfolio/004-portfolio-space-scroller#try-it).

## KaiOS Version

This project has been adapted to work as a KaiOS application!

### How to Use

Simply open `index.html` directly in your browser or on a KaiOS device. No server needed - all files work offline!

**Controls:**
- **↑↓** or **W/S**: Move ship up/down
- **Enter** or **Space**: Shoot lasers / Start game  
- **F1**: Toggle force shield

### Deploy to KaiOS Device

See [KAIOS_README.md](KAIOS_README.md) for instructions on installing to a KaiOS device.

## Files

- `index.html` - Main app entry point (open this!)
- `manifest.webapp` - KaiOS app manifest
- `p5.min.js` - p5.js library (included for offline use)
- `main.js` - Game loop with KaiOS controls
- `*.js` - Game modules (player, enemies, asteroids, etc.)
