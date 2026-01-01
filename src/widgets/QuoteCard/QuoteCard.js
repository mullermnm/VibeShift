import { getRandomQuote } from '../../utils/quotes.js';

/**
 * Quote Card Widget - Displays mood-specific motivational quotes
 * Uses glassmorphism design with mood-specific layouts
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
    this.textElement = null;
    this.authorElement = null;
    this.currentQuote = null;
    
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
    
    const mood = this.moodEngine.getCurrentMood();
    this.currentQuote = getRandomQuote(mood);
    
    this.element.innerHTML = `
      <div class="quote-card__container">
        <svg class="quote-card__icon" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
        </svg>
        <blockquote class="quote-card__text">
          ${this.currentQuote.text}
        </blockquote>
        <cite class="quote-card__author">— ${this.currentQuote.author}</cite>
        <button class="quote-card__refresh" aria-label="New quote">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
        </button>
      </div>
    `;
    
    this.textElement = this.element.querySelector('.quote-card__text');
    this.authorElement = this.element.querySelector('.quote-card__author');
    
    // Add click handler for refresh button
    const refreshButton = this.element.querySelector('.quote-card__refresh');
    refreshButton.addEventListener('click', () => this.refreshQuote());
    
    // Apply initial mood
    this.updateLayout(mood);
    this.updateVisibility(this.moodEngine.getCurrentConfig());
    
    return this.element;
  }

  /**
   * Refresh with a new random quote
   */
  refreshQuote() {
    const mood = this.moodEngine.getCurrentMood();
    this.currentQuote = getRandomQuote(mood);
    
    // Animate quote change
    this.element.classList.add('quote-card--refreshing');
    
    setTimeout(() => {
      this.textElement.textContent = this.currentQuote.text;
      this.authorElement.textContent = `— ${this.currentQuote.author}`;
      
      this.element.classList.remove('quote-card--refreshing');
    }, 300);
  }

  /**
   * Update quote content
   */
  updateContent() {
    if (this.textElement && this.authorElement && this.currentQuote) {
      this.textElement.textContent = this.currentQuote.text;
      this.authorElement.textContent = `— ${this.currentQuote.author}`;
    }
  }

  /**
   * Handle mood changes
   * @param {Object} data - Mood change event data
   */
  onMoodChange(data) {
    const { mood, config } = data;
    
    this.updateVisibility(config);
    this.updateLayout(mood);
    
    // Get new quote for new mood
    this.currentQuote = getRandomQuote(mood);
    this.updateContent();
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
      this.textElement = null;
      this.authorElement = null;
    }
  }
}

export default QuoteCard;
