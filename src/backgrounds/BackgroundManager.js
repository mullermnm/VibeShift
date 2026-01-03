/**
 * Background Manager - Handles background image loading
 * Features: Caching, fallbacks, smooth transitions
 */

import UnsplashAPI from './UnsplashAPI.js';

class BackgroundManager {
  /**
   * @param {StorageManager} storageManager - Storage manager for caching
   */
  constructor(storageManager) {
    this.storageManager = storageManager;
    this.unsplash = new UnsplashAPI();
    this.backgroundElement = document.getElementById('background-layer');
    this.currentMood = null;

    console.log('BackgroundManager initialized, background element:', this.backgroundElement);

    // Cache duration: 24 hours
    this.CACHE_DURATION = 24 * 60 * 60 * 1000;
  }

  /**
   * Load background for a mood
   * @param {Object} moodConfig - Mood configuration
   */
  async loadBackground(moodConfig) {
    const mood = moodConfig.id;
    console.log('loadBackground called for mood:', mood);
    console.log('moodConfig:', moodConfig);

    // Check if same mood (avoid unnecessary reload)
    if (this.currentMood === mood) {
      console.log('Same mood, skipping reload');
      return;
    }

    this.currentMood = mood;
    const bgConfig = moodConfig.background;
    console.log('bgConfig:', bgConfig);

    // Check for user preference
    const preferredUrl = await this.getPreferredBackground(mood);
    if (preferredUrl) {
      console.log('Using preferred background:', preferredUrl);
      await this.setBackground(preferredUrl, bgConfig);
      return;
    }

    // Try to load from cache first
    const cachedUrl = await this.getCachedBackground(mood);

    if (cachedUrl) {
      console.log('Using cached background:', cachedUrl);
      await this.setBackground(cachedUrl, bgConfig);
      return;
    }

    // Try to fetch sample image
    try {
      console.log('Fetching sample image for query:', bgConfig.unsplashQuery);
      console.log('Mood:', mood);
      
      const imageUrl = await this.unsplash.fetchRandomImage(bgConfig.unsplashQuery);

      if (imageUrl) {
        console.log('✅ Successfully fetched sample image:', imageUrl);
        await this.setBackground(imageUrl, bgConfig);
        await this.cacheBackground(mood, imageUrl);
        return;
      } else {
        console.log('❌ No sample image found for query:', bgConfig.unsplashQuery);
      }
    } catch (error) {
      console.warn('❌ Failed to fetch sample image:', error);
    }

    console.log('⚠️ Falling back to transparent background');
    this.setFallbackGradient(bgConfig);
  }

  /**
   * Get preferred background for mood
   * @param {string} mood - Mood ID
   * @returns {Promise<string|null>} Preferred URL
   */
  async getPreferredBackground(mood) {
    const prefs = await this.storageManager.load('user_preferences', {});
    return prefs[`bg_${mood}`] || null;
  }

  /**
   * Set preferred background for mood
   * @param {string} mood - Mood ID
   * @param {string} url - Image URL
   */
  async setPreferredBackground(mood, url) {
    const prefs = await this.storageManager.load('user_preferences', {});
    prefs[`bg_${mood}`] = url;
    await this.storageManager.save('user_preferences', prefs);
  }


  /**
   * Set background image with smooth transition
   * @param {string} imageUrl - URL of the image
   * @param {Object} config - Background config
   */
  async setBackground(imageUrl, config) {
    if (!this.backgroundElement) return;

    console.log('Setting background image:', imageUrl);

    // Preload image
    const img = new Image();
    img.src = imageUrl;

    try {
      await this.waitForImageLoad(img);
      console.log('Image loaded successfully');

      // Fade out current background
      this.backgroundElement.style.opacity = '0';

      // Wait for fade transition
      await this.sleep(300);

      // Set new background
      this.backgroundElement.style.backgroundImage = `url('${imageUrl}')`;
      this.applyBackgroundFilters(config);

      // Fade in
      this.backgroundElement.style.opacity = '1';
      console.log('Background image set successfully');

    } catch (error) {
      console.error('Failed to load background image:', error);
      this.setFallbackGradient(config);
    }
  }

  /**
   * Set fallback gradient background
   * @param {Object} config - Background config
   */
  setFallbackGradient(config) {
    console.log('⚠️ Setting fallback transparent background');
    if (!this.backgroundElement) {
      console.log('❌ No background element found');
      return;
    }

    // Use transparent fallback - no gradient
    this.backgroundElement.style.backgroundImage = 'none';
    this.applyBackgroundFilters(config);
    this.backgroundElement.style.opacity = '1';
    console.log('✅ Fallback background set');
  }

  /**
   * Apply CSS filters from mood config
   * @param {Object} config - Background config
   */
  applyBackgroundFilters(config) {
    if (!this.backgroundElement) return;

    // No filters for natural images
    this.backgroundElement.style.filter = 'none';

    // Update CSS custom property for overlay
    document.documentElement.style.setProperty('--background-overlay-opacity', config.overlayOpacity || 0.2);
  }

  /**
   * Get cached background URL
   * @param {string} mood - Mood ID
   * @returns {Promise<string|null>} Cached URL or null
   */
  async getCachedBackground(mood) {
    try {
      const cache = await this.storageManager.loadLocal('backgroundCache', {});
      const cached = cache[mood];

      if (!cached) return null;

      // Check if cache is expired
      const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
      if (isExpired) return null;

      return cached.url;
    } catch (error) {
      console.warn('Failed to get cached background:', error);
      return null;
    }
  }

  /**
   * Cache background URL
   * @param {string} mood - Mood ID
   * @param {string} url - Image URL
   */
  async cacheBackground(mood, url) {
    try {
      const cache = await this.storageManager.loadLocal('backgroundCache', {});
      cache[mood] = {
        url: url,
        timestamp: Date.now()
      };
      await this.storageManager.saveLocal('backgroundCache', cache);
    } catch (error) {
      console.warn('Failed to cache background:', error);
    }
  }

  /**
   * Clear background cache
   */
  async clearCache() {
    try {
      await this.storageManager.saveLocal('backgroundCache', {});
    } catch (error) {
      console.warn('Failed to clear background cache:', error);
    }
  }

  /**
   * Force refresh background (ignore cache)
   * @param {Object} moodConfig - Mood configuration
   */
  async refreshBackground(moodConfig) {
    this.currentMood = null; // Reset to force reload
    await this.loadBackground(moodConfig);
  }

  /**
   * Helper: Wait for image to load
   * @param {HTMLImageElement} img - Image element
   * @returns {Promise}
   */
  waitForImageLoad(img) {
    return new Promise((resolve, reject) => {
      if (img.complete) {
        resolve();
      } else {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Image load failed'));

        // Timeout after 10 seconds
        setTimeout(() => reject(new Error('Image load timeout')), 10000);
      }
    });
  }

  /**
   * Helper: Sleep utility
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default BackgroundManager;
