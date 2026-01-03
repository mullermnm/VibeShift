/**
 * Centralized mood configuration registry
 * Each mood defines its visual theme, widget visibility, animations, and quotes
 */

const MOOD_CONFIGS = {
  focused: {
    id: 'focused',
    name: 'Focused',
    icon: '🎯',
    description: 'Minimalist deep work mode',

    theme: {
      primaryColor: '#2D3748', // Slate 800
      secondaryColor: '#E2E8F0', // Slate 200
      accentColor: '#48BB78', // Green 500
      backgroundColor: '#FFFFFF',
      textColor: '#1A202C', // Gray 900
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      backgroundFilter: 'brightness(0.95) contrast(1.05)'
    },

    widgets: {
      SearchBar: { visible: true, layout: 'top-elegant' },
      Clock: { visible: false },
      QuoteCard: { visible: true, layout: 'bottom-subtle' },
      FocusTimer: { visible: false },
      BreathingGuide: { visible: false },
      NewsWidget: { visible: false },
      WeatherWidget: { visible: false },
      TaskList: { visible: false },
      ImageGallery: { visible: false },
      Dashboard: { visible: false },
      SoundPlayer: { visible: false }
    },

    animations: {
      enabled: false,
      type: null
    },

    background: {
      unsplashQuery: 'minimalist workspace architecture white',
      overlayOpacity: 0.1,
      blur: 0
    },

    quotes: {
      category: 'focus',
      pool: [
        'Deep work is the ability to focus without distraction.',
        'One hour of focused work beats ten hours of distraction.',
        'Clarity comes from eliminating the unnecessary.',
        'Focus is the art of saying no to the good to pursue the great.',
        'The successful warrior is the average man, with laser-like focus.',
        'Concentrate all your thoughts upon the work at hand.',
        'Where focus goes, energy flows.',
        'Simplicity is the ultimate sophistication.'
      ]
    }
  },

  feminine: {
    id: 'feminine',
    name: 'Feminine',
    icon: '✨',
    description: 'Aesthetic-driven nurturing mode',

    theme: {
      primaryColor: '#D6BCFA', // Purple 200
      secondaryColor: '#FFF5F7', // Pink 50
      accentColor: '#F687B3', // Pink 400
      backgroundColor: '#FAFAFA',
      textColor: '#702459', // Pink 900
      fontFamily: "'Playfair Display', Georgia, serif",
      backgroundFilter: 'brightness(1.05) saturate(1.1)'
    },

    widgets: {
      SearchBar: { visible: true, layout: 'top-elegant' },
      Clock: { visible: true, layout: 'top-left-elegant' },
      QuoteCard: { visible: true, layout: 'center-elegant' },
      FocusTimer: { visible: false },
      BreathingGuide: { visible: false },
      NewsWidget: { visible: false },
      WeatherWidget: { visible: true, layout: 'top-right-minimal' },
      TaskList: { visible: false },
      ImageGallery: { visible: true, layout: 'centered' },
      Dashboard: { visible: false },
      SoundPlayer: { visible: false }
    },

    animations: {
      enabled: true,
      type: 'petal',
      particleCount: 25,
      speed: 0.5,
      config: {
        colors: ['#F687B3', '#FBB6CE', '#D6BCFA', '#E9D8FD'],
        size: { min: 6, max: 14 },
        rotationSpeed: 1,
        opacity: { min: 0.4, max: 0.8 }
      }
    },

    background: {
      unsplashQuery: 'soft aesthetic flowers pastel sky',
      overlayOpacity: 0.2,
      blur: 2
    },

    quotes: {
      category: 'self-love',
      pool: [
        'You are worthy of all the love you give to others.',
        'Soft hearts are not weak; they are brave.',
        'You bloom in your own time, beautifully.',
        'Self-love is the foundation of all growth.',
        'Your gentle spirit is your superpower.',
        'You are enough, exactly as you are.',
        'Nurture yourself with the same kindness you give others.',
        'Grace and strength coexist within you.'
      ]
    }
  },

  energetic: {
    id: 'energetic',
    name: 'Energetic',
    icon: '🔥',
    description: 'Maximalist productivity hub',

    theme: {
      primaryColor: '#F6AD55', // Orange 400
      secondaryColor: '#2D3748', // Gray 800
      accentColor: '#63B3ED', // Blue 400
      backgroundColor: '#171923', // Gray 900
      textColor: '#FFFFFF',
      fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
      backgroundFilter: 'brightness(1.1) contrast(1.1)'
    },

    widgets: {
      SearchBar: { visible: true, layout: 'top-compact' },
      Clock: { visible: true, layout: 'top-left-bold' },
      QuoteCard: { visible: true, layout: 'top-bold' },
      FocusTimer: { visible: false },
      BreathingGuide: { visible: false },
      NewsWidget: { visible: false },
      WeatherWidget: { visible: true, layout: 'top-right-detailed' },
      TaskList: { visible: false },
      ImageGallery: { visible: false },
      Dashboard: { visible: true },
      SoundPlayer: { visible: false }
    },

    animations: {
      enabled: true,
      type: 'spark',
      particleCount: 40,
      speed: 1.2,
      config: {
        colors: ['#F6AD55', '#FBD38D', '#63B3ED', '#90CDF4'],
        size: { min: 3, max: 8 },
        shapes: ['triangle', 'square', 'circle'],
        movementPattern: 'diagonal-fast'
      }
    },

    background: {
      unsplashQuery: 'neon city cyber dark vibrant',
      overlayOpacity: 0.4,
      blur: 0
    },

    quotes: {
      category: 'motivation',
      pool: [
        'Your energy introduces you before you even speak.',
        'The only limit is the one you set for yourself.',
        'Massive action creates massive results.',
        'Hustle in silence, let success make the noise.',
        'You are unstoppable when you believe it.',
        'Champions are made when no one is watching.',
        'Turn your obstacles into opportunities.',
        'Success is not given, it is earned.'
      ]
    }
  },

  calm: {
    id: 'calm',
    name: 'Calm',
    icon: '🌿',
    description: 'Mental reset and meditation mode',

    theme: {
      primaryColor: '#81E6D9', // Teal 300
      secondaryColor: '#E6FFFA', // Teal 50
      accentColor: '#4FD1C5', // Teal 400
      backgroundColor: '#F0FFF4', // Green 50
      textColor: '#2C7A7B', // Teal 800
      fontFamily: "'Lora', Georgia, serif",
      backgroundFilter: 'brightness(1.0) saturate(0.9) blur(0px)'
    },

    widgets: {
      SearchBar: { visible: false },
      Clock: { visible: true, layout: 'top-center-minimal' },
      QuoteCard: { visible: true, layout: 'center-zen' },
      FocusTimer: { visible: false },
      BreathingGuide: { visible: true, layout: 'center-large' },
      NewsWidget: { visible: false },
      WeatherWidget: { visible: false },
      TaskList: { visible: false },
      ImageGallery: { visible: false },
      Dashboard: { visible: false },
      SoundPlayer: { visible: true }
    },

    animations: {
      enabled: true,
      type: 'bubble',
      particleCount: 15,
      speed: 0.2,
      config: {
        colors: ['#81E6D9', '#B2F5EA', '#E6FFFA'],
        size: { min: 20, max: 60 },
        opacity: { min: 0.2, max: 0.5 },
        movementPattern: 'slow-rise-wobble'
      }
    },

    background: {
      unsplashQuery: 'nature forest zen lake mist',
      overlayOpacity: 0.3,
      blur: 2
    },

    quotes: {
      category: 'peace',
      pool: [
        'Breathe in calm, breathe out chaos.',
        'Peace is not the absence of noise, but the presence of stillness within.',
        'You are exactly where you need to be right now.',
        'Slow down and everything you are chasing will come around.',
        'In stillness, you find your strength.',
        'Let go of what you cannot control.',
        'This moment is enough.',
        'Be gentle with yourself, you are doing your best.'
      ]
    }
  }
};

/**
 * Get configuration for a specific mood
 * @param {string} moodId - One of: focused, feminine, energetic, calm
 * @returns {Object|null} Mood configuration object
 */
export function getMoodConfig(moodId) {
  return MOOD_CONFIGS[moodId] || null;
}

/**
 * Get list of all available moods
 * @returns {Array<string>} Array of mood IDs
 */
export function getAllMoodIds() {
  return Object.keys(MOOD_CONFIGS);
}

/**
 * Validate if a mood ID exists
 * @param {string} moodId - Mood identifier
 * @returns {boolean}
 */
export function isValidMood(moodId) {
  return moodId in MOOD_CONFIGS;
}

/**
 * Register a custom mood (for plugin system)
 * @param {Object} customMoodConfig - Custom mood configuration
 * @returns {boolean} Success status
 */
export function registerCustomMood(customMoodConfig) {
  if (!customMoodConfig.id) {
    console.error('Custom mood must have an id property');
    return false;
  }

  if (MOOD_CONFIGS[customMoodConfig.id]) {
    console.warn(`Mood "${customMoodConfig.id}" already exists, overwriting...`);
  }

  MOOD_CONFIGS[customMoodConfig.id] = customMoodConfig;
  return true;
}

/**
 * Get all mood configurations
 * @returns {Object} All mood configs
 */
export function getAllMoodConfigs() {
  return { ...MOOD_CONFIGS };
}

export default MOOD_CONFIGS;
