# Contributing to VibeShift

Thank you for your interest in contributing! This guide will help you add custom moods and widgets.

## 🎨 Adding a New Mood

### Step 1: Create Mood Configuration

Create a new file in `src/moods/` following this template:

```javascript
// src/moods/cyberpunk.config.js
export default {
  id: 'cyberpunk',
  name: 'Cyberpunk',
  icon: '🤖',
  description: 'Neon-soaked future vibes',
  
  theme: {
    primaryColor: '#00F0FF',
    secondaryColor: '#FF00F0',
    accentColor: '#F0FF00',
    backgroundColor: '#0D0221',
    textColor: '#FFFFFF',
    fontFamily: "'Orbitron', sans-serif",
    backgroundFilter: 'brightness(1.2) saturate(1.5)'
  },
  
  widgets: {
    SearchBar: { visible: true, layout: 'top-compact' },
    Clock: { visible: true, layout: 'top-left-bold' },
    QuoteCard: { visible: true, layout: 'center-motivational' },
    FocusTimer: { visible: false },
    BreathingGuide: { visible: false },
    NewsWidget: { visible: false },
    WeatherWidget: { visible: false },
    TaskList: { visible: false }
  },
  
  animations: {
    enabled: true,
    type: 'spark',  // 'petal', 'bubble', or 'spark'
    particleCount: 40,
    speed: 1.2,
    config: {
      colors: ['#00F0FF', '#FF00F0', '#F0FF00'],
      size: { min: 3, max: 10 },
      shapes: ['triangle', 'square', 'circle'],
      opacity: { min: 0.5, max: 0.9 }
    }
  },
  
  background: {
    unsplashQuery: 'cyberpunk neon city night',
    fallbackImage: 'cyberpunk.jpg',
    overlayOpacity: 0.4,
    blur: 0
  },
  
  quotes: {
    category: 'future',
    pool: [
      'The future is already here.',
      'Hack the system, change the world.',
      'In the neon glow, we find our path.'
    ]
  }
};
```

### Step 2: Register the Mood

Add your mood to `src/moods/mood-config.js`:

```javascript
import cyberpunkConfig from './cyberpunk.config.js';

// Add to MOOD_CONFIGS object
MOOD_CONFIGS.cyberpunk = cyberpunkConfig;
```

### Step 3: Create CSS (Optional)

For mood-specific style overrides, create `src/styles/moods/cyberpunk.css`:

```css
.vibe-cyberpunk {
  /* Custom overrides */
}

.vibe-cyberpunk .search-bar__input {
  /* Mood-specific input styles */
}
```

### Step 4: Test Your Mood

1. Load the extension in Chrome
2. Open a new tab
3. Click the mood selector
4. Your new mood should appear!

---

## 🧩 Adding a New Widget

### Step 1: Create Widget Files

Create a folder: `src/widgets/YourWidget/`

**YourWidget.js:**
```javascript
class YourWidget {
  constructor(moodEngine, eventBus) {
    this.moodEngine = moodEngine;
    this.eventBus = eventBus;
    this.element = null;
    
    // Subscribe to mood changes
    this.unsubscribe = this.eventBus.on('mood-changed', (data) => {
      this.onMoodChange(data);
    });
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'your-widget widget';
    this.element.innerHTML = `
      <div class="your-widget__content">
        <!-- Widget content here -->
      </div>
    `;
    
    // Apply initial mood
    this.updateVisibility(this.moodEngine.getCurrentConfig());
    this.updateLayout(this.moodEngine.getCurrentMood());
    
    return this.element;
  }

  onMoodChange(data) {
    const { mood, config } = data;
    this.updateVisibility(config);
    this.updateLayout(mood);
  }

  updateVisibility(config) {
    if (!this.element) return;
    
    const widgetConfig = config.widgets.YourWidget;
    
    if (!widgetConfig || !widgetConfig.visible) {
      this.element.classList.add('widget--hidden');
      this.element.classList.remove('widget--visible');
    } else {
      this.element.classList.remove('widget--hidden');
      this.element.classList.add('widget--visible');
    }
  }

  updateLayout(mood) {
    if (!this.element) return;
    
    // Remove previous layout classes
    this.element.className = this.element.className
      .replace(/your-widget--\S+/g, '')
      .trim();
    this.element.classList.add('your-widget', 'widget');
    
    // Add mood-specific layout
    const config = this.moodEngine.getMoodConfig(mood);
    if (config?.widgets?.YourWidget?.layout) {
      this.element.classList.add(`your-widget--${config.widgets.YourWidget.layout}`);
    }
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}

export default YourWidget;
```

**YourWidget.css:**
```css
.your-widget {
  /* Base styles */
}

.your-widget--layout-name {
  /* Layout variant */
}
```

### Step 2: Register the Widget

Add to `src/newtab.js`:

```javascript
import YourWidget from './widgets/YourWidget/YourWidget.js';

// In initializeWidgets():
const yourWidget = new YourWidget(this.moodEngine, this.eventBus);
container.appendChild(yourWidget.render());
this.widgets.push(yourWidget);
```

### Step 3: Add Widget to Mood Configs

Update each mood config to include your widget:

```javascript
widgets: {
  // ... existing widgets
  YourWidget: { visible: true, layout: 'default' }
}
```

### Step 4: Link CSS

Add to `src/newtab.html`:

```html
<link rel="stylesheet" href="widgets/YourWidget/YourWidget.css">
```

---

## 📝 Code Standards

### JavaScript
- Use ES6+ syntax (classes, arrow functions, async/await)
- Add JSDoc comments for public methods
- Keep functions under 50 lines
- Use descriptive variable names

### CSS
- Follow BEM naming: `.block__element--modifier`
- Use CSS custom properties for theming
- One CSS file per widget
- No `!important` unless necessary

### General
- No external dependencies in core
- Performance first (< 500ms TTI target)
- Graceful degradation for all features

---

## 🔄 Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/amazing-mood
   ```
3. **Commit** with conventional commits:
   ```bash
   git commit -m "feat: add cyberpunk mood"
   git commit -m "fix: resolve animation lag"
   git commit -m "docs: update contributing guide"
   ```
4. **Push** to your branch:
   ```bash
   git push origin feature/amazing-mood
   ```
5. **Open** a Pull Request

### PR Requirements
- [ ] Code follows style guidelines
- [ ] Self-tested in Chrome
- [ ] No console errors
- [ ] Documentation updated (if needed)
- [ ] Screenshots included (for visual changes)

---

## 🐛 Reporting Bugs

Open an issue with:
- Chrome version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)

---

## 💡 Feature Requests

Open an issue with:
- Clear description of the feature
- Use case / why it's valuable
- Mockup or examples (if applicable)

---

## ❓ Questions?

Open an issue with the `question` label!
