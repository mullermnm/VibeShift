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
    
    // Cache duration: 24 hours
    this.CACHE_DURATION = 24 * 60 * 60 * 1000;
  }

  /**
   * Load background for a mood
   * @param {Object} moodConfig - Mood configuration
   */
  async loadBackground(moodConfig) {
    const mood = moodConfig.id;
    
    // Check if same mood (avoid unnecessary reload)
    if (this.currentMood === mood) {
      return;
    }
    
    this.currentMood = mood;
    const bgConfig = moodConfig.background;
    
    // Try to load from cache first
    const cachedUrl = await this.getCachedBackground(mood);
    
    if (cachedUrl) {
      await this.setBackground(cachedUrl, bgConfig);
      return;
    }
    
    // Try to fetch from Unsplash
    try {
      const imageUrl = await this.unsplash.fetchRandomImage(bgConfig.unsplashQuery);
      
      if (imageUrl) {
        await this.setBackground(imageUrl, bgConfig);
        await this.cacheBackground(mood, imageUrl);
        return;
      }
    } catch (error) {
      console.warn('Failed to fetch from Unsplash, using fallback:', error);
    }
    
    // Fallback to local image
    this.setFallbackBackground(bgConfig.fallbackImage, bgConfig);
  }

  /**
   * Set background image with smooth transition
   * @param {string} imageUrl - URL of the image
   * @param {Object} config - Background config
   */
  async setBackground(imageUrl, config) {
    if (!this.backgroundElement) return;
    
    // Preload image
    const img = new Image();
    img.src = imageUrl;
    
    try {
      await this.waitForImageLoad(img);
      
      // Fade out current background
      this.backgroundElement.style.opacity = '0';
      
      // Wait for fade transition
      await this.sleep(300);
      
      // Set new background
      this.backgroundElement.style.backgroundImage = `url('${imageUrl}')`;
      this.applyBackgroundFilters(config);
      
      // Fade in
      this.backgroundElement.style.opacity = '1';
      
    } catch (error) {
      console.error('Failed to load background image:', error);
      this.setFallbackBackground(config.fallbackImage, config);
    }
  }

  /**
   * Set fallback background (local image or gradient)
   * @param {string} fallbackImage - Fallback image filename
   * @param {Object} config - Background config
   */
  setFallbackBackground(fallbackImage, config) {
    if (!this.backgroundElement) return;
    
    // Use gradient as ultimate fallback
    const gradients = {
      'focused.jpg': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'feminine.jpg': 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 50%, #FFC0CB 100%)',
      'energetic.jpg': 'linear-gradient(135deg, #FF6B35 0%, #F7B801 50%, #6A00F4 100%)',
      'calm.jpg': 'linear-gradient(135deg, #5DADE2 0%, #1ABC9C 50%, #85C1E9 100%)'
    };
    
    const gradient = gradients[fallbackImage] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
    // Try local image first, fallback to gradient
    const localUrl = `backgrounds/fallback/${fallbackImage}`;
    const img = new Image();
    
    img.onload = () => {
      this.backgroundElement.style.backgroundImage = `url('${localUrl}')`;
      this.applyBackgroundFilters(config);
      this.backgroundElement.style.opacity = '1';
    };
    
    img.onerror = () => {
      // Use gradient as fallback
      this.backgroundElement.style.backgroundImage = gradient;
      this.applyBackgroundFilters(config);
      this.backgroundElement.style.opacity = '1';
    };
    
    img.src = localUrl;
  }

  /**
   * Apply CSS filters from mood config
   * @param {Object} config - Background config
   */
  applyBackgroundFilters(config) {
    if (!this.backgroundElement) return;
    
    const filters = [];
    
    if (config.blur && config.blur > 0) {
      filters.push(`blur(${config.blur}px)`);
    }
    
    this.backgroundElement.style.filter = filters.length > 0 ? filters.join(' ') : 'none';
    
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
