/**
 * VibeShift - Quote Database
 * Categorized quotes for each mood
 */

export const QUOTE_DATABASE = {
  focused: [
    { text: 'Deep work is the ability to focus without distraction on a cognitively demanding task.', author: 'Cal Newport' },
    { text: 'Discipline is choosing between what you want now and what you want most.', author: 'Abraham Lincoln' },
    { text: 'One hour of focused work beats ten hours of distraction.', author: 'Robin Sharma' },
    { text: 'The successful warrior is the average man, with laser-like focus.', author: 'Bruce Lee' },
    { text: 'Clarity comes from eliminating the unnecessary.', author: 'James Clear' },
    { text: 'Focus is the art of knowing what to ignore.', author: 'Naval Ravikant' },
    { text: 'The best way to predict the future is to create it.', author: 'Peter Drucker' },
    { text: 'Do fewer things. Do them better. Make time.', author: 'Unknown' },
    { text: 'Your focus determines your reality.', author: 'Qui-Gon Jinn' },
    { text: 'Concentration is the root of all the higher abilities in man.', author: 'Bruce Lee' },
    { text: 'Where focus goes, energy flows.', author: 'Tony Robbins' },
    { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
    { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
    { text: 'Action is the foundational key to all success.', author: 'Pablo Picasso' },
    { text: 'What you do today can improve all your tomorrows.', author: 'Ralph Marston' }
  ],
  
  feminine: [
    { text: 'You are worthy of all the love you give to others.', author: 'Unknown' },
    { text: 'Soft hearts are not weak; they are brave.', author: 'Erin Hanson' },
    { text: 'You bloom in your own time, beautifully.', author: 'Unknown' },
    { text: 'Self-love is the foundation of all growth.', author: 'Unknown' },
    { text: 'Your gentle spirit is your superpower.', author: 'Unknown' },
    { text: 'Today, I choose peace and nurture my inner garden. I am worthy of love.', author: 'Unknown' },
    { text: 'Embrace your gentle strength.', author: 'Unknown' },
    { text: 'Your presence is a gift.', author: 'Unknown' },
    { text: 'Kindness starts within.', author: 'Unknown' },
    { text: 'You are the poetry your soul is writing.', author: 'Unknown' },
    { text: 'Feminine energy is magnetic, not forceful.', author: 'Unknown' },
    { text: 'She remembered who she was and the game changed.', author: 'Lalah Delia' },
    { text: 'Be gentle with yourself. You are doing the best you can.', author: 'Unknown' },
    { text: 'Your softness is not weakness, it is wisdom.', author: 'Unknown' },
    { text: 'Grace is the beauty of form under the influence of freedom.', author: 'Friedrich Schiller' }
  ],
  
  energetic: [
    { text: 'Your energy introduces you before you even speak.', author: 'Unknown' },
    { text: 'The only limit is the one you set for yourself.', author: 'Unknown' },
    { text: 'Massive action creates massive results.', author: 'Tony Robbins' },
    { text: 'Hustle in silence, let success make the noise.', author: 'Unknown' },
    { text: 'You are unstoppable when you believe it.', author: 'Unknown' },
    { text: 'Ignite your passion. Unleash your potential. Today is yours to conquer!', author: 'Unknown' },
    { text: 'The difference between ordinary and extraordinary is that little extra.', author: 'Jimmy Johnson' },
    { text: 'Do it with passion or not at all.', author: 'Rosa Couchette Carey' },
    { text: 'Energy and persistence conquer all things.', author: 'Benjamin Franklin' },
    { text: "Don't wait for opportunity. Create it.", author: 'Unknown' },
    { text: 'The best revenge is massive success.', author: 'Frank Sinatra' },
    { text: 'Dream big. Work hard. Stay focused.', author: 'Unknown' },
    { text: 'Champions train, losers complain.', author: 'Unknown' },
    { text: 'Rise and grind. Your future self will thank you.', author: 'Unknown' },
    { text: 'Make today so awesome, yesterday gets jealous.', author: 'Unknown' }
  ],
  
  calm: [
    { text: 'Breathe in calm, breathe out chaos.', author: 'Unknown' },
    { text: 'Peace is not the absence of noise, but the presence of stillness within.', author: 'Unknown' },
    { text: 'You are exactly where you need to be right now.', author: 'Unknown' },
    { text: 'Slow down and everything you are chasing will come around.', author: 'Unknown' },
    { text: 'In stillness, you find your strength.', author: 'Unknown' },
    { text: 'The best way to capture moments is to pay attention. This is how we cultivate mindfulness.', author: 'Jon Kabat-Zinn' },
    { text: 'Within you there is a stillness and a sanctuary to which you can retreat at any time.', author: 'Hermann Hesse' },
    { text: 'Calm mind brings inner strength and self-confidence.', author: 'Dalai Lama' },
    { text: 'The quieter you become, the more you can hear.', author: 'Ram Dass' },
    { text: 'Nature does not hurry, yet everything is accomplished.', author: 'Lao Tzu' },
    { text: 'Surrender to what is. Let go of what was. Have faith in what will be.', author: 'Sonia Ricotti' },
    { text: 'Almost everything will work again if you unplug it for a few minutes, including you.', author: 'Anne Lamott' },
    { text: 'Be where you are, not where you think you should be.', author: 'Unknown' },
    { text: 'Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.', author: 'Thich Nhat Hanh' },
    { text: 'Rest when you are weary. Refresh and renew yourself.', author: 'Ralph Marston' }
  ]
};

/**
 * Get a random quote for a specific mood
 * @param {string} mood - Mood identifier
 * @returns {Object} Quote object with text and author
 */
export function getRandomQuote(mood) {
  const quotes = QUOTE_DATABASE[mood] || QUOTE_DATABASE.focused;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

/**
 * Get daily quote (consistent for the day, changes at midnight)
 * @param {string} mood - Mood identifier
 * @returns {Object} Quote object
 */
export function getDailyQuote(mood) {
  const quotes = QUOTE_DATABASE[mood] || QUOTE_DATABASE.focused;
  
  // Use date as seed for consistent daily quote
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const index = dayOfYear % quotes.length;
  
  return quotes[index];
}

/**
 * Get all quotes for a mood
 * @param {string} mood - Mood identifier
 * @returns {Array} Array of quote objects
 */
export function getAllQuotes(mood) {
  return QUOTE_DATABASE[mood] || QUOTE_DATABASE.focused;
}

/**
 * Get quote count for a mood
 * @param {string} mood - Mood identifier
 * @returns {number} Number of quotes
 */
export function getQuoteCount(mood) {
  const quotes = QUOTE_DATABASE[mood] || QUOTE_DATABASE.focused;
  return quotes.length;
}

export default QUOTE_DATABASE;
