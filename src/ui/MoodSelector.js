/**
 * Orbital Mood Selector
 * A sleek, vertical top-right control for mood switching.
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
    this.activeMood = null;
    this.isExpanded = false; // Default collapsed

    // Bind methods
    this.handleMoodSelect = this.handleMoodSelect.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
    this.collapse = this.collapse.bind(this); // Also bind collapse

    // Subscribe to state changes
    this.eventBus.on('mood-changed', (data) => {
      this.activeMood = data.mood;
      this.updateActiveState();
    });
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'mood-orbit';

    const moods = [
      { id: 'focused', icon: '🎯', label: 'Focused' },
      { id: 'feminine', icon: '✨', label: 'Feminine' },
      { id: 'energetic', icon: '🔥', label: 'Energetic' },
    ];

    const track = document.createElement('div');
    track.className = 'mood-orbit__track';

    // Glider background
    const glider = document.createElement('div');
    glider.className = 'mood-orbit__glider';
    track.appendChild(glider);

    // Current Mood Indicator (Visible when collapsed)
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'mood-orbit__toggle-btn';
    toggleBtn.innerHTML = '<span class="mood-orbit__toggle-icon"></span>'; // Placeholder, will update
    toggleBtn.onclick = this.toggleExpand;
    this.element.appendChild(toggleBtn);

    // Mood Items
    moods.forEach(mood => {
      const btn = document.createElement('button');
      btn.className = `mood-orbit__item ${mood.id === this.activeMood ? 'mood-orbit__item--active' : ''}`;
      btn.dataset.mood = mood.id;
      btn.setAttribute('aria-label', `Switch to ${mood.label} mood`);
      btn.setAttribute('role', 'tab'); // Add role for accessibility

      btn.innerHTML = `
        <span class="mood-orbit__icon">${mood.icon}</span>
        <span class="mood-orbit__tooltip">${mood.label}</span>
      `;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleMoodSelect(mood.id);
        this.collapse(); // Auto collapse on select
      });

      track.appendChild(btn);
    });

    this.element.appendChild(track);

    // Set initial active
    this.activeMood = this.moodEngine.getCurrentMood();
    this.updateActiveState();

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (this.element && !this.element.contains(e.target) && this.isExpanded) {
        this.collapse();
      }
    });

    // Keyboard navigation (re-added for the new structure)
    this.element.addEventListener('keydown', (e) => {
      const items = Array.from(this.element.querySelectorAll('.mood-orbit__item'));
      const currentIndex = items.indexOf(document.activeElement);

      let nextIndex = null;

      // Adjusted for Vertical Navigation
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % items.length;
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + items.length) % items.length;
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        document.activeElement.click();
      }

      if (nextIndex !== null) {
        // The original code had items[nextIndex].focus();
        // The provided snippet had `if (nextItem) nextItem.focus();` which implies `nextItem` should be defined.
        // To maintain syntactical correctness and avoid ReferenceError, we'll use `items[nextIndex].focus();`
        // as `nextItem` is not defined in the context of the provided snippet.
        items[nextIndex].focus();
      }
    });

    return this.element;
  }

  handleMoodSelect(moodId) {
    this.moodEngine.setMood(moodId);
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      this.element.classList.remove('mood-orbit--collapsed');
      this.element.classList.add('mood-orbit--expanded');
    } else {
      this.element.classList.add('mood-orbit--collapsed');
      this.element.classList.remove('mood-orbit--expanded');
    }
  }

  collapse() {
    this.isExpanded = false;
    this.element.classList.add('mood-orbit--collapsed');
    this.element.classList.remove('mood-orbit--expanded');
  }

  updateActiveState() {
    if (!this.element) return;

    // Update items
    const items = this.element.querySelectorAll('.mood-orbit__item');
    items.forEach(item => {
      const isMatch = item.dataset.mood === this.activeMood;
      item.classList.toggle('mood-orbit__item--active', isMatch);
      item.setAttribute('aria-selected', isMatch);

      if (isMatch) {
        // Update toggle button icon
        const iconEl = item.querySelector('.mood-orbit__icon');
        const toggleIconEl = this.element.querySelector('.mood-orbit__toggle-icon');
        if (iconEl && toggleIconEl) {
          toggleIconEl.textContent = iconEl.textContent;
        }
      }
    });

    // Move Glider
    this.moveGlider();
  }

  /**
   * Calculates position for the sliding background "glider"
   */
  moveGlider() { // Renamed from moveGliderToActive
    const activeItem = this.element.querySelector('.mood-orbit__item--active');
    const glider = this.element.querySelector('.mood-orbit__glider');

    if (activeItem && glider) {
      // Calculate position relative to the track parent
      const offsetTop = activeItem.offsetTop;
      const height = activeItem.offsetHeight;

      glider.style.transform = `translateY(${offsetTop}px)`;
      glider.style.height = `${height}px`;
    }
  }

  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}

export default MoodSelector;