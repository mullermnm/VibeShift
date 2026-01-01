/**
 * Quote Card Widget - Displays mood-specific motivational quotes
 * Randomly selects quotes from the mood's quote pool
 */
class QuoteCard {
  /**
   * @param {MoodEngine} moodEngine - Reference to mood state manager
   * @param {EventBus} eventBus - Event bus for communication
   */
  constructor(moodEngine, eventBus) {
    this.moodEngine = moodEngine;
    this.eventBus = eventBus;
    this.element = null;
    this.quoteElement = null;
    this.currentQuote = '';
    
    // Listen for mood changes
    this.unsubscribe = this.eventBus.on('mood-changed', (data) => this.onMoodChange(data));
  }

  /**
   * Create and return the widget DOM element
   * @returns {HTMLElement}
   */
  render() {
    this.element = document.createElement('div');
    this.element.className = 'quote-card widget';
    this.element.setAttribute('role', 'article');
    this.element.setAttribute('aria-label', 'Inspirational quote');
    
    this.element.innerHTML = `
      <blockquote class="quote-card__content">
        <p class="quote-card__text"></p>
      </blockquote>
      <button class="quote-card__refresh" aria-label="Get new quote" title="New quote">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
          <path d="M16 21h5v-5"></path>
        </svg>
      </button>
    `;
    
    this.quoteElement = this.element.querySelector('.quote-card__text');
    
    // Add click handler for refresh button
    const refreshButton = this.element.querySelector('.quote-card__refresh');
    refreshButton.addEventListener('click', () => this.showNewQuote());
    
    // Initial quote
    const config = this.moodEngine.getCurrentConfig();
    this.showQuote(config);
    
    // Apply initial mood
    const currentMood = this.moodEngine.getCurrentMood();
    this.updateLayout(currentMood);
    this.updateVisibility(config);
    
    return this.element;
  }

  /**
   * Show a random quote from the current mood's pool
   * @param {Object} config - Mood configuration
   */
  showQuote(config) {
    if (!config || !config.quotes || !config.quotes.pool) {
      this.currentQuote = 'Every day is a new beginning.';
    } else {
      // Get a random quote that's different from current
      const quotes = config.quotes.pool;
      let newQuote = this.currentQuote;
      
      if (quotes.length > 1) {
        while (newQuote === this.currentQuote) {
          newQuote = quotes[Math.floor(Math.random() * quotes.length)];
        }
      } else {
        newQuote = quotes[0];
      }
      
      this.currentQuote = newQuote;
    }
    
    this.animateQuoteChange();
  }

  /**
   * Animate the quote text change
   */
  animateQuoteChange() {
    if (!this.quoteElement) return;
    
    // Fade out
    this.quoteElement.style.opacity = '0';
    this.quoteElement.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      this.quoteElement.textContent = this.currentQuote;
      
      // Fade in
      this.quoteElement.style.opacity = '1';
      this.quoteElement.style.transform = 'translateY(0)';
    }, 200);
  }

  /**
   * Show a new random quote (for refresh button)
   */
  showNewQuote() {
    const config = this.moodEngine.getCurrentConfig();
    this.showQuote(config);
    
    // Add a small animation to the refresh button
    const refreshButton = this.element.querySelector('.quote-card__refresh');
    refreshButton.classList.add('quote-card__refresh--spinning');
    setTimeout(() => {
      refreshButton.classList.remove('quote-card__refresh--spinning');
    }, 500);
  }

  /**
   * Handle mood changes
   * @param {Object} data - Mood change event data
   */
  onMoodChange(data) {
    const { mood, config } = data;
    
    this.updateVisibility(config);
    this.updateLayout(mood);
    this.showQuote(config);
  }

  /**
   * Update widget visibility based on mood config
   * @param {Object} config - Mood configuration
   */
  updateVisibility(config) {
    if (!this.element) return;
    
    const widgetConfig = config.widgets.QuoteCard;
    
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
    this.element.className = this.element.className.replace(/quote-card--\S+/g, '').trim();
    this.element.classList.add('quote-card', 'widget');
    
    // Add mood-specific layout class
    const config = this.moodEngine.getMoodConfig(mood);
    if (config && config.widgets.QuoteCard && config.widgets.QuoteCard.visible) {
      const layout = config.widgets.QuoteCard.layout;
      if (layout) {
        this.element.classList.add(`quote-card--${layout}`);
      }
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
      this.quoteElement = null;
    }
  }
}

export default QuoteCard;
