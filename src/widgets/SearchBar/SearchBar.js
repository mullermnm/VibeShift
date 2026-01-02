/**
 * Search Bar Widget - Universal search input
 * Glassmorphism design with keyboard shortcuts
 */
class SearchBar {
  /**
   * @param {MoodEngine} moodEngine - Reference to mood state manager
   * @param {EventBus} eventBus - Event bus for communication
   */
  constructor(moodEngine, eventBus) {
    this.moodEngine = moodEngine;
    this.eventBus = eventBus;
    this.element = null;
    this.inputElement = null;
    this.keyboardHandler = null;

    // Listen for mood changes
    this.unsubscribe = this.eventBus.on('mood-changed', (data) => this.onMoodChange(data));
  }

  /**
   * Create and return the widget DOM element
   * @returns {HTMLElement}
   */
  render() {
    this.element = document.createElement('div');
    this.element.className = 'search-bar widget';
    this.element.innerHTML = `
      <form class="search-bar__form" action="https://www.google.com/search" method="GET" target="_blank">
        <div class="search-bar__input-wrapper">
          <svg class="search-bar__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input 
            type="text" 
            name="q" 
            class="search-bar__input" 
            placeholder="Search here"
            autocomplete="off"
            spellcheck="false"
            aria-label="Search"
          />
          <kbd class="search-bar__shortcut">⌘K</kbd>
        </div>
      </form>
    `;

    this.inputElement = this.element.querySelector('.search-bar__input');

    // Attach event listeners
    this.attachEventListeners();

    // Apply initial mood layout
    const currentMood = this.moodEngine.getCurrentMood();
    this.updateLayout(currentMood);
    this.updatePlaceholder(currentMood);
    this.updateVisibility(this.moodEngine.getCurrentConfig());

    return this.element;
  }

  /**
   * Attach event listeners for focus state and keyboard shortcuts
   */
  attachEventListeners() {
    // Focus state handling
    this.inputElement.addEventListener('focus', () => {
      this.element.classList.add('search-bar--focused');
    });

    this.inputElement.addEventListener('blur', () => {
      this.element.classList.remove('search-bar--focused');
    });

    // Global keyboard shortcut (Cmd/Ctrl + K)
    this.keyboardHandler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.focus();
      }
    };
    document.addEventListener('keydown', this.keyboardHandler);
  }

  /**
   * Handle mood changes
   * @param {Object} data - Mood change event data
   */
  onMoodChange(data) {
    const { mood, config } = data;

    this.updateVisibility(config);
    this.updateLayout(mood);
    this.updatePlaceholder(mood);
  }

  /**
   * Update widget visibility based on mood config
   * @param {Object} config - Mood configuration
   */
  updateVisibility(config) {
    if (!this.element) return;

    const widgetConfig = config.widgets.SearchBar;

    if (!widgetConfig || !widgetConfig.visible) {
      this.element.classList.add('widget--hidden');
      this.element.classList.remove('widget--visible');
    } else {
      this.element.classList.remove('widget--hidden');
      this.element.classList.add('widget--visible');
    }
  }

  /**
   * Update layout classes based on mood
   * @param {string} mood - Current mood ID
   */
  updateLayout(mood) {
    if (!this.element) return;

    // Remove all layout modifier classes
    this.element.className = this.element.className.replace(/search-bar--\S+/g, '').trim();
    this.element.classList.add('search-bar', 'widget');

    // Add mood-specific layout class
    const config = this.moodEngine.getMoodConfig(mood);
    if (config && config.widgets.SearchBar && config.widgets.SearchBar.visible) {
      const layout = config.widgets.SearchBar.layout;
      if (layout) {
        this.element.classList.add(`search-bar--${layout}`);
      }
    }
  }

  /**
   * Update placeholder text based on mood
   * @param {string} mood - Current mood ID
   */
  updatePlaceholder(mood) {
    if (!this.inputElement) return;

    const placeholders = {
      focused: 'Search your tasks, notes, or resources for deep work...',
      feminine: 'What inspires you today?',
      energetic: 'Search anything...',
      calm: 'Breathe and search...'
    };

    this.inputElement.placeholder = placeholders[mood] || 'Search...';
  }

  /**
   * Focus the search input
   */
  focus() {
    if (this.inputElement) {
      this.inputElement.focus();
    }
  }

  /**
   * Cleanup when widget is destroyed
   */
  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.keyboardHandler) {
      document.removeEventListener('keydown', this.keyboardHandler);
    }
    if (this.element) {
      this.element.remove();
      this.element = null;
      this.inputElement = null;
    }
  }
}

export default SearchBar;
