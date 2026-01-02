/**
 * NavBar Component
 * Adaptive top navigation bar for VibeShift
 */
class NavBar {
  constructor(moodEngine, eventBus, settingsPanel) {
    this.moodEngine = moodEngine;
    this.eventBus = eventBus;
    this.settingsPanel = settingsPanel;
    this.element = null;
    this.moodSelector = null;
  }

  init() {
    this.element = document.createElement('nav');
    this.element = this.render(); // render now creates and returns the element
    this.attachEventListeners(); // This method will now be empty or removed, as event listeners are in render
    // Listen for mood changes to update layout
    this.eventBus.on('mood-changed', (data) => {
      this.updateForMood(data.mood);
    });
  }

  render() {
    this.element = document.createElement('nav');
    this.element.className = 'nav-bar';

    this.element.innerHTML = `
      <div class="nav-bar__container">
        <!-- Left: Controls -->
        <div class="nav-bar__left">
           <!-- Settings Toggle -->
          <button class="nav-bar__icon-btn" id="nav-settings-btn" aria-label="Settings">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
          
          <!-- Mood Selector Container -->
          <div class="nav-bar__mood-wrapper" id="nav-mood-container">
            <!-- MoodSelector injected here -->
          </div>
        </div>
        
        <!-- Right: Empty or Profile (Optional) -->
        <div class="nav-bar__right">
          <!-- Minimized profile or clock if needed -->
        </div>
      </div>
    `;

    // Bind Events
    this.element.querySelector('#nav-settings-btn').addEventListener('click', () => {
      this.settingsPanel.toggle();
    });

    return this.element;
  }

  attachEventListeners() {
    // Event listeners are now attached directly in the render method.
    // This method can be removed or left empty if no other listeners are needed here.
  }

  /**
   * Updates the navbar layout based on the current mood
   * @param {string} moodId 
   */
  updateForMood(moodId) {
    this.element.className = `nav-bar nav-bar--${moodId}`; // Updated class name
    this.updateTabs(moodId);
  }

  updateTabs(moodId) {
    const tabsContainer = this.element.querySelector('#navbar-tabs');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = ''; // Clear tabs

    if (moodId === 'calm' || moodId === 'energetic') {
      const tabs = [
        { label: 'Dashboard', active: true },
        { label: 'Moods', active: false },
        { label: 'Profile', active: false }
      ];

      tabs.forEach(tab => {
        const tabEl = document.createElement('div');
        tabEl.className = `navbar__tab ${tab.active ? 'navbar__tab--active' : ''}`;
        tabEl.textContent = tab.label;
        tabsContainer.appendChild(tabEl);
      });
    }
  }

  mount(container) {
    container.insertBefore(this.element, container.firstChild);

    // Initialize the external MoodSelector inside our navbar
    // We expect the main app to handle the actual MoodSelector instantiation 
    // and just append it here if needed, or we find a way to re-parent it.
    const moodSelectorContainer = this.element.querySelector('#nav-mood-container');
    return moodSelectorContainer;
  }
}

export default NavBar;
