# VibeShift 🌀

A mood-responsive Chrome extension that replaces your new tab with a dynamic dashboard that adapts to your energy.

![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)
![License MIT](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **4 Distinct Moods:**
  - 🎯 **Focused** - Minimalist workspace for deep work
  - ✨ **Feminine** - Aesthetic-driven with floating petals
  - 🔥 **Energetic** - Maximalist productivity hub
  - 🌊 **Calm** - Mental reset with breathing guide

- **Dynamic Animations** - Canvas-based floating particles (60 FPS)
- **Smart Backgrounds** - Unsplash API with gradient fallbacks
- **Extensible Architecture** - Plugin system for community moods
- **Fast & Lightweight** - Pure vanilla JS, no heavy frameworks

## 🚀 Installation

### From Source (Developer Mode)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **"Developer mode"** (toggle in top right)
4. Click **"Load unpacked"**
5. Select the `VibeShift` folder
6. Open a new tab to see VibeShift!

### Building Icons

The extension requires PNG icons. Convert the SVG icons to PNG:

```bash
# Using ImageMagick (optional)
convert assets/icons/icon16.svg assets/icons/icon16.png
convert assets/icons/icon48.svg assets/icons/icon48.png
convert assets/icons/icon128.svg assets/icons/icon128.png
```

Or use any SVG to PNG converter online.

## ⚙️ Configuration

### Add Your Own Unsplash API Key (Optional)

For dynamic background images:

1. Get a free API key from [Unsplash Developers](https://unsplash.com/developers)
2. Open `src/backgrounds/UnsplashAPI.js`
3. Replace the empty `accessKey` with your key:

```javascript
this.accessKey = 'YOUR_UNSPLASH_ACCESS_KEY';
```

Without an API key, VibeShift uses beautiful gradient backgrounds.

## 🎨 Moods

### 🎯 Focused
- **Goal:** Deep work immersion
- **Layout:** Centered search bar, subtle quote
- **Animations:** None (zero distractions)
- **Best for:** Coding, writing, studying

### ✨ Feminine
- **Goal:** Nurturing, aesthetic creativity
- **Layout:** Elegant clock, affirmations
- **Animations:** Floating petals
- **Best for:** Creative work, self-care moments

### 🔥 Energetic
- **Goal:** Maximum productivity
- **Layout:** Full dashboard with all widgets
- **Animations:** Dynamic sparks
- **Best for:** High-energy work sessions

### 🌊 Calm
- **Goal:** Mental reset and anxiety reduction
- **Layout:** Breathing guide, zen quotes
- **Animations:** Rising bubbles
- **Best for:** Breaks, meditation, wind-down

## 🛠️ Tech Stack

- **Language:** Vanilla JavaScript (ES6+)
- **Styling:** CSS3 (Grid, Custom Properties, Animations)
- **Extension:** Chrome Manifest V3
- **Animations:** Canvas API
- **Storage:** Chrome Storage API (sync + local)

## 📁 Project Structure

```
vibeshift/
├── manifest.json           # Extension configuration
├── src/
│   ├── newtab.html        # Entry point
│   ├── newtab.js          # Main orchestrator
│   ├── core/              # Core systems
│   │   ├── EventBus.js    # Pub/sub communication
│   │   ├── StorageManager.js  # Chrome storage wrapper
│   │   └── MoodEngine.js  # State management
│   ├── moods/             # Mood configurations
│   ├── widgets/           # UI widgets
│   ├── animations/        # Particle systems
│   ├── backgrounds/       # Background management
│   ├── styles/            # CSS files
│   └── ui/                # UI components
└── assets/                # Icons and images
```

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on adding custom moods and widgets.

## 📄 License

MIT License - See [LICENSE](LICENSE)

## 🙏 Acknowledgments

- Inspired by [Momentum](https://momentumdash.com/)
- Background images from [Unsplash](https://unsplash.com/)
- Icons and design inspired by modern dashboard aesthetics
