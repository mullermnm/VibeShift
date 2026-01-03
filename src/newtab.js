/**
 * VibeShift - Main Orchestrator
 * Entry point that initializes the entire system
 * Updated for glassmorphism UI with environment layers
 */

import EventBus from './core/EventBus.js';
import StorageManager from './core/StorageManager.js';
import MoodEngine from './core/MoodEngine.js';
import FloatingEngine from './animations/FloatingEngine.js';
import BackgroundManager from './backgrounds/BackgroundManager.js';
import SearchBar from './widgets/SearchBar/SearchBar.js';
import Clock from './widgets/Clock/Clock.js';
import QuoteCard from './widgets/QuoteCard/QuoteCard.js';
import BreathingGuide from './widgets/BreathingGuide/BreathingGuide.js';
import ImageGallery from './widgets/ImageGallery/ImageGallery.js';
import Dashboard from './widgets/Dashboard/Dashboard.js';
import SoundPlayer from './widgets/SoundPlayer/SoundPlayer.js';
import NavBar from './ui/NavBar.js';
import SettingsPanel from './ui/SettingsPanel.js';
import MoodSelector from './ui/MoodSelector.js';
import { getRandomBackground } from './backgrounds/background-library.js';

/**
 * Main Application Class
 * Orchestrates all components of VibeShift
 */
class VibeShiftApp {
  constructor() {
    // Core systems
    this.eventBus = new EventBus();
    this.storageManager = new StorageManager();
    this.moodEngine = new MoodEngine(this.eventBus, this.storageManager);

    // Managers
    this.floatingEngine = null;
    this.backgroundManager = null;

    // UI Components
    this.navBar = null;
    this.settingsPanel = null;
    this.moodSelector = null;

    // Widget instances
    this.widgets = [];

    // State
    this.initialized = false;
  }

  /**
   * Initialize the application
   */
  async init() {
    performance.mark('vibeshift-start');
    console.log('🚀 VibeShift initializing...');

    try {
      // Initialize core systems
      await this.moodEngine.init();

      // Initialize animation engine
      this.floatingEngine = new FloatingEngine('animation-canvas');

      // Initialize background manager
      this.backgroundManager = new BackgroundManager(this.storageManager);

      // Initialize UI Components
      this.initializeUI();

      // Apply initial mood styling
      this.applyMoodStyling(this.moodEngine.getCurrentMood());

      // Update CSS variables from mood config
      this.updateCSSVariables(this.moodEngine.getCurrentConfig());

      // Initialize widgets
      this.initializeWidgets();

      // Load background for initial mood
      await this.backgroundManager.loadBackground(this.moodEngine.getCurrentConfig());

      // Start animations if enabled
      const config = this.moodEngine.getCurrentConfig();
      if (config.animations.enabled) {
        this.floatingEngine.start(config.animations.type, config.animations);
      }

      // Listen for mood changes
      this.eventBus.on('mood-changed', (data) => this.onMoodChange(data));

      // Setup global error handling
      this.setupErrorHandling();

      this.initialized = true;

      // Performance logging
      performance.mark('vibeshift-ready');
      performance.measure('vibeshift-init', 'vibeshift-start', 'vibeshift-ready');
      const initTime = performance.getEntriesByName('vibeshift-init')[0].duration;
      console.log(`✅ VibeShift initialized in ${initTime.toFixed(2)}ms`);

      // Warn if over performance budget
      if (initTime > 500) {
        console.warn(`⚠️ Performance budget exceeded! Target: <500ms, Actual: ${initTime.toFixed(2)}ms`);
      }

    } catch (error) {
      console.error('❌ VibeShift initialization failed:', error);
      this.fallbackMode();
    }
  }

  /**
   * Initialize UI components (NavBar, Settings, MoodSelector)
   */
  initializeUI() {
    // 1. Settings Panel
    this.settingsPanel = new SettingsPanel(this.moodEngine, this.backgroundManager);
    this.settingsPanel.init();

    // 2. Navigation Bar
    this.navBar = new NavBar(this.moodEngine, this.eventBus, this.settingsPanel);
    this.navBar.init();

    // Mount NavBar to body (so it overlays everything)
    const moodSelectorContainer = this.navBar.mount(document.body);

    // 3. Mood Selector (Nested in NavBar)
    this.moodSelector = new MoodSelector(this.moodEngine, this.eventBus);
    const selectorEl = this.moodSelector.render();

    // Add mood selector to the right side of navbar
    const navBarRight = document.querySelector('.nav-bar__right');
    if (navBarRight) {
      // Apply horizontal layout for navbar
      selectorEl.classList.add('mood-orbit--static', 'mood-orbit--horizontal');
      navBarRight.appendChild(selectorEl);
    }

    // Initial update for NavBar mood state
    this.navBar.updateForMood(this.moodEngine.getCurrentMood());
  }

  /**
   * Initialize all widgets
   */
  initializeWidgets() {
    const container = document.getElementById('main-container');

    // Create widgets
    const widgetClasses = [
      SearchBar,
      Clock,
      QuoteCard,
      BreathingGuide,
      ImageGallery,
      Dashboard,
      SoundPlayer
    ];

    widgetClasses.forEach(WidgetClass => {
      try {
        const widget = new WidgetClass(this.moodEngine, this.eventBus);
        const element = widget.render();
        container.appendChild(element);
        this.widgets.push(widget);
      } catch (error) {
        console.error(`Failed to initialize widget ${WidgetClass.name}:`, error);
      }
    });
  }

  /**
   * Handle mood change events
   * @param {Object} data - Mood change event data
   */
  async onMoodChange(data) {
    const { mood, config, isInitial } = data;

    if (isInitial) {
      console.log(`Mood loaded: ${mood}`);
      return;
    }

    console.log(`Mood changed: ${mood}`);

    // Update body class for mood-specific CSS
    this.applyMoodStyling(mood);

    // Update CSS variables
    this.updateCSSVariables(config);

    // Load new background
    await this.backgroundManager.loadBackground(config);

    // Handle animations
    if (config.animations.enabled) {
      this.floatingEngine.start(config.animations.type, config.animations);
    } else {
      this.floatingEngine.stop();
    }
  }

  /**
   * Apply mood-specific body class
   * @param {string} mood - Current mood ID
   */
  applyMoodStyling(mood) {
    const body = document.getElementById('app-body');
    const environment = document.getElementById('environment');

    // Remove all mood classes from body
    body.className = body.className.replace(/vibe-\w+/g, '').trim();

    // Add new mood class
    body.classList.add(`vibe-${mood}`);

    // Also update environment fallback class if needed
    if (environment) {
      environment.className = environment.className.replace(/environment--fallback-\w+/g, '').trim();
      environment.classList.add('environment');
    }
  }

  /**
   * Update CSS custom properties from mood config
   * @param {Object} config - Mood configuration
   */
  updateCSSVariables(config) {
    const root = document.documentElement;
    const theme = config.theme;

    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-secondary', theme.secondaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);
    root.style.setProperty('--color-background', theme.backgroundColor);
    root.style.setProperty('--color-text', theme.textColor);
    root.style.setProperty('--font-family-primary', theme.fontFamily);

    // Update background overlay opacity
    root.style.setProperty('--background-overlay-opacity', config.background.overlayOpacity);
    root.style.setProperty('--background-blur', `${config.background.blur}px`);
  }

  /**
   * Setup global error handling
   */
  setupErrorHandling() {
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      // Don't crash the whole app for individual widget errors
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });
  }

  /**
   * Fallback mode if initialization fails
   */
  fallbackMode() {
    console.warn('Running in fallback mode');
    document.body.innerHTML = `
      <div style="
        display: flex; 
        flex-direction: column;
        align-items: center; 
        justify-content: center; 
        height: 100vh; 
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-align: center;
        padding: 2rem;
      ">
        <h1 style="font-size: 3rem; margin-bottom: 1rem;">🌀 VibeShift</h1>
        <p style="font-size: 1.25rem; opacity: 0.9; margin-bottom: 2rem;">
          Something went wrong while loading.
        </p>
        <button 
          onclick="location.reload()" 
          style="
            padding: 1rem 2rem;
            font-size: 1rem;
            background: white;
            color: #667eea;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            font-weight: 600;
          "
        >
          Reload Tab
        </button>
      </div>
    `;
  }

  /**
   * Cleanup and destroy all components
   */
  destroy() {
    // Destroy all widgets
    this.widgets.forEach(widget => {
      if (widget.destroy) {
        widget.destroy();
      }
    });
    this.widgets = [];

    // Stop animations
    if (this.floatingEngine) {
      this.floatingEngine.stop();
    }

    // Clear event bus
    this.eventBus.clear();
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new VibeShiftApp();
    app.init();

    // Expose app instance for debugging
    window.__vibeshift = app;
  });
} else {
  const app = new VibeShiftApp();
  app.init();

  // Expose app instance for debugging
  window.__vibeshift = app;
}
