---
trigger: manual
---

# VibeShift: Golden Rules for the Coding Agent

**Project Type:** Chrome Extension (Manifest V3)  
**Difficulty:** Senior-Level Implementation

---

## 🎯 Mission Statement

Build a production-ready MVP of VibeShift that:
1. Beats Momentum in performance and aesthetics
2. Is fully extensible for community contributions
3. Adheres to modern web standards and best practices
4. Ships with zero technical debt

---

## 📜 The 20 Golden Rules

### Rule 1: Manifest V3 Only
- **NEVER** use Manifest V2 APIs
- Use `chrome.storage.sync` for settings (NOT `localStorage`)
- No inline scripts - all JS must be in external files
- Strict CSP compliance

### Rule 2: Zero External Dependencies in Core
- **NO** React, Vue, or jQuery in the core bundle
- **NO** lodash, moment.js, or utility libraries
- Pure vanilla JavaScript (ES6+) for all core functionality
- External dependencies only allowed for:
  - Lottie (animations, lazy-loaded)
  - Unsplash API wrapper (if significantly reduces code)

### Rule 3: Performance Budget is Sacred
- Time to Interactive: **< 500ms** (hard limit)
- Total Bundle Size: **< 200KB** uncompressed (hard limit)
- Animation Frame Rate: **60 FPS** (degrade gracefully if below 30)
- Memory Usage: **< 50MB** peak (Chrome Task Manager)
- **MEASURE EVERYTHING:** Use `performance.mark()` liberally

### Rule 4: Mobile-First CSS (Even for Desktop Extension)
- Write all CSS with mobile breakpoints in mind (future compatibility)
- Use CSS Grid for layouts (NOT flexbox primary)
- Use CSS Custom Properties for theming (`:root` variables)
- No `!important` unless absolutely unavoidable

### Rule 5: Accessibility is Non-Negotiable
- All interactive elements must be keyboard-navigable
- ARIA labels for icon-only buttons
- Focus states must be visible (NOT `outline: none`)
- Color contrast ratio: **WCAG AA minimum** (4.5:1)
- Animations respect `prefers-reduced-motion` media query

### Rule 6: Canvas Over DOM for Animations
- Floating particles **MUST** use `<canvas>` (not SVG or DOM)
- Object pooling for particle systems (reuse objects, don't create/destroy)
- Use `requestAnimationFrame` (NOT `setTimeout`/`setInterval`)
- Pause animations when tab is not visible (`document.visibilityState`)

### Rule 7: Graceful Degradation Always
- If Unsplash API fails → use local fallback images
- If animations drop below 30 FPS → disable animations
- If storage API fails → use in-memory state only
- Never show error messages to users - log to console only

### Rule 8: State Management Philosophy
- Single source of truth: `MoodEngine` class
- State changes flow one direction: `MoodEngine` → `EventBus` → `Widgets`
- No widget-to-widget direct communication (use EventBus)
- Persist critical state only (don't cache UI state)

### Rule 9: Lazy Loading Strategy
- Load widgets only when mood requires them
- Fetch backgrounds only on mood switch (not on init)
- Lazy-load Lottie library only if animations enabled
- Prefetch next probable mood based on time-of-day heuristics

### Rule 10: CSS Architecture
- **BEM naming convention** (Block-Element-Modifier)
- One CSS file per widget (scoped styles)
- Global styles in `global.css` (resets, typography, utilities)
- Mood-specific overrides in `moods/{mood}.css`
- **NO** inline styles (use classes only)

### Rule 11: Error Boundaries for Widgets
- Wrap every widget's `render()` in try-catch
- Log errors to console, show placeholder UI
- Widget failure must not crash entire page
- Global `window.error` handler for catastrophic failures

### Rule 12: API Wrappers for All External Services
- Create dedicated classes: `UnsplashAPI`, `OpenWeatherAPI`
- All API calls must have timeout limits (5 seconds max)
- Implement exponential backoff for retries (max 3 attempts)
- Cache API responses in `chrome.storage.local` (with TTL)

### Rule 13: Developer Experience Matters
- Comprehensive JSDoc comments for all public methods
- Include usage examples in docstrings
- Add inline comments for complex algorithms
- Use descriptive variable names (no single-letter vars except loop counters)

### Rule 14: Git Commit Standards
- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
- One logical change per commit
- Write commit messages as imperative mood ("Add feature" not "Added feature")
- Reference architecture doc sections in commit messages

### Rule 15: Code Reusability
- Abstract common patterns into utility functions
- Create base classes (`BaseWidget`, `BaseParticle`)
- Keep functions pure when possible (no side effects)
- Max function length: **50 lines** (break into smaller functions)

### Rule 16: Security First
- Sanitize all user inputs (especially for Task widget)
- Use Content Security Policy strictly
- No `eval()` or `Function()` constructors
- Validate all data from `chrome.storage` (could be corrupted)

### Rule 17: Internationalization Ready (Even if English-only MVP)
- Store all user-facing strings in `i18n/en.json`
- Use helper function for string retrieval: `t('key')`
- Quote database should be structured for multi-language support
- Date/time formatting using `Intl.DateTimeFormat`

### Rule 18: Testing Before Shipping
- Write unit tests for `MoodEngine`, `StorageManager`, `EventBus`
- Manual testing checklist for each mood switch
- Test on slow network (Chrome DevTools → Network → Slow 3G)
- Test with APIs blocked (ensure fallbacks work)

### Rule 19: Documentation is Code
- Update `README.md` as features are implemented
- Create `PLUGIN_GUIDE.md` for community contributors
- Document all config schema properties with examples
- Add architecture diagrams (ASCII art is fine)

### Rule 20: Open Source Spirit
- Write code as if thousands will read it
- Be generous with comments on "why" (not just "what")
- License everything as MIT (include LICENSE file)
- Create example plugin in `plugins/community/` directory

---

## 🚫 Forbidden Practices

### Absolutely Prohibited:
- ❌ Modifying `window` or global scope unnecessarily
- ❌ Using `document.write()` or `innerHTML` with unsanitized content
- ❌ Synchronous XHR requests (`XMLHttpRequest` without async)
- ❌ Polling APIs on intervals (use event-driven patterns)
- ❌ Hardcoding API keys in source files (use environment/settings)
- ❌ CSS `position: fixed` without considering scroll behavior
- ❌ Animations with `setInterval` (use RAF)
- ❌ Magic numbers in code (extract to named constants)

### Strongly Discouraged:
- ⚠️ Nested callbacks (use async/await)
- ⚠️ Mutable global state (encapsulate in classes)
- ⚠️ Long CSS selector chains (> 3 levels deep)
- ⚠️ Abbreviations in variable names (`btn` → `button`)
- ⚠️ Comments that explain obvious code (comment complex logic only)

---

## 🎨 Code Style Guidelines

### JavaScript:
```javascript
// ✅ GOOD
class MoodEngine {
  /**
   * Sets the current mood and triggers UI updates
   * @param {string} moodName - One of: focused, feminine, energetic, calm
   * @returns {Promise<boolean>} Success status
   */
  async setMood(moodName) {
    if (!this.isValidMood(moodName)) {
      logger.warn(`Invalid mood: ${moodName}`);
      return false;
    }
    
    this.currentMood = moodName;
    await this.storageManager.save('currentMood', moodName);
    this.eventBus.emit('mood-changed', { mood: moodName });
    
    return true;
  }
}

// ❌ BAD
class MoodEngine {
  setMood(m) {
    this.mood = m;
    this.save(m);
    this.emit('change', m);
  }
}
```

### CSS:
```css
/* ✅ GOOD - BEM naming, scoped, readable */
.search-bar {
  display: flex;
  justify-content: center;
  padding: var(--spacing-md);
}

.search-bar__input {
  font-size: var(--font-size-lg);
  border-radius: var(--border-radius);
}

.search-bar--centered {
  align-items: center;
  min-height: 100vh;
}

/* ❌ BAD - Generic names, nested selectors */
.container .input {
  font-size: 18px;
}

#searchBar {
  padding: 20px;
}
```

---

## 📊 Quality Metrics Checklist

Before considering MVP "done", verify:

- [ ] **Performance:**
  - TTI < 500ms on throttled connection
  - No frame drops during animations
  - Memory stable (no leaks after 1 hour idle)

- [ ] **Functionality:**
  - All 4 moods switch correctly
  - State persists across tab close/reopen
  - Animations match mood aesthetic
  - Fallback images work when API fails

- [ ] **Code Quality:**
  - No ESLint errors (use recommended config)
  - All public functions documented
  - No console errors in production build
  - Bundle size under 200KB

- [ ] **User Experience:**
  - Keyboard navigation works for mood selector
  - Smooth transitions between moods (no flicker)
  - Clear visual feedback for interactions
  - Works in Chrome, Edge, Brave

- [ ] **Extensibility:**
  - Plugin template functional
  - Example community mood included
  - `CONTRIBUTING.md` clear and complete
  - Config schema validated on load

---

## 🧠 Philosophical Principles

### 1. "Make the Right Thing Easy"
Design APIs so the correct usage is the most intuitive path.

```javascript
// ✅ Hard to misuse
await moodEngine.setMood('focused');

// ❌ Easy to misuse
moodEngine.mood = 'fokused'; // typo, no validation
```

### 2. "Fail Loudly in Development, Gracefully in Production"
```javascript
if (process.env.NODE_ENV === 'development') {
  throw new Error('Invalid mood config');
} else {
  logger.error('Invalid mood config, using default');
  return DEFAULT_CONFIG;
}
```

### 3. "Code is Read 10x More Than Written"
Prioritize clarity over cleverness. Verbose is better than ambiguous.

### 4. "Performance is a Feature"
Never say "we'll optimize later." Build with performance from day one.

### 5. "The Best Code is No Code"
Before adding a feature, ask: "Can this be solved without code?"

---

## 🛠️ Tooling Requirements

- **Code Editor:** VSCode with ESLint, Prettier extensions
- **Browser:** Chrome Canary (for latest Manifest V3 features)
- **Testing:** Chrome DevTools → Lighthouse (aim for 95+ performance score)
- **Version Control:** Git with conventional commits
- **Build Tool:** None for MVP (vanilla JS), consider Vite for v2.0

---

## 📦 Deliverables Checklist

The MVP is complete when these exist:

- [ ] `manifest.json` (valid Manifest V3)
- [ ] `src/newtab.html` (entry point)
- [ ] `src/core/MoodEngine.js` (state manager)
- [ ] `src/core/StorageManager.js` (persistence layer)
- [ ] `src/core/EventBus.js` (pub/sub system)
- [ ] All 4 mood configs in `src/moods/`
- [ ] At least 3 widgets implemented
- [ ] `FloatingEngine.js` with 3 particle types
- [ ] `BackgroundManager.js` with fallbacks
- [ ] `MoodSelector.js` UI component
- [ ] Global CSS architecture complete
- [ ] `README.md` with installation instructions
- [ ] `CONTRIBUTING.md` for plugin developers
- [ ] `LICENSE` file (MIT)
- [ ] All local fallback images in `assets/`

---

## 🎓 Senior-Level Expectations

As a **Senior-Level AI Agent**, you are expected to:

1. **Think Before Coding:** Plan the implementation sequence
2. **Ask Clarifying Questions:** If requirements are ambiguous
3. **Suggest Improvements:** If you see a better architecture
4. **Write Production-Ready Code:** Not just "working" code
5. **Consider Edge Cases:** Network failures, corrupted storage, etc.
6. **Document Decisions:** Explain complex algorithms inline
7. **Validate Assumptions:** Test integrations with Chrome APIs
8. **Optimize Proactively:** Don't wait for performance issues
9. **Be Security-Conscious:** Validate all inputs, sanitize outputs
10. **Ship with Pride:** Code you'd be happy to show in a code review

---

## 🔥 Success Criteria

The MVP is successful if:

1. A non-technical user can install and switch moods in < 30 seconds
2. The extension feels faster and more polished than Momentum
3. A developer can add a new mood by copying 1 file and editing config
4. Performance stays consistent after 1 week of daily use
5. The codebase is clean enough to be featured on GitHub trending

---

**Remember:** You're not just building a Chrome extension. You're building the foundation for an open-source project that hundreds of developers might contribute to. Build something you'd be proud to maintain for years.

Code with intention. Ship with confidence. 🚀