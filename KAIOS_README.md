# Space Scroller - KaiOS Installation Guide

A space shooter game for KaiOS devices where you navigate through asteroids and enemies.

## Controls

- **↑/↓** (D-pad Up/Down): Move ship up and down
- **⊙** (Center button/Enter): Shoot lasers / Start game
- **SoftLeft (F1)**: Toggle force shield on/off

## Installation on KaiOS

### Method 1: WebIDE (For Development/Testing)

1. Enable Developer Mode on your KaiOS device
   - Dial `*#*#33284#*#*` on your phone
   - Enable "Debugger" in Settings → Device → Developer

2. Install Firefox (desktop version)

3. Open WebIDE in Firefox
   - Menu → More Tools → Web Developer → WebIDE
   - Or press `Shift + F8`

4. Connect your KaiOS device via USB

5. In WebIDE:
   - Click "Open Packaged App"
   - Select the spacescroller folder
   - Click "Install and Run"

### Method 2: OmniSD (Sideloading)

1. Download OmniSD app to your KaiOS device

2. Copy all files from this folder to your device's SD card in a folder like `/sdcard/spacescroller/`

3. Open OmniSD on your device

4. Navigate to the spacescroller folder

5. Select `manifest.webapp` and choose "Install"

### Method 3: Package and Submit to Store

1. Create a ZIP file containing all files:
   - index.html
   - manifest.webapp  
   - style.css
   - main.js
   - All .js game files
   - p5.min.js
   - fonts/ folder
   - Icon files (see below)

2. Submit to KaiStore or BananaHackers Store following their guidelines

## Creating Icons (Required for Store Submission)

You need to create two icon files:
- `icon-56.png` (56×56 pixels)
- `icon-112.png` (112×112 pixels)

Use a space-themed icon. You can use any image editor to create these.

## Files Included

```text
spacescroller/
├── index.html           # Main entry point
├── manifest.webapp      # KaiOS app manifest
├── style.css           # KaiOS-optimized styles (240x320)
├── p5.min.js           # p5.js library (offline)
├── main.js             # Game loop with KaiOS controls
├── index.js            # Game initialization
├── player.js           # Player ship logic
├── asteroid.js         # Asteroid entities
├── enemy.js            # Enemy ships
├── laser.js            # Laser projectiles
├── effects.js          # Visual effects (particles)
├── entity.js           # Base entity class
├── star.js             # Background stars
├── score.js            # Score rendering
└── fonts/              # Custom fonts
```

## Notes

- **No Internet Required**: All dependencies are included locally (p5.js)
- **Optimized for KaiOS**: 240x320 resolution, 30 FPS
- **Works Offline**: Once installed, no network needed
- **Lightweight**: Uses standard JavaScript (no ES6 modules)

## Troubleshooting

**Game won't install:**
- Make sure all files are in the same folder
- Check that manifest.webapp is valid JSON

**Game is slow:**
- This is normal on low-end devices
- Frame rate is already reduced to 30 FPS

**Controls don't work:**
- Some KaiOS devices use different key codes
- F1 may not work on all devices for shield toggle

## Original Game

Based on the space scroller game from [carterjb.com](https://carterjb.com/portfolio/004-portfolio-space-scroller).
