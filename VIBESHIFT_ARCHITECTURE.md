# VibeShift: Complete Architecture Plan
**Version:** MVP 1.0 (Manifest V3)  
**Target:** Chrome Extension - New Tab Replacement  
**Tech Stack:** Vanilla JS, CSS3, Manifest V3, Chrome Storage API

---

## 1. Project Structure

```
vibeshift/
├── manifest.json                    # Manifest V3 configuration
├── README.md                        # Open-source documentation
├── CONTRIBUTING.md                  # Plugin architecture guide
├── LICENSE                          # MIT License
│
├── src/
│   ├── newtab.html                 # Main entry point
│   ├── newtab.js                   # Orchestrator & State Manager
│   │
│   ├── core/
│   │   ├── MoodEngine.js           # Core mood state manager
│   │   ├── StorageManager.js       # Chrome storage wrapper
│   │   ├── EventBus.js             # Pub/sub for widget communication
│   │   └── ConfigLoader.js         # Loads mood configurations
│   │
│   ├── moods/
│   │   ├── mood-config.js          # All mood definitions (extensible)
│   │   ├── focused.config.js       # Focused mood specifics
│   │   ├── feminine.config.js      # Feminine mood specifics
│   │   ├── energetic.config.js     # Energetic mood specifics
│   │   └── calm.config.js          # Calm mood specifics
│   │
│   ├── widgets/
│   │   ├── BaseWidget.js           # Abstract widget class
│   │   ├── SearchBar/
│   │   │   ├── SearchBar.js
│   │   │   └── SearchBar.css
│   │   ├── Clock/
│   │   │   ├── Clock.js
│   │   │   └── Clock.css
│   │   ├── FocusTimer/
│   │   │   ├── FocusTimer.js
│   │   │   └── FocusTimer.css
│   │   ├── QuoteCard/
│   │   │   ├── QuoteCard.js
│   │   │   └── QuoteCard.css
│   │   ├── BreathingGuide/
│   │   │   ├── BreathingGuide.js
│   │   │   └── BreathingGuide.css
│   │   ├── NewsWidget/
│   │   │   ├── NewsWidget.js
│   │   │   └── NewsWidget.css
│   │   ├── WeatherWidget/
│   │   │   ├── WeatherWidget.js
│   │   │   └── WeatherWidget.css
│   │   └── TaskList/
│   │       ├── TaskList.js
│   │       └── TaskList.css
│   │
│   ├── animations/
│   │   ├── FloatingEngine.js       # Core particle system
│   │   ├── particles/
│   │   │   ├── Petal.js            # Feminine floating petals
│   │   │   ├── Bubble.js           # Calm floating bubbles
│   │   │   ├── Spark.js            # Energetic geometric shapes
│   │   │   └── BaseParticle.js     # Abstract particle class
│   │   └── lottie/                 # Lottie JSON files
│   │       ├── feminine-glow.json
│   │       ├── calm-waves.json
│   │       └── energetic-pulse.json
│   │
│   ├── backgrounds/
│   │   ├── BackgroundManager.js    # Handles image loading & caching
│   │   ├── UnsplashAPI.js          # API wrapper
│   │   └── fallback/               # Local fallback images
│   │       ├── focused.jpg
│   │       ├── feminine.jpg
│   │       ├── energetic.jpg
│   │       └── calm.jpg
│   │
│   ├── styles/
│   │   ├── reset.css               # CSS reset
│   │   ├── variables.css           # CSS custom properties per mood
│   │   ├── global.css              # Base styles
│   │   ├── moods/
│   │   │   ├── focused.css         # Focused-specific overrides
│   │   │   ├── feminine.css        # Feminine-specific overrides
│   │   │   ├── energetic.css       # Energetic-specific overrides
│   │   │   └── calm.css            # Calm-specific overrides
│   │   └── animations.css          # Reusable keyframes
│   │
│   ├── ui/
│   │   ├── MoodSelector.js         # Floating mood switcher UI
│   │   ├── MoodSelector.css
│   │   ├── SettingsPanel.js        # Extension settings
│   │   └── SettingsPanel.css
│   │
│   └── utils/
│       ├── logger.js               # Development logging
│       ├── performance.js          # Performance monitoring
│       └── quotes.js               # Quote database per mood
│
├── assets/
│   ├── icons/
│   │   ├── icon16.png
│   │   ├── icon48.png
│   │   └── icon128.png
│   └── fonts/
│       └── [custom fonts if needed]
│
├── plugins/                        # For future extensibility
│   ├── plugin-template/
│   │   ├── mood.config.js
│   │   └── README.md
│   └── community/                  # User-contributed moods
│
└── tests/
    ├── unit/
    └── integration/
```

---

## 2. Core System Architecture

### 2.1 The Mood Engine (State Machine)

**Purpose:** Central state manager that broadcasts mood changes.

**Key Responsibilities:**
- Load saved mood from `chrome.storage.sync`
- Emit `mood-changed` events via EventBus
- Validate mood transitions
- Persist mood state across sessions

**State Flow:**
```
User Action → MoodEngine.setMood() → EventBus.emit('mood-changed') 
→ Widgets listen → Render updates → Animations trigger
```

**API:**
```javascript
class MoodEngine {
  constructor(eventBus, storageManager)
  async init()
  getCurrentMood()
  async setMood(moodName)
  getMoodConfig(moodName)
  registerMood(moodConfig)  // For plugin support
}
```

---

### 2.2 Widget System (Component Architecture)

**All widgets inherit from `BaseWidget`:**

```javascript
class BaseWidget {
  constructor(moodEngine, eventBus)
  
  // Lifecycle hooks
  async init()
  render(container)
  destroy()
  
  // Mood-aware methods
  onMoodChange(newMood)
  getVisibilityForMood(mood)  // true/false/'dimmed'
  getLayoutForMood(mood)      // CSS class names
  
  // State management
  saveState()
  restoreState()
}
```

**Example Widget Implementation:**
```javascript
class SearchBar extends BaseWidget {
  getVisibilityForMood(mood) {
    return {
      focused: true,
      feminine: true,
      energetic: true,
      calm: false  // Hidden in calm mode
    }[mood];
  }
  
  getLayoutForMood(mood) {
    return {
      focused: 'search-bar--centered search-bar--large',
      feminine: 'search-bar--top search-bar--elegant',
      energetic: 'search-bar--compact',
      calm: ''
    }[mood];
  }
}
```

---

### 2.3 Floating Animation Engine

**Purpose:** Render mood-specific particles with performance budgets.

**Architecture:**
- Uses `requestAnimationFrame` loop
- Object pooling for particle reuse (prevent GC pauses)
- Max 50 particles on screen simultaneously
- Canvas-based rendering (better than DOM manipulation)

**Performance Strategy:**
```javascript
class FloatingEngine {
  constructor(maxParticles = 50)
  
  start(particleType, config)
  stop()
  pause()  // When tab loses focus
  resume()
  
  // Internal
  _particlePool = []
  _activeParticles = []
  _animationFrame = null
  
  _render()  // Main RAF loop
  _updateParticles(deltaTime)
  _recycleParticle(particle)
}
```

**Particle Types:**
- **Petal** (Feminine): SVG-based, rotate + fall + drift
- **Bubble** (Calm): Circular gradients, slow rise + wobble
- **Spark** (Energetic): Geometric shapes, fast diagonal movement

---

### 2.4 Background Management System

**Strategy:**
- **Primary:** Fetch from Unsplash API (1920x1080, mood-specific queries)
- **Fallback:** Local images (bundled in extension)
- **Caching:** Store last 3 images per mood in `chrome.storage.local`

**API Flow:**
```
BackgroundManager.load(mood) 
  → Check cache 
  → If expired/missing: UnsplashAPI.fetch(mood) 
  → Preload image 
  → Apply with CSS fade transition 
  → Cache result
```

**Performance:**
- Lazy load: Don't fetch until mood selected
- Compress cached images to <500KB each
- Prefetch next likely mood (predict based on time of day)

---

## 3. Mood Configuration Schema

Each mood is defined by a declarative config file:

```javascript
// Example: feminine.config.js
export default {
  id: 'feminine',
  name: 'Feminine',
  icon: '✨',
  
  // Visual theme
  theme: {
    primaryColor: '#FFB6C1',
    secondaryColor: '#FFF0F5',
    accentColor: '#FF69B4',
    fontFamily: "'Playfair Display', serif",
    backgroundFilter: 'brightness(1.1) saturate(1.2)'
  },
  
  // Widget visibility & layout
  widgets: {
    SearchBar: { visible: true, layout: 'top-elegant' },
    Clock: { visible: true, layout: 'center-large' },
    QuoteCard: { visible: true, layout: 'bottom-center' },
    FocusTimer: { visible: false },
    BreathingGuide: { visible: false },
    NewsWidget: { visible: false },
    WeatherWidget: { visible: false },
    TaskList: { visible: false }
  },
  
  // Animation config
  animations: {
    enabled: true,
    type: 'petal',
    particleCount: 25,
    speed: 0.5,
    config: {
      colors: ['#FFB6C1', '#FFF0F5', '#FF69B4'],
      size: { min: 10, max: 20 },
      rotationSpeed: 2
    }
  },
  
  // Background settings
  background: {
    unsplashQuery: 'feminine aesthetic pink flowers',
    fallbackImage: 'feminine.jpg',
    overlayOpacity: 0.3
  },
  
  // Quote theme
  quotes: {
    category: 'self-love',
    examples: [
      'You are enough, exactly as you are.',
      'Soft hearts are the strongest kind.'
    ]
  }
}
```

---

## 4. State Persistence Strategy

**Chrome Storage API Usage:**

```javascript
// chrome.storage.sync (syncs across devices, max 8KB per item)
{
  'vibeshift:currentMood': 'focused',
  'vibeshift:settings': {
    enableAnimations: true,
    enableBackgroundFetch: true,
    defaultMood: 'focused'
  }
}

// chrome.storage.local (local only, unlimited)
{
  'vibeshift:cache:backgrounds': {
    focused: { url: '...', timestamp: 1704067200000 },
    feminine: { url: '...', timestamp: 1704067200000 }
  },
  'vibeshift:widgetStates': {
    FocusTimer: { lastDuration: 25, lastStartTime: null },
    TaskList: { tasks: [...] }
  }
}
```

---

## 5. Extension Manifest (V3)

```json
{
  "manifest_version": 3,
  "name": "VibeShift",
  "version": "1.0.0",
  "description": "A mood-responsive new tab experience",
  
  "chrome_url_overrides": {
    "newtab": "src/newtab.html"
  },
  
  "permissions": [
    "storage"
  ],
  
  "host_permissions": [
    "https://api.unsplash.com/*",
    "https://api.openweathermap.org/*"
  ],
  
  "icons": {
    "16": "assets/icons/icon16.png",
    "48": "assets/icons/icon48.png",
    "128": "assets/icons/icon128.png"
  },
  
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

---

## 6. Plugin Architecture (Extensibility)

To allow community-contributed moods:

**Step 1:** Developer creates `plugins/my-mood/mood.config.js`

```javascript
export default {
  id: 'cyberpunk',
  name: 'Cyberpunk',
  icon: '🤖',
  theme: { ... },
  widgets: { ... },
  animations: { ... },
  background: { ... }
}
```

**Step 2:** Register via `ConfigLoader.registerPlugin()`

```javascript
// In newtab.js
import cyberpunkMood from './plugins/cyberpunk/mood.config.js';
configLoader.registerPlugin(cyberpunkMood);
```

**Step 3:** Mood now appears in MoodSelector UI automatically

---

## 7. Performance Budget

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| Time to Interactive (TTI) | < 500ms | < 1000ms |
| First Contentful Paint | < 300ms | < 600ms |
| Bundle Size (uncompressed) | < 200KB | < 500KB |
| Memory Usage | < 50MB | < 100MB |
| Animation FPS | 60 FPS | > 30 FPS |
| API Response Time | < 2s | < 5s |

**Monitoring Strategy:**
- Use `performance.mark()` and `performance.measure()`
- Log metrics to console in dev mode
- Fallback to static mode if performance degrades

---

## 8. MVP Feature Priority

**Phase 1 (Core MVP):**
- ✅ Mood Engine + State Persistence
- ✅ 4 Core Moods (Focused, Feminine, Energetic, Calm)
- ✅ Basic Widgets: SearchBar, Clock, QuoteCard
- ✅ Floating Engine (Petal, Bubble, Spark particles)
- ✅ Local Fallback Backgrounds
- ✅ Mood Selector UI

**Phase 2 (API Integration):**
- ⏳ Unsplash API Integration
- ⏳ Weather Widget + OpenWeather API
- ⏳ Advanced Widgets: FocusTimer, BreathingGuide

**Phase 3 (Advanced Features):**
- ⏳ Lottie Animation Support
- ⏳ News Widget + RSS/API
- ⏳ Task List with Persistence
- ⏳ Settings Panel

**Phase 4 (Community):**
- ⏳ Plugin System Documentation
- ⏳ Example Community Mood
- ⏳ GitHub Contribution Guidelines

---

## 9. Error Handling & Resilience

**Critical Failure Points:**
1. **Unsplash API Down** → Use fallback images, don't block render
2. **Storage Access Denied** → Default to 'focused' mood, memory-only state
3. **Animation Performance Drop** → Auto-disable animations, show static UI
4. **Widget Crash** → Isolate via try-catch, render placeholder

**Implementation:**
```javascript
// Global error boundary
window.addEventListener('error', (event) => {
  logger.error('Global error:', event.error);
  // Graceful degradation logic
});

// Per-widget error handling
class BaseWidget {
  render(container) {
    try {
      this._renderInternal(container);
    } catch (error) {
      logger.error(`Widget ${this.constructor.name} failed:`, error);
      container.innerHTML = `<div class="widget-error">Unable to load</div>`;
    }
  }
}
```

---

## 10. Testing Strategy

**Unit Tests (Jest):**
- MoodEngine state transitions
- StorageManager read/write operations
- ConfigLoader validation

**Integration Tests:**
- Mood change triggers correct widget updates
- Animation engine starts/stops correctly
- Background loading with mocked API

**Manual Testing Checklist:**
- [ ] Install extension in Chrome
- [ ] Switch between all 4 moods
- [ ] Verify animations render smoothly
- [ ] Check storage persistence (close/reopen tab)
- [ ] Test with slow network (throttle to 3G)
- [ ] Test with API failures (block Unsplash domain)
- [ ] Verify performance in Chrome DevTools

---

## 11. Open Source Contribution Guide

**`CONTRIBUTING.md` Structure:**

1. **Adding a New Mood:**
   - Copy `plugins/plugin-template/`
   - Define `mood.config.js` schema
   - Submit PR with screenshots

2. **Adding a New Widget:**
   - Extend `BaseWidget` class
   - Implement required lifecycle methods
   - Add to widget registry

3. **Code Standards:**
   - ES6+ syntax
   - JSDoc comments for public methods
   - No jQuery or heavy frameworks

4. **PR Requirements:**
   - Passes all tests
   - Performance budget compliance
   - Updated documentation

---

## Conclusion

This architecture prioritizes:
- **Modularity:** Easy to add moods/widgets without touching core
- **Performance:** Canvas animations, object pooling, lazy loading
- **Extensibility:** Plugin system for community contributions
- **Resilience:** Graceful degradation when APIs fail

The system is designed for a single AI agent to implement in phases, with clear separation of concerns and testable components.