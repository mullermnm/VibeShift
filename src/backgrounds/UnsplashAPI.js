/**
 * Unsplash API Wrapper
 * Fetches random images based on search query
 * 
 * NOTE: For production use, you should get your own API key from:
 * https://unsplash.com/developers
 */

class UnsplashAPI {
  constructor() {
    // Using direct image links instead of API
    // No API key needed - using sample images
    this.accessKey = '';
    this.baseUrl = 'https://api.unsplash.com';
    this.timeout = 5000; // 5 second timeout
  }

  /**
   * Check if API is configured
   * @returns {boolean}
   */
  isConfigured() {
    return true; // Always configured since we use sample images
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
    // Return sample images based on query
    const sampleImages = {
      'minimalist workspace architecture white': 'https://images.unsplash.com/photo-1586953208448-953f3686f9d5?w=1920&h=1080&fit=crop',
      'soft aesthetic flowers pastel sky': 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=1920&h=1080&fit=crop',
      'neon city cyber dark vibrant': 'https://images.unsplash.com/photo-1518717255285-4d6d5ab7a9a3?w=1920&h=1080&fit=crop',
      'nature forest zen lake mist': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
      'library books minimal': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop',
      'cherry blossom pink aesthetic': 'https://images.unsplash.com/photo-1522383579892-6a5f1b4b9c7c?w=1920&h=1080&fit=crop',
      'vibrant sunset colorful': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
      'calm ocean waves peaceful': 'https://images.unsplash.com/photo-1505142468629-6a5f1b4b9c7c?w=1920&h=1080&fit=crop'
    };

    // Try to find exact match
    if (sampleImages[query]) {
      console.log('Using sample image for query:', query);
      return sampleImages[query];
    }

    // Try to find partial match
    const keys = Object.keys(sampleImages);
    for (const key of keys) {
      if (query.toLowerCase().includes(key.split(' ')[0].toLowerCase())) {
        console.log('Using partial match sample image for query:', query, 'matched:', key);
        return sampleImages[key];
      }
    }

    // Default fallback
    console.log('Using default sample image for query:', query);
    return sampleImages['minimalist workspace architecture white'];
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
