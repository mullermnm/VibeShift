import BaseWidget from '../BaseWidget.js';

class ImageGallery extends BaseWidget {
    constructor(moodEngine, eventBus) {
        super(moodEngine, eventBus);
        this.id = 'image-gallery';
    }

    init() {
        this.element = document.createElement('div');
        this.element.className = 'widget image-gallery widget--hidden';
        this.element.innerHTML = `
      <div class="image-gallery__grid">
        <div class="image-gallery__item" style="background-color: #fce4ec"></div>
        <div class="image-gallery__item" style="background-color: #f8bbd0"></div>
        <div class="image-gallery__item" style="background-color: #f48fb1"></div>
        <div class="image-gallery__item" style="background-color: #f06292"></div>
        <div class="image-gallery__item image-gallery__item--large" style="background-color: #ec407a"></div>
      </div>
    `;
    }

    onMoodChange(newMood) {
        if (newMood === 'feminine') {
            this.show();
        } else {
            this.hide();
        }
    }
}

export default ImageGallery;
