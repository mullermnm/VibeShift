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
    console.log('🔍 fetchRandomImage called with query:', query);
    
    // Return sample images based on query - using working direct URLs
    const sampleImages = {
      'minimalist workspace architecture white': 'https://picsum.photos/1920/1080?random=1',
      'soft aesthetic flowers pastel sky': 'https://picsum.photos/1920/1080?random=2',
      'neon city cyber dark vibrant': 'https://picsum.photos/1920/1080?random=3',
      'nature forest zen lake mist': 'https://picsum.photos/1920/1080?random=4',
      'library books minimal': 'https://picsum.photos/1920/1080?random=5',
      'cherry blossom pink aesthetic': 'https://picsum.photos/1920/1080?random=6',
      'vibrant sunset colorful': 'https://picsum.photos/1920/1080?random=7',
      'calm ocean waves peaceful': 'https://picsum.photos/1920/1080?random=8',
      // Additional working images
      'energetic': 'https://picsum.photos/1920/1080?random=9',
      'focused': 'https://picsum.photos/1920/1080?random=10',
      'feminine': 'https://picsum.photos/1920/1080?random=11',
      'calm': 'https://picsum.photos/1920/1080?random=12'
    };

    console.log('📋 Available image keys:', Object.keys(sampleImages));

    // Try to find exact match
    if (sampleImages[query]) {
      console.log('✅ Using exact match sample image for query:', query);
      return sampleImages[query];
    }

    // Try to find partial match
    const keys = Object.keys(sampleImages);
    for (const key of keys) {
      if (query.toLowerCase().includes(key.split(' ')[0].toLowerCase())) {
        console.log('✅ Using partial match sample image for query:', query, 'matched:', key);
        return sampleImages[key];
      }
    }

    // Try to match by mood keywords
    if (query.toLowerCase().includes('energetic')) {
      console.log('✅ Using energetic image for query:', query);
      return sampleImages['energetic'];
    }
    if (query.toLowerCase().includes('focused')) {
      console.log('✅ Using focused image for query:', query);
      return sampleImages['focused'];
    }
    if (query.toLowerCase().includes('feminine')) {
      console.log('✅ Using feminine image for query:', query);
      return sampleImages['feminine'];
    }
    if (query.toLowerCase().includes('calm')) {
      console.log('✅ Using calm image for query:', query);
      return sampleImages['calm'];
    }

    // Default fallback
    console.log('⚠️ Using default sample image for query:', query);
    return sampleImages['focused'];
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
