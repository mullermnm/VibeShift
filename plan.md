# VibeShift: The Mood-Responsive Dashboard

## System Architecture
VibeShift operates on a **Modular Mood Engine**. Every UI component (widget) is wrapped in a "Vibe Wrapper" that listens for the global mood state.

## it will start with The Four Core Vibes for a MVP and later developers can add more vibes (2026 Edition)

### 1. 🎯 Focused
- **Goal:** Deep work immersion.
- **Layout:** Search Bar (Input) + "Focus Timer" (Hidden until active).
- **Background:** Static, distraction-free imagery (e.g., library, foggy mountain).
- **Quotes:** Nurture self-discipline and focus.
- **Animation:** None

### 2. ✨ Feminine
- **Goal:** Nurturing, aesthetic-driven creativity.
- **Layout:** Affirmation Card + Soft Digital Clock + Curated Mood Board.
- **Background:** Floating floral particles and soft-glow transitions.
- **Quotes:** Nurture love and self-love.
- **Animation:** Feminine Animations    

### 3. 🔥 Energetic
- **Goal:** Maximum productivity and hype.
- **Layout:** Full Dashboard (News, Tasks, Stocks, Spotify, Fitness Metrics).
- **Background:** Vibrant animated waves and fast-floating geometric shapes.
- **Quotes:** Nurture energy and motivation.
- **Animation:** Energetic Animations

### 4. 🌊 Calm
- **Goal:** Mental reset and anxiety reduction.
- **Layout:** 4-7-8 Breathing Guide + Soft Background Audio.
- **Background:** Slow-motion natural landscapes (Forests, Oceans).
- **Quotes:** Nurture calmness and relaxation.
- **Animation:** Calm Animations

## Technical Requirements
- **Storage:** `chrome.storage.sync` to remember the last "Vibe" across devices.
- **API:** Unsplash API (Image fetcher) + OpenWeather API.
- **Animations:** CSS Keyframes for floating and Lottie for complex particles.
