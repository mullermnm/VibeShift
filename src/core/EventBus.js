/**
 * Event-driven communication system for decoupled components
 * Used for: MoodEngine → Widgets communication
 */
class EventBus {
  constructor() {
    this.events = {}; // { eventName: [callback1, callback2] }
  }

  /**
   * Subscribe to an event
   * @param {string} eventName - Event identifier
   * @param {Function} callback - Function to call when event fires
   * @returns {Function} Unsubscribe function
   */
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
    
    // Return unsubscribe function
    return () => this.off(eventName, callback);
  }

  /**
   * Unsubscribe from an event
   * @param {string} eventName - Event identifier
   * @param {Function} callback - Function to remove
   */
  off(eventName, callback) {
    if (!this.events[eventName]) return;
    this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
  }

  /**
   * Emit an event to all subscribers
   * @param {string} eventName - Event identifier
   * @param {*} data - Data to pass to callbacks
   */
  emit(eventName, data) {
    if (!this.events[eventName]) return;
    this.events[eventName].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`EventBus error in ${eventName}:`, error);
      }
    });
  }

  /**
   * Subscribe to an event only once
   * @param {string} eventName - Event identifier
   * @param {Function} callback - Function to call when event fires
   */
  once(eventName, callback) {
    const unsubscribe = this.on(eventName, (data) => {
      unsubscribe();
      callback(data);
    });
    return unsubscribe;
  }

  /**
   * Clear all event listeners (useful for cleanup)
   */
  clear() {
    this.events = {};
  }

  /**
   * Get count of listeners for an event
   * @param {string} eventName - Event identifier
   * @returns {number} Number of listeners
   */
  listenerCount(eventName) {
    return this.events[eventName]?.length || 0;
  }
}

export default EventBus;
