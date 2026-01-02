import BaseWidget from '../BaseWidget.js';

class SoundPlayer extends BaseWidget {
  constructor(moodEngine, eventBus) {
    super(moodEngine, eventBus);
    this.id = 'sound-player';
    this.isPlaying = false;
  }

  init() {
    this.element = document.createElement('div');
    this.element.className = 'sound-player widget--hidden';

    this.element.innerHTML = `
      <div class="sound-player__card glass">
        <div class="sound-player__top-row">
           <button class="sound-player__play-btn">
             <span class="icon-play">▶</span>
             <span class="icon-pause" style="display:none;">⏸</span>
           </button>
           <h3 class="sound-player__title">Serene Sounds</h3>
           
           <div class="sound-player__volume">
             <span class="volume-icon-low">🔈</span>
             <input type="range" min="0" max="100" value="70" class="volume-slider">
             <span class="volume-icon-high">🔊</span>
           </div>
        </div>
        
        <div class="sound-player__info">
           <div class="sound-player__track-name">Forest Rain & Ocean Waves - Ambient Mix</div>
           
           <!-- Waveform Graphic Placeholder -->
           <div class="sound-player__waveform">
              <div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div>
              <div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div>
              <div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div>
              <div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div>
              <div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div>
              <div class="sound-player__time">15:30 / 60:00</div>
           </div>
        </div>
        
        <button class="sound-player__change-btn btn">Change Soundscape</button>
      </div>
    `;

    this.playBtn = this.element.querySelector('.sound-player__play-btn');
    this.playBtn.addEventListener('click', () => this.togglePlay());

    // Initial State
    this.onMoodChange(this.moodEngine.getCurrentMood());
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    const playIcon = this.element.querySelector('.icon-play');
    const pauseIcon = this.element.querySelector('.icon-pause');

    if (this.isPlaying) {
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'inline';
      this.element.classList.add('playing');
    } else {
      playIcon.style.display = 'inline';
      pauseIcon.style.display = 'none';
      this.element.classList.remove('playing');
    }
  }

  onMoodChange(newMood) {
    if (newMood === 'calm') {
      this.show();
    } else {
      this.hide();
    }
  }
}

export default SoundPlayer;
