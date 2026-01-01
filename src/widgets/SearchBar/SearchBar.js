/**
 * Search Bar Widget - Universal search input
 * Adapts layout and styling based on current mood
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
          <svg class="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input 
            type="text" 
            name="q" 
            class="search-bar__input" 
            placeholder="Search the web..."
            autocomplete="off"
            aria-label="Search the web"
          />
        </div>
      </form>
    `;
    
    this.inputElement = this.element.querySelector('.search-bar__input');
    
    // Apply initial mood layout
    const currentMood = this.moodEngine.getCurrentMood();
    this.updateLayout(currentMood);
    this.updateVisibility(this.moodEngine.getCurrentConfig());
    
    // Focus input on page load (slight delay for smooth transition)
    setTimeout(() => {
      if (this.inputElement && this.element.style.display !== 'none') {
        this.inputElement.focus();
      }
    }, 500);
    
    return this.element;
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
      focused: 'What are you working on?',
      feminine: 'Search for inspiration...',
      energetic: 'Go get it! Search...',
      calm: 'Search peacefully...'
    };
    
    this.inputElement.placeholder = placeholders[mood] || 'Search the web...';
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
    if (this.element) {
      this.element.remove();
      this.element = null;
      this.inputElement = null;
    }
  }
}

export default SearchBar;
