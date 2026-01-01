/**
 * Breathing Guide Widget - 4-7-8 breathing exercise
 * Primary widget for Calm mode
 */
class BreathingGuide {
  /**
   * @param {MoodEngine} moodEngine - Reference to mood state manager
   * @param {EventBus} eventBus - Event bus for communication
   */
  constructor(moodEngine, eventBus) {
    this.moodEngine = moodEngine;
    this.eventBus = eventBus;
    this.element = null;
    this.circleElement = null;
    this.instructionElement = null;
    this.timerElement = null;
    
    this.isActive = false;
    this.currentPhase = 'idle'; // idle, inhale, hold, exhale
    this.phaseTimer = null;
    this.countdownTimer = null;
    this.currentCount = 0;
    
    // 4-7-8 breathing pattern (in seconds)
    this.breathingPattern = {
      inhale: 4,
      hold: 7,
      exhale: 8
    };
    
    // Listen for mood changes
    this.unsubscribe = this.eventBus.on('mood-changed', (data) => this.onMoodChange(data));
  }

  /**
   * Create and return the widget DOM element
   * @returns {HTMLElement}
   */
  render() {
    this.element = document.createElement('div');
    this.element.className = 'breathing-guide widget';
    this.element.setAttribute('role', 'application');
    this.element.setAttribute('aria-label', 'Breathing exercise guide');
    
    this.element.innerHTML = `
      <div class="breathing-guide__container">
        <div class="breathing-guide__circle">
          <div class="breathing-guide__inner-circle">
            <span class="breathing-guide__timer"></span>
          </div>
        </div>
        <p class="breathing-guide__instruction">Click to begin breathing exercise</p>
        <button class="breathing-guide__start" aria-label="Start breathing exercise">
          Start
        </button>
        <p class="breathing-guide__hint">4-7-8 Breathing Technique</p>
      </div>
    `;
    
    this.circleElement = this.element.querySelector('.breathing-guide__circle');
    this.instructionElement = this.element.querySelector('.breathing-guide__instruction');
    this.timerElement = this.element.querySelector('.breathing-guide__timer');
    this.startButton = this.element.querySelector('.breathing-guide__start');
    
    // Add click handler
    this.startButton.addEventListener('click', () => this.toggleExercise());
    this.circleElement.addEventListener('click', () => this.toggleExercise());
    
    // Apply initial mood
    const currentMood = this.moodEngine.getCurrentMood();
    this.updateLayout(currentMood);
    this.updateVisibility(this.moodEngine.getCurrentConfig());
    
    return this.element;
  }

  /**
   * Toggle the breathing exercise on/off
   */
  toggleExercise() {
    if (this.isActive) {
      this.stopExercise();
    } else {
      this.startExercise();
    }
  }

  /**
   * Start the breathing exercise
   */
  startExercise() {
    this.isActive = true;
    this.startButton.textContent = 'Stop';
    this.startButton.classList.add('breathing-guide__start--active');
    this.element.querySelector('.breathing-guide__hint').style.display = 'none';
    
    this.runBreathingCycle();
  }

  /**
   * Stop the breathing exercise
   */
  stopExercise() {
    this.isActive = false;
    this.currentPhase = 'idle';
    this.startButton.textContent = 'Start';
    this.startButton.classList.remove('breathing-guide__start--active');
    this.element.querySelector('.breathing-guide__hint').style.display = 'block';
    
    if (this.phaseTimer) {
      clearTimeout(this.phaseTimer);
      this.phaseTimer = null;
    }
    
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    
    this.circleElement.classList.remove('breathing-guide__circle--inhale', 'breathing-guide__circle--hold', 'breathing-guide__circle--exhale');
    this.instructionElement.textContent = 'Click to begin breathing exercise';
    this.timerElement.textContent = '';
  }

  /**
   * Run the breathing cycle (inhale -> hold -> exhale -> repeat)
   */
  runBreathingCycle() {
    if (!this.isActive) return;
    
    // Inhale phase
    this.setPhase('inhale', this.breathingPattern.inhale, () => {
      // Hold phase
      this.setPhase('hold', this.breathingPattern.hold, () => {
        // Exhale phase
        this.setPhase('exhale', this.breathingPattern.exhale, () => {
          // Repeat cycle
          this.runBreathingCycle();
        });
      });
    });
  }

  /**
   * Set the current breathing phase
   * @param {string} phase - Phase name (inhale, hold, exhale)
   * @param {number} duration - Duration in seconds
   * @param {Function} callback - Callback when phase completes
   */
  setPhase(phase, duration, callback) {
    if (!this.isActive) return;
    
    this.currentPhase = phase;
    this.currentCount = duration;
    
    // Update UI
    const instructions = {
      inhale: 'Breathe In',
      hold: 'Hold',
      exhale: 'Breathe Out'
    };
    
    this.instructionElement.textContent = instructions[phase];
    this.timerElement.textContent = duration;
    
    // Update circle animation class
    this.circleElement.classList.remove('breathing-guide__circle--inhale', 'breathing-guide__circle--hold', 'breathing-guide__circle--exhale');
    this.circleElement.classList.add(`breathing-guide__circle--${phase}`);
    
    // Set CSS custom property for animation duration
    this.circleElement.style.setProperty('--phase-duration', `${duration}s`);
    
    // Countdown timer
    this.countdownTimer = setInterval(() => {
      this.currentCount--;
      if (this.currentCount > 0) {
        this.timerElement.textContent = this.currentCount;
      }
    }, 1000);
    
    // Phase completion timer
    this.phaseTimer = setTimeout(() => {
      clearInterval(this.countdownTimer);
      callback();
    }, duration * 1000);
  }

  /**
   * Handle mood changes
   * @param {Object} data - Mood change event data
   */
  onMoodChange(data) {
    const { mood, config } = data;
    
    // Stop exercise if switching away from calm mode
    if (mood !== 'calm' && this.isActive) {
      this.stopExercise();
    }
    
    this.updateVisibility(config);
    this.updateLayout(mood);
  }

  /**
   * Update widget visibility based on mood config
   * @param {Object} config - Mood configuration
   */
  updateVisibility(config) {
    if (!this.element) return;
    
    const widgetConfig = config.widgets.BreathingGuide;
    
    if (!widgetConfig || !widgetConfig.visible) {
      this.element.classList.add('widget--hidden');
      this.element.classList.remove('widget--visible');
      
      // Stop exercise if hidden
      if (this.isActive) {
        this.stopExercise();
      }
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
    this.element.className = this.element.className.replace(/breathing-guide--\S+/g, '').trim();
    this.element.classList.add('breathing-guide', 'widget');
    
    // Add mood-specific layout class
    const config = this.moodEngine.getMoodConfig(mood);
    if (config && config.widgets.BreathingGuide && config.widgets.BreathingGuide.visible) {
      const layout = config.widgets.BreathingGuide.layout;
      if (layout) {
        this.element.classList.add(`breathing-guide--${layout}`);
      }
    }
  }

  /**
   * Cleanup when widget is destroyed
   */
  destroy() {
    this.stopExercise();
    
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}

export default BreathingGuide;
