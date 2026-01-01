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
      primaryColor: '#2C3E50',
      secondaryColor: '#ECF0F1',
      accentColor: '#3498DB',
      backgroundColor: '#FFFFFF',
      textColor: '#2C3E50',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      backgroundFilter: 'brightness(0.9) contrast(1.1)'
    },
    
    widgets: {
      SearchBar: { visible: true, layout: 'centered-large' },
      Clock: { visible: false },
      QuoteCard: { visible: true, layout: 'bottom-subtle' },
      FocusTimer: { visible: false },
      BreathingGuide: { visible: false },
      NewsWidget: { visible: false },
      WeatherWidget: { visible: false },
      TaskList: { visible: false }
    },
    
    animations: {
      enabled: false,
      type: null
    },
    
    background: {
      unsplashQuery: 'minimal workspace library',
      fallbackImage: 'focused.jpg',
      overlayOpacity: 0.2,
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
      primaryColor: '#FFB6C1',
      secondaryColor: '#FFF0F5',
      accentColor: '#FF69B4',
      backgroundColor: '#FFF5F8',
      textColor: '#8B5A6B',
      fontFamily: "'Playfair Display', Georgia, serif",
      backgroundFilter: 'brightness(1.1) saturate(1.3) contrast(0.95)'
    },
    
    widgets: {
      SearchBar: { visible: true, layout: 'top-elegant' },
      Clock: { visible: true, layout: 'top-left-elegant' },
      QuoteCard: { visible: true, layout: 'center-elegant' },
      FocusTimer: { visible: false },
      BreathingGuide: { visible: false },
      NewsWidget: { visible: false },
      WeatherWidget: { visible: true, layout: 'top-right-minimal' },
      TaskList: { visible: false }
    },
    
    animations: {
      enabled: true,
      type: 'petal',
      particleCount: 30,
      speed: 0.4,
      config: {
        colors: ['#FFB6C1', '#FFF0F5', '#FF69B4', '#FFC0CB'],
        size: { min: 8, max: 18 },
        rotationSpeed: 1.5,
        opacity: { min: 0.6, max: 0.9 }
      }
    },
    
    background: {
      unsplashQuery: 'feminine aesthetic pink flowers cherry blossom',
      fallbackImage: 'feminine.jpg',
      overlayOpacity: 0.4,
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
      primaryColor: '#FF6B35',
      secondaryColor: '#F7B801',
      accentColor: '#6A00F4',
      backgroundColor: '#1A1A2E',
      textColor: '#FFFFFF',
      fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
      backgroundFilter: 'brightness(1.2) saturate(1.5) contrast(1.1)'
    },
    
    widgets: {
      SearchBar: { visible: true, layout: 'top-compact' },
      Clock: { visible: true, layout: 'top-left-bold' },
      QuoteCard: { visible: true, layout: 'top-bold' },
      FocusTimer: { visible: false },
      BreathingGuide: { visible: false },
      NewsWidget: { visible: true, layout: 'right-sidebar' },
      WeatherWidget: { visible: true, layout: 'top-right-detailed' },
      TaskList: { visible: true, layout: 'left-sidebar' }
    },
    
    animations: {
      enabled: true,
      type: 'spark',
      particleCount: 50,
      speed: 1.5,
      config: {
        colors: ['#FF6B35', '#F7B801', '#6A00F4', '#00D9FF'],
        size: { min: 4, max: 12 },
        shapes: ['triangle', 'square', 'circle'],
        movementPattern: 'diagonal-fast'
      }
    },
    
    background: {
      unsplashQuery: 'vibrant energy neon cityscape',
      fallbackImage: 'energetic.jpg',
      overlayOpacity: 0.3,
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
    icon: '🌊',
    description: 'Mental reset and meditation mode',
    
    theme: {
      primaryColor: '#5DADE2',
      secondaryColor: '#AED6F1',
      accentColor: '#1ABC9C',
      backgroundColor: '#E8F8F5',
      textColor: '#21618C',
      fontFamily: "'Lora', Georgia, serif",
      backgroundFilter: 'brightness(1.0) saturate(0.8) contrast(0.9)'
    },
    
    widgets: {
      SearchBar: { visible: false },
      Clock: { visible: true, layout: 'top-center-minimal' },
      QuoteCard: { visible: true, layout: 'center-zen' },
      FocusTimer: { visible: false },
      BreathingGuide: { visible: true, layout: 'center-large' },
      NewsWidget: { visible: false },
      WeatherWidget: { visible: false },
      TaskList: { visible: false }
    },
    
    animations: {
      enabled: true,
      type: 'bubble',
      particleCount: 20,
      speed: 0.3,
      config: {
        colors: ['#5DADE2', '#AED6F1', '#1ABC9C', '#85C1E9'],
        size: { min: 15, max: 40 },
        opacity: { min: 0.3, max: 0.6 },
        movementPattern: 'slow-rise-wobble'
      }
    },
    
    background: {
      unsplashQuery: 'calm ocean forest nature peaceful',
      fallbackImage: 'calm.jpg',
      overlayOpacity: 0.5,
      blur: 3
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
