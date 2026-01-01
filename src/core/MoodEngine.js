import { getMoodConfig, isValidMood, getAllMoodIds } from '../moods/mood-config.js';

/**
 * Central mood state manager - the brain of VibeShift
 * Responsibilities:
 * 1. Track current mood state
 * 2. Persist mood to chrome.storage.sync
 * 3. Emit mood change events via EventBus
 * 4. Validate mood transitions
 */
class MoodEngine {
  /**
   * @param {EventBus} eventBus - Event bus for pub/sub communication
   * @param {StorageManager} storageManager - Storage manager for persistence
   */
  constructor(eventBus, storageManager) {
    this.eventBus = eventBus;
    this.storageManager = storageManager;
    this.currentMood = null;
    this.previousMood = null;
    this.isInitialized = false;
    this.DEFAULT_MOOD = 'focused';
  }

  /**
   * Initialize the engine - loads saved mood or defaults to 'focused'
   * MUST be called before any other methods
   * @returns {Promise<void>}
   */
  async init() {
    if (this.isInitialized) {
      console.warn('MoodEngine already initialized');
      return;
    }

    // Load last saved mood
    const savedMood = await this.storageManager.load('currentMood', this.DEFAULT_MOOD);
    
    // Validate saved mood exists
    if (!isValidMood(savedMood)) {
      console.warn(`Invalid saved mood "${savedMood}", defaulting to ${this.DEFAULT_MOOD}`);
      this.currentMood = this.DEFAULT_MOOD;
    } else {
      this.currentMood = savedMood;
    }

    this.isInitialized = true;
    console.log(`MoodEngine initialized with mood: ${this.currentMood}`);
    
    // Emit initial mood so widgets can render
    this.eventBus.emit('mood-changed', {
      mood: this.currentMood,
      config: this.getCurrentConfig(),
      isInitial: true
    });
  }

  /**
   * Get current active mood ID
   * @returns {string|null}
   */
  getCurrentMood() {
    return this.currentMood;
  }

  /**
   * Get previous mood ID (before last transition)
   * @returns {string|null}
   */
  getPreviousMood() {
    return this.previousMood;
  }

  /**
   * Get current mood configuration object
   * @returns {Object|null}
   */
  getCurrentConfig() {
    return getMoodConfig(this.currentMood);
  }

  /**
   * Change to a new mood
   * @param {string} newMoodId - Target mood ID
   * @returns {Promise<boolean>} Success status
   */
  async setMood(newMoodId) {
    // Validation
    if (!isValidMood(newMoodId)) {
      console.error(`Invalid mood: "${newMoodId}"`);
      return false;
    }

    if (newMoodId === this.currentMood) {
      console.log(`Already in ${newMoodId} mood`);
      return true;
    }

    // State transition
    this.previousMood = this.currentMood;
    this.currentMood = newMoodId;

    // Persist to storage
    const saved = await this.storageManager.save('currentMood', newMoodId);
    
    if (!saved) {
      console.error('Failed to save mood to storage, continuing anyway');
    }

    // Notify all listeners
    this.eventBus.emit('mood-changed', {
      mood: newMoodId,
      previousMood: this.previousMood,
      config: this.getCurrentConfig(),
      isInitial: false
    });

    console.log(`Mood changed: ${this.previousMood} → ${newMoodId}`);
    return true;
  }

  /**
   * Get all available mood IDs
   * @returns {Array<string>}
   */
  getAvailableMoods() {
    return getAllMoodIds();
  }

  /**
   * Get configuration for any mood (not just current)
   * @param {string} moodId - Mood identifier
   * @returns {Object|null}
   */
  getMoodConfig(moodId) {
    return getMoodConfig(moodId);
  }

  /**
   * Check if engine is initialized
   * @returns {boolean}
   */
  isReady() {
    return this.isInitialized;
  }

  /**
   * Reset to default mood
   * @returns {Promise<boolean>}
   */
  async reset() {
    return this.setMood(this.DEFAULT_MOOD);
  }

  /**
   * Go back to previous mood (if available)
   * @returns {Promise<boolean>}
   */
  async goBack() {
    if (!this.previousMood) {
      console.warn('No previous mood to go back to');
      return false;
    }
    return this.setMood(this.previousMood);
  }
}

export default MoodEngine;
