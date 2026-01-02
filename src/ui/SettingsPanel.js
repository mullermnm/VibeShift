/**
 * SettingsPanel Component
 * Handles extension configuration and background selection
 */
class SettingsPanel {
    constructor(moodEngine, backgroundManager) {
        this.moodEngine = moodEngine;
        this.backgroundManager = backgroundManager;
        this.isOpen = false;
        this.element = null;
    }

    init() {
        this.render();
        this.attachEventListeners();
        document.body.appendChild(this.element);
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'settings-panel';
        this.element.innerHTML = `
      <div class="settings-panel__overlay"></div>
      <div class="settings-panel__content">
        <header class="settings-panel__header">
          <h2>Settings</h2>
          <button class="settings-panel__close" aria-label="Close settings">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>
        
        <div class="settings-panel__body">
          <nav class="settings-panel__tabs">
            <button class="settings-tab active" data-tab="general">General</button>
            <button class="settings-tab" data-tab="backgrounds">Backgrounds</button>
            <button class="settings-tab" data-tab="about">About</button>
          </nav>
          
          <div class="settings-panel__view" id="view-general">
            <!-- General Settings -->
            <div class="setting-item">
              <label>Default Mood</label>
              <select id="setting-default-mood">
                <option value="focused">Focused</option>
                <option value="feminine">Feminine</option>
                <option value="energetic">Energetic</option>
                <option value="calm">Calm</option>
              </select>
            </div>
          </div>
          
          <div class="settings-panel__view hidden" id="view-backgrounds">
            <h3>Choose Background</h3>
            <p>Select a background for the current mood.</p>
            <div class="background-grid" id="background-grid">
               <!-- Background options injected here -->
            </div>
          </div>
          
          <div class="settings-panel__view hidden" id="view-about">
            <p>VibeShift v1.0.0</p>
          </div>
        </div>
      </div>
    `;
    }

    attachEventListeners() {
        const closeBtn = this.element.querySelector('.settings-panel__close');
        const overlay = this.element.querySelector('.settings-panel__overlay');

        closeBtn.addEventListener('click', () => this.toggle(false));
        overlay.addEventListener('click', () => this.toggle(false));

        // Tabs
        const tabs = this.element.querySelectorAll('.settings-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Deactivate all
                tabs.forEach(t => t.classList.remove('active'));
                this.element.querySelectorAll('.settings-panel__view').forEach(v => v.classList.add('hidden'));

                // Activate current
                tab.classList.add('active');
                const viewId = `view-${tab.dataset.tab}`;
                this.element.querySelector(`#${viewId}`).classList.remove('hidden');

                if (tab.dataset.tab === 'backgrounds') {
                    this.loadBackgroundOptions();
                }
            });
        });
    }

    toggle(forceState) {
        this.isOpen = forceState !== undefined ? forceState : !this.isOpen;
        this.element.classList.toggle('settings-panel--open', this.isOpen);

        if (this.isOpen) {
            this.loadValues();
        }
    }

    loadValues() {
        // Load current config into inputs
    }

    async loadBackgroundOptions() {
        const grid = this.element.querySelector('#background-grid');
        grid.innerHTML = '<div class="loader">Loading...</div>';

        // Temporary mock logic - this will be replaced by actual BackgroundManager calls later
        const currentMood = this.moodEngine.getCurrentMood();

        // We would fetch available options from config or API
        // For now, let's just show some placeholders
        const placeholders = [1, 2, 3, 4];

        grid.innerHTML = placeholders.map(i => `
      <div class="bg-option" data-id="${i}">
        <div class="bg-option__preview" style="background: #ccc;"></div>
        <span>Option ${i}</span>
      </div>
    `).join('');
    }
}

export default SettingsPanel;
