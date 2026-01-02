/**
 * Base Widget Class
 * All widgets should inherit from this to ensure consistent behavior
 */
class BaseWidget {
    /**
     * @param {MoodEngine} moodEngine - Reference to the mood engine
     * @param {EventBus} eventBus - Reference to the event bus
     */
    constructor(moodEngine, eventBus) {
        this.moodEngine = moodEngine;
        this.eventBus = eventBus;
        this.element = null;
        this.id = 'base-widget';

        // Bind methods
        this.onMoodChange = this.onMoodChange.bind(this);

        // Subscribe to mood changes
        if (this.eventBus) {
            this.eventBus.on('mood-changed', this.onMoodChange);
        }
    }

    /**
     * Initialize and render the widget
     * @returns {HTMLElement} The widget's DOM element
     */
    render() {
        this.init();
        return this.element;
    }

    /**
     * Initialize the widget element (Override this)
     */
    init() {
        this.element = document.createElement('div');
        this.element.className = 'widget';
    }

    /**
     * Handle mood changes (Override this)
     * @param {Object} data - Mood change data
     */
    onMoodChange(data) {
        // Default behavior: check visibility in config
        const config = typeof data === 'string' ? this.moodEngine.getMoodConfig(data) : data.config;
        if (config) {
            this.updateVisibility(config);
        }
    }

    /**
     * Update visibility based on config
     * @param {Object} config - Mood configuration
     */
    updateVisibility(config) {
        if (!this.element) return;

        // Derive widget name from class name or id
        const widgetName = this.constructor.name;
        const widgetConfig = config.widgets[widgetName];

        if (widgetConfig && widgetConfig.visible) {
            this.show();
            if (widgetConfig.layout) {
                this.element.setAttribute('data-layout', widgetConfig.layout);
            }
        } else {
            this.hide();
        }
    }

    /**
     * Show the widget
     */
    show() {
        if (this.element) {
            this.element.classList.remove('widget--hidden');
            this.element.classList.add('widget--visible');
        }
    }

    /**
     * Hide the widget
     */
    hide() {
        if (this.element) {
            this.element.classList.remove('widget--visible');
            this.element.classList.add('widget--hidden');
        }
    }

    /**
     * Clean up
     */
    destroy() {
        if (this.element) {
            this.element.remove();
        }
    }
}

export default BaseWidget;
