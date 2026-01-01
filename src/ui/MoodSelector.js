/**
 * Mood Selector Dock - Apple-style floating mood switcher
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
  }

  /**
   * Create and return the widget DOM element
   * @returns {HTMLElement}
   */
  render() {
    this.element = document.createElement('div');
    this.element.className = 'mood-selector-dock';
    
    const moods = this.moodEngine.getAvailableMoods();
    const currentMood = this.moodEngine.getCurrentMood();
    
    this.element.innerHTML = `
      <div class="mood-selector-dock__track" role="tablist" aria-label="Mood selection">
        ${moods.map(moodId => {
          const config = this.moodEngine.getMoodConfig(moodId);
          const isActive = moodId === currentMood;
          
          return `
            <button 
              class="mood-selector-dock__item ${isActive ? 'mood-selector-dock__item--active' : ''}"
              data-mood="${moodId}"
              role="tab"
              aria-selected="${isActive}"
              aria-label="Switch to ${config.name} mode"
              title="${config.name}"
            >
              <span class="mood-selector-dock__icon">${config.icon}</span>
              <span class="mood-selector-dock__label">${config.name}</span>
              <div class="mood-selector-dock__indicator"></div>
            </button>
          `;
        }).join('')}
      </div>
    `;
    
    this.attachEventListeners();
    
    return this.element;
  }

  /**
   * Attach event listeners to dock items
   */
  attachEventListeners() {
    const items = this.element.querySelectorAll('.mood-selector-dock__item');
    
    items.forEach(item => {
      // Click to switch mood
      item.addEventListener('click', async () => {
        const moodId = item.dataset.mood;
        await this.moodEngine.setMood(moodId);
        this.updateActiveState(moodId);
      });
      
      // Hover effect with scale
      item.addEventListener('mouseenter', () => {
        if (!item.classList.contains('mood-selector-dock__item--active')) {
          item.style.transform = 'scale(1.15) translateY(-8px)';
        }
      });
      
      item.addEventListener('mouseleave', () => {
        if (!item.classList.contains('mood-selector-dock__item--active')) {
          item.style.transform = '';
        }
      });
    });

    // Keyboard navigation
    this.element.addEventListener('keydown', (e) => {
      const items = Array.from(this.element.querySelectorAll('.mood-selector-dock__item'));
      const currentIndex = items.indexOf(document.activeElement);
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        items[nextIndex].focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        items[prevIndex].focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        document.activeElement.click();
      }
    });
  }

  /**
   * Update active state on all items
   * @param {string} activeMoodId - The active mood ID
   */
  updateActiveState(activeMoodId) {
    const items = this.element.querySelectorAll('.mood-selector-dock__item');
    
    items.forEach(item => {
      const isActive = item.dataset.mood === activeMoodId;
      item.classList.toggle('mood-selector-dock__item--active', isActive);
      item.setAttribute('aria-selected', isActive);
      
      // Update transform
      if (isActive) {
        item.style.transform = 'scale(1.15) translateY(-8px)';
      } else {
        item.style.transform = '';
      }
    });
  }

  /**
   * Cleanup when component is destroyed
   */
  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}

export default MoodSelector;
