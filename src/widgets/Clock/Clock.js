/**
 * Clock Widget - Displays current time
 * Adapts format and styling based on current mood
 */
class Clock {
  /**
   * @param {MoodEngine} moodEngine - Reference to mood state manager
   * @param {EventBus} eventBus - Event bus for communication
   */
  constructor(moodEngine, eventBus) {
    this.moodEngine = moodEngine;
    this.eventBus = eventBus;
    this.element = null;
    this.timeElement = null;
    this.dateElement = null;
    this.greetingElement = null;
    this.intervalId = null;
    
    // Listen for mood changes
    this.unsubscribe = this.eventBus.on('mood-changed', (data) => this.onMoodChange(data));
  }

  /**
   * Create and return the widget DOM element
   * @returns {HTMLElement}
   */
  render() {
    this.element = document.createElement('div');
    this.element.className = 'clock widget';
    this.element.setAttribute('role', 'timer');
    this.element.setAttribute('aria-live', 'polite');
    
    this.element.innerHTML = `
      <div class="clock__container">
        <div class="clock__greeting"></div>
        <div class="clock__time"></div>
        <div class="clock__date"></div>
      </div>
    `;
    
    this.greetingElement = this.element.querySelector('.clock__greeting');
    this.timeElement = this.element.querySelector('.clock__time');
    this.dateElement = this.element.querySelector('.clock__date');
    
    // Initial update
    this.updateTime();
    
    // Update every minute (no need for seconds in most moods)
    this.intervalId = setInterval(() => this.updateTime(), 1000);
    
    // Apply initial mood
    const currentMood = this.moodEngine.getCurrentMood();
    this.updateLayout(currentMood);
    this.updateVisibility(this.moodEngine.getCurrentConfig());
    
    return this.element;
  }

  /**
   * Update the displayed time
   */
  updateTime() {
    const now = new Date();
    const mood = this.moodEngine.getCurrentMood();
    
    // Format time based on mood
    const timeOptions = this.getTimeFormat(mood);
    const timeStr = now.toLocaleTimeString('en-US', timeOptions);
    
    // Format date
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', dateOptions);
    
    // Get greeting
    const greeting = this.getGreeting(now.getHours());
    
    if (this.timeElement) {
      this.timeElement.textContent = timeStr;
    }
    
    if (this.dateElement) {
      this.dateElement.textContent = dateStr;
    }
    
    if (this.greetingElement) {
      this.greetingElement.textContent = greeting;
    }
  }

  /**
   * Get time format options based on mood
   * @param {string} mood - Current mood ID
   * @returns {Object} Intl.DateTimeFormat options
   */
  getTimeFormat(mood) {
    const formats = {
      focused: { hour: '2-digit', minute: '2-digit', hour12: false },
      feminine: { hour: 'numeric', minute: '2-digit', hour12: true },
      energetic: { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false },
      calm: { hour: 'numeric', minute: '2-digit', hour12: true }
    };
    
    return formats[mood] || formats.focused;
  }

  /**
   * Get greeting based on time of day
   * @param {number} hour - Current hour (0-23)
   * @returns {string} Greeting text
   */
  getGreeting(hour) {
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Good Evening';
    } else {
      return 'Good Night';
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
    this.updateTime(); // Refresh time format
  }

  /**
   * Update widget visibility based on mood config
   * @param {Object} config - Mood configuration
   */
  updateVisibility(config) {
    if (!this.element) return;
    
    const widgetConfig = config.widgets.Clock;
    
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
    this.element.className = this.element.className.replace(/clock--\S+/g, '').trim();
    this.element.classList.add('clock', 'widget');
    
    // Add mood-specific layout class
    const config = this.moodEngine.getMoodConfig(mood);
    if (config && config.widgets.Clock && config.widgets.Clock.visible) {
      const layout = config.widgets.Clock.layout;
      if (layout) {
        this.element.classList.add(`clock--${layout}`);
      }
    }
    
    // Show/hide elements based on mood
    this.updateElementVisibility(mood);
  }

  /**
   * Update visibility of sub-elements based on mood
   * @param {string} mood - Current mood ID
   */
  updateElementVisibility(mood) {
    // Show greeting only in certain moods
    const showGreeting = ['feminine', 'calm'].includes(mood);
    if (this.greetingElement) {
      this.greetingElement.style.display = showGreeting ? 'block' : 'none';
    }
    
    // Show date in most moods except minimal ones
    const showDate = ['feminine', 'energetic', 'calm'].includes(mood);
    if (this.dateElement) {
      this.dateElement.style.display = showDate ? 'block' : 'none';
    }
  }

  /**
   * Cleanup when widget is destroyed
   */
  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}

export default Clock;
