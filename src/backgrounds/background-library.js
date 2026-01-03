/**
 * VibeShift - Background Library
 * Curated background collections for each mood
 */

export const BACKGROUND_LIBRARY = {
  focused: [
    {
      id: 'library',
      name: 'Library Sanctuary',
      unsplashQuery: 'library books minimal',
      dominantColor: { h: 210, s: 30, l: 25 }
    },
    {
      id: 'mountains',
      name: 'Mountain Peak',
      unsplashQuery: 'mountain peak minimal fog',
      dominantColor: { h: 180, s: 15, l: 30 }
    },
    {
      id: 'workspace',
      name: 'Clean Workspace',
      unsplashQuery: 'minimal desk workspace',
      dominantColor: { h: 190, s: 25, l: 35 }
    },
    {
      id: 'forest-mist',
      name: 'Misty Forest',
      unsplashQuery: 'misty forest morning',
      dominantColor: { h: 145, s: 20, l: 35 }
    }
  ],
  
  feminine: [
    {
      id: 'blossoms',
      name: 'Cherry Blossoms',
      unsplashQuery: 'cherry blossom pink aesthetic',
      dominantColor: { h: 340, s: 75, l: 85 }
    },
    {
      id: 'sunset',
      name: 'Pastel Sunset',
      unsplashQuery: 'pastel sunset pink sky',
      dominantColor: { h: 350, s: 70, l: 80 }
    },
    {
      id: 'florals',
      name: 'Soft Florals',
      unsplashQuery: 'soft pink flowers aesthetic',
      dominantColor: { h: 345, s: 80, l: 88 }
    },
    {
      id: 'peonies',
      name: 'Peony Garden',
      unsplashQuery: 'peony flowers pink garden',
      dominantColor: { h: 338, s: 70, l: 88 }
    }
  ],
  
  energetic: [
    {
      id: 'neon-city',
      name: 'Neon Cityscape',
      unsplashQuery: 'neon city vibrant night',
      dominantColor: { h: 15, s: 90, l: 55 }
    },
    {
      id: 'sunset-waves',
      name: 'Electric Sunset',
      unsplashQuery: 'vibrant sunset colorful',
      dominantColor: { h: 0, s: 85, l: 60 }
    },
    {
      id: 'abstract',
      name: 'Abstract Energy',
      unsplashQuery: 'abstract colorful vibrant',
      dominantColor: { h: 265, s: 70, l: 65 }
    },
    {
      id: 'fire-sky',
      name: 'Fire Sky',
      unsplashQuery: 'dramatic sunset fire sky',
      dominantColor: { h: 10, s: 100, l: 55 }
    }
  ],
  
  calm: [
    {
      id: 'ocean',
      name: 'Peaceful Ocean',
      unsplashQuery: 'calm ocean waves peaceful',
      dominantColor: { h: 195, s: 60, l: 65 }
    },
    {
      id: 'forest',
      name: 'Misty Forest',
      unsplashQuery: 'misty forest peaceful green',
      dominantColor: { h: 155, s: 45, l: 55 }
    },
    {
      id: 'lake',
      name: 'Mountain Lake',
      unsplashQuery: 'calm lake mountain reflection',
      dominantColor: { h: 205, s: 55, l: 65 }
    },
    {
      id: 'zen-garden',
      name: 'Zen Garden',
      unsplashQuery: 'zen garden peaceful stones',
      dominantColor: { h: 170, s: 40, l: 60 }
    }
  ]
};

/**
 * Get backgrounds for a specific mood
 * @param {string} mood - Mood identifier
 * @returns {Array} Array of background objects
 */
export function getBackgroundsForMood(mood) {
  return BACKGROUND_LIBRARY[mood] || BACKGROUND_LIBRARY.focused;
}

/**
 * Get a specific background by ID
 * @param {string} mood - Mood identifier
 * @param {string} bgId - Background ID
 * @returns {Object|null} Background object or null
 */
export function getBackgroundById(mood, bgId) {
  const backgrounds = BACKGROUND_LIBRARY[mood];
  if (!backgrounds) return null;
  return backgrounds.find(bg => bg.id === bgId) || null;
}

/**
 * Get random background for a mood
 * @param {string} mood - Mood identifier
 * @returns {Object} Random background object
 */
export function getRandomBackground(mood) {
  const backgrounds = BACKGROUND_LIBRARY[mood] || BACKGROUND_LIBRARY.focused;
  const randomIndex = Math.floor(Math.random() * backgrounds.length);
  return backgrounds[randomIndex];
}

/**
 * Get the default (first) background for a mood
 * @param {string} mood - Mood identifier
 * @returns {Object} Default background object
 */
export function getDefaultBackground(mood) {
  const backgrounds = BACKGROUND_LIBRARY[mood] || BACKGROUND_LIBRARY.focused;
  return backgrounds[0];
}

export default BACKGROUND_LIBRARY;
