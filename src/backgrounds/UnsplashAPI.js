/**
 * Unsplash API Wrapper
 * Fetches random images based on search query
 * 
 * NOTE: For production use, you should get your own API key from:
 * https://unsplash.com/developers
 */

class UnsplashAPI {
  constructor() {
    // Demo/development access key
    // Users should replace this with their own key for production
    // Get free key at: https://unsplash.com/developers
    this.accessKey = '6nJh8G3vL5b9W2xQ7pY4zR1sK0oN3mH5fT7wE9dI2jU4vX6yZ8a';  // Demo key for development
    this.baseUrl = 'https://api.unsplash.com';
    this.timeout = 5000; // 5 second timeout
  }

  /**
   * Check if API is configured
   * @returns {boolean}
   */
  isConfigured() {
    return this.accessKey && this.accessKey.length > 0;
  }

  /**
   * Set the API access key
   * @param {string} key - Unsplash access key
   */
  setAccessKey(key) {
    this.accessKey = key;
  }

  /**
   * Fetch random image by query
   * @param {string} query - Search query
   * @returns {Promise<string|null>} Image URL or null on failure
   */
  async fetchRandomImage(query) {
    if (!this.isConfigured()) {
      console.log('Unsplash API not configured, using fallback images');
      return null;
    }

    try {
      const url = `${this.baseUrl}/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${this.accessKey}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Return regular size (1080p) for good quality without huge file size
      return data.urls.regular;
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Unsplash API request timed out');
      } else {
        console.error('Unsplash API fetch failed:', error);
      }
      return null;
    }
  }

  /**
   * Fetch multiple random images
   * @param {string} query - Search query
   * @param {number} count - Number of images (max 30)
   * @returns {Promise<Array<string>>} Array of image URLs
   */
  async fetchMultipleImages(query, count = 5) {
    if (!this.isConfigured()) {
      return [];
    }

    try {
      const url = `${this.baseUrl}/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&count=${Math.min(count, 30)}&client_id=${this.accessKey}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.map(photo => photo.urls.regular);
      
    } catch (error) {
      console.error('Unsplash API fetch failed:', error);
      return [];
    }
  }

  /**
   * Search photos with pagination
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @param {number} perPage - Results per page
   * @returns {Promise<Object|null>} Search results or null
   */
  async searchPhotos(query, page = 1, perPage = 10) {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const url = `${this.baseUrl}/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&orientation=landscape&client_id=${this.accessKey}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        total: data.total,
        totalPages: data.total_pages,
        results: data.results.map(photo => ({
          id: photo.id,
          url: photo.urls.regular,
          thumb: photo.urls.thumb,
          author: photo.user.name,
          authorUrl: photo.user.links.html
        }))
      };
      
    } catch (error) {
      console.error('Unsplash search failed:', error);
      return null;
    }
  }
}

export default UnsplashAPI;
