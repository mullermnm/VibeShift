/**
 * Mood Selector UI - Floating mood switcher
 * Allows users to switch between different mood states
 */
class MoodSelector {
  /**
   * @param {MoodEngine} moodEngine - Reference to mood state manager
   * @param {EventBus} eventBus - Event bus for communication
   */
  constructor(moodEngine, eventBus) {
    this.moodEngine = moodEngine;
    this.eventBus = eventBus;
    this.element = null;
    this.isOpen = false;
    this.menuElement = null;
    this.toggleButton = null;
    
    // Bind methods for event listeners
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  /**
   * Create and return the widget DOM element
   * @returns {HTMLElement}
   */
  render() {
    this.element = document.createElement('div');
    this.element.className = 'mood-selector';
    
    const currentMood = this.moodEngine.getCurrentConfig();
    
    this.element.innerHTML = `
      <button 
        class="mood-selector__toggle" 
        id="mood-toggle" 
        aria-label="Change mood"
        aria-expanded="false"
        aria-haspopup="true"
      >
        <span class="mood-selector__icon">${currentMood.icon}</span>
        <span class="mood-selector__label">${currentMood.name}</span>
      </button>
      
      <div 
        class="mood-selector__menu" 
        id="mood-menu"
        role="menu"
        aria-label="Mood selection menu"
      >
        <div class="mood-selector__menu-header">
          <span class="mood-selector__menu-title">Choose Your Vibe</span>
        </div>
        <div class="mood-selector__menu-options">
          ${this.renderMoodOptions()}
        </div>
      </div>
    `;
    
    this.toggleButton = this.element.querySelector('#mood-toggle');
    this.menuElement = this.element.querySelector('#mood-menu');
    
    // Event listeners
    this.toggleButton.addEventListener('click', () => this.toggle());
    
    // Add click handlers for each mood button
    const moodButtons = this.element.querySelectorAll('.mood-option');
    moodButtons.forEach(button => {
      button.addEventListener('click', () => {
        const moodId = button.dataset.mood;
        this.selectMood(moodId);
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', this.handleClickOutside);
    
    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeyDown);
    
    return this.element;
  }

  /**
   * Render mood option buttons
   * @returns {string} HTML string for mood options
   */
  renderMoodOptions() {
    const moods = this.moodEngine.getAvailableMoods();
    const currentMood = this.moodEngine.getCurrentMood();
    
    return moods.map(moodId => {
      const config = this.moodEngine.getMoodConfig(moodId);
      const isActive = moodId === currentMood;
      
      return `
        <button 
          class="mood-option ${isActive ? 'mood-option--active' : ''}"
          data-mood="${moodId}"
          role="menuitem"
          aria-label="Switch to ${config.name} mode"
          tabindex="${isActive ? '0' : '-1'}"
        >
          <span class="mood-option__icon">${config.icon}</span>
          <div class="mood-option__info">
            <span class="mood-option__name">${config.name}</span>
            <span class="mood-option__description">${config.description}</span>
          </div>
          ${isActive ? '<span class="mood-option__check">✓</span>' : ''}
        </button>
      `;
    }).join('');
  }

  /**
   * Toggle menu open/closed state
   */
  toggle() {
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      this.menuElement.classList.add('mood-selector__menu--open');
      this.toggleButton.setAttribute('aria-expanded', 'true');
      
      // Focus first menu item
      const firstOption = this.menuElement.querySelector('.mood-option');
      if (firstOption) {
        firstOption.focus();
      }
    } else {
      this.menuElement.classList.remove('mood-selector__menu--open');
      this.toggleButton.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * Close the menu
   */
  close() {
    if (this.isOpen) {
      this.isOpen = false;
      this.menuElement.classList.remove('mood-selector__menu--open');
      this.toggleButton.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * Handle click outside to close menu
   * @param {MouseEvent} event
   */
  handleClickOutside(event) {
    if (this.isOpen && this.element && !this.element.contains(event.target)) {
      this.close();
    }
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event
   */
  handleKeyDown(event) {
    if (!this.isOpen) return;
    
    const options = this.menuElement.querySelectorAll('.mood-option');
    const currentIndex = Array.from(options).findIndex(opt => opt === document.activeElement);
    
    switch (event.key) {
      case 'Escape':
        this.close();
        this.toggleButton.focus();
        break;
        
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < options.length - 1) {
          options[currentIndex + 1].focus();
        } else {
          options[0].focus();
        }
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          options[currentIndex - 1].focus();
        } else {
          options[options.length - 1].focus();
        }
        break;
        
      case 'Enter':
      case ' ':
        if (document.activeElement.classList.contains('mood-option')) {
          event.preventDefault();
          const moodId = document.activeElement.dataset.mood;
          this.selectMood(moodId);
        }
        break;
    }
  }

  /**
   * Select a mood and update UI
   * @param {string} moodId - The mood ID to switch to
   */
  async selectMood(moodId) {
    await this.moodEngine.setMood(moodId);
    
    // Update toggle button
    const config = this.moodEngine.getCurrentConfig();
    this.element.querySelector('.mood-selector__icon').textContent = config.icon;
    this.element.querySelector('.mood-selector__label').textContent = config.name;
    
    // Update active state on options
    const buttons = this.element.querySelectorAll('.mood-option');
    buttons.forEach(btn => {
      const isActive = btn.dataset.mood === moodId;
      btn.classList.toggle('mood-option--active', isActive);
      
      // Update checkmark
      const existingCheck = btn.querySelector('.mood-option__check');
      if (isActive && !existingCheck) {
        btn.insertAdjacentHTML('beforeend', '<span class="mood-option__check">✓</span>');
      } else if (!isActive && existingCheck) {
        existingCheck.remove();
      }
    });
    
    // Close menu after selection
    this.close();
  }

  /**
   * Cleanup when component is destroyed
   */
  destroy() {
    document.removeEventListener('click', this.handleClickOutside);
    document.removeEventListener('keydown', this.handleKeyDown);
    
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}

export default MoodSelector;
