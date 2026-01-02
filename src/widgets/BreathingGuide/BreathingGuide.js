/**
 * Breathing Guide Widget - 4-7-8 breathing exercise
 * Primary widget for Calm mode
 */
import BaseWidget from '../BaseWidget.js';

class BreathingGuide extends BaseWidget {
  constructor(moodEngine, eventBus) {
    super(moodEngine, eventBus);
    this.id = 'breathing-guide';

    this.isActive = false;
    this.currentPhase = 'idle';
    this.phaseTimer = null;
    this.countdownTimer = null;
    this.currentCount = 0;

    this.breathingPattern = {
      inhale: 4,
      hold: 7,
      exhale: 8
    };
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'breathing-guide glass';
    this.element.setAttribute('role', 'application');

    this.element.innerHTML = `
      <div class="breathing-guide__content">
        <div class="breathing-guide__circle-container">
           <svg class="breathing-guide__progress-ring" viewBox="0 0 120 120">
             <circle class="breathing-guide__progress-ring-bg" cx="60" cy="60" r="54" />
             <circle class="breathing-guide__progress-ring-fill" cx="60" cy="60" r="54" />
           </svg>
           
           <div class="breathing-guide__phases">
              <div class="phase-item" data-phase="inhale">
                <span class="phase-label">INHALE</span>
                <span class="phase-duration">for 4s</span>
                <div class="phase-bar"><div class="phase-progress"></div></div>
              </div>
              
              <div class="phase-item" data-phase="hold">
                <span class="phase-label">HOLD</span>
                <span class="phase-duration">for 7s</span>
                <div class="phase-count">7s</div>
              </div>
              
              <div class="phase-item" data-phase="exhale">
                <span class="phase-label">EXHALE</span>
                <span class="phase-duration">for 8s</span>
                <div class="phase-count">8s</div>
              </div>
           </div>
        </div>
        
        <button class="breathing-guide__start btn btn--primary">
          Start Breathing Exercise
        </button>
      </div>
    `;

    this.startButton = this.element.querySelector('.breathing-guide__start');
    this.progressRing = this.element.querySelector('.breathing-guide__progress-ring-fill');

    this.startButton.addEventListener('click', () => this.toggleExercise());

    this.updateVisibility(this.moodEngine.getCurrentConfig());

    return this.element;
  }

  toggleExercise() {
    if (this.isActive) {
      this.stopExercise();
    } else {
      this.startExercise();
    }
  }

  startExercise() {
    this.isActive = true;
    this.startButton.textContent = 'Stop Exercise';
    this.element.classList.add('breathing-guide--active');
    this.runBreathingCycle();
  }

  stopExercise() {
    this.isActive = false;
    this.currentPhase = 'idle';
    this.startButton.textContent = 'Start Breathing Exercise';
    this.element.classList.remove('breathing-guide--active');

    if (this.phaseTimer) clearTimeout(this.phaseTimer);
    if (this.countdownTimer) clearInterval(this.countdownTimer);

    // Reset UI
    const items = this.element.querySelectorAll('.phase-item');
    items.forEach(item => {
      item.classList.remove('phase-item--active');
      const bar = item.querySelector('.phase-progress');
      if (bar) bar.style.width = '0%';

      // Reset count text
      const count = item.querySelector('.phase-count');
      const durationText = item.querySelector('.phase-duration').textContent.replace('for ', '');
      if (count) count.textContent = durationText;
    });

    // Reset ring
    this.progressRing.style.transition = 'none';
    this.progressRing.style.strokeDashoffset = 54 * 2 * Math.PI;
  }

  runBreathingCycle() {
    if (!this.isActive) return;
    this.setPhase('inhale', this.breathingPattern.inhale, () => {
      this.setPhase('hold', this.breathingPattern.hold, () => {
        this.setPhase('exhale', this.breathingPattern.exhale, () => {
          this.runBreathingCycle();
        });
      });
    });
  }

  setPhase(phase, duration, callback) {
    if (!this.isActive) return;

    this.currentPhase = phase;
    this.currentCount = duration;

    // Update Active Class
    const items = this.element.querySelectorAll('.phase-item');
    items.forEach(item => {
      item.classList.toggle('phase-item--active', item.dataset.phase === phase);
      // Reset others
      if (item.dataset.phase !== phase) {
        const bar = item.querySelector('.phase-progress');
        if (bar) bar.style.width = '0%';
      }
    });

    // Ring Animation
    const circumference = 54 * 2 * Math.PI;
    // For ring, we just want a continuous rotation or fill? Mockup shows a static ring container. 
    // Let's make it fill up for the TOTAL cycle or just pulse?
    // Let's make it fill during INHALE, stay full during HOLD, empty during EXHALE.

    this.progressRing.style.transition = `stroke-dashoffset ${duration}s linear`;

    if (phase === 'inhale') {
      this.progressRing.style.strokeDashoffset = '0';
    } else if (phase === 'hold') {
      this.progressRing.style.strokeDashoffset = '0'; // Stay full
    } else if (phase === 'exhale') {
      this.progressRing.style.strokeDashoffset = circumference; // Empty out
    }

    // Bar Animation (Inhale only in mockup?)
    if (phase === 'inhale') {
      const bar = this.element.querySelector('.phase-item[data-phase="inhale"] .phase-progress');
      if (bar) {
        bar.style.transition = `width ${duration}s linear`;
        bar.style.width = '100%';
      }
    }

    // Countdown logic
    this.countdownTimer = setInterval(() => {
      this.currentCount--;
      if (this.currentCount > 0) {
        const activeItem = this.element.querySelector(`.phase-item[data-phase="${phase}"]`);
        const counter = activeItem.querySelector('.phase-count');
        if (counter) counter.textContent = `${this.currentCount}s`;
      }
    }, 1000);

    this.phaseTimer = setTimeout(() => {
      clearInterval(this.countdownTimer);
      callback();
    }, duration * 1000);
  }
}

export default BreathingGuide;
