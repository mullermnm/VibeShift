import BaseWidget from '../BaseWidget.js';

class Dashboard extends BaseWidget {
    constructor(moodEngine, eventBus) {
        super(moodEngine, eventBus);
        this.id = 'dashboard';
    }

    init() {
        this.element = document.createElement('div');
        this.element.className = 'dashboard-container widget--hidden';
        this.element.innerHTML = `
      <div class="dashboard-card card-news">
        <h3>Latest News</h3>
        <p>Tech Giants Post Record Earnings...</p>
      </div>
      <div class="dashboard-card card-tasks">
        <h3>My Tasks (5)</h3>
        <ul>
          <li>Finish Project Proposal</li>
          <li>Team Brainstorming</li>
        </ul>
      </div>
      <div class="dashboard-card card-stocks">
        <h3>Stocks</h3>
        <div class="stock-item">TSLA +2.5%</div>
        <div class="stock-item">AAPL +1.2%</div>
      </div>
      <div class="dashboard-card card-spotify">
        <h3>Spotify Player</h3>
        <div>Now Playing: Power Up - AC/DC</div>
      </div>
      <div class="dashboard-card card-fitness">
        <h3>Fitness</h3>
        <p>Steps: 8,500 / 10,000</p>
      </div>
    `;
    }

    onMoodChange(newMood) {
        if (newMood === 'energetic') {
            this.show();
        } else {
            this.hide();
        }
    }
}

export default Dashboard;
