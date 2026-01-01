/**
 * Floating Animation Engine - Canvas-based particle system
 * Handles mood-specific floating animations (petals, bubbles, sparks)
 * Uses object pooling for performance optimization
 */

class FloatingEngine {
  /**
   * @param {string} canvasId - ID of the canvas element
   * @param {number} maxParticles - Maximum number of particles
   */
  constructor(canvasId, maxParticles = 50) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.maxParticles = maxParticles;
    
    this.particles = [];
    this.particlePool = [];
    this.animationFrameId = null;
    this.isRunning = false;
    this.lastTime = 0;
    
    this.currentConfig = null;
    this.particleType = null;
    
    if (this.canvas) {
      // Resize canvas to window size
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
      
      // Pause animations when tab is hidden
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.pause();
        } else {
          this.resume();
        }
      });
    }
  }

  /**
   * Resize canvas to match window dimensions
   */
  resizeCanvas() {
    if (!this.canvas) return;
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * Start animations with specified particle type
   * @param {string} type - 'petal', 'bubble', or 'spark'
   * @param {Object} config - Animation configuration from mood config
   */
  start(type, config) {
    if (!this.canvas || !this.ctx) {
      console.warn('FloatingEngine: Canvas not available');
      return;
    }
    
    if (this.isRunning) {
      this.stop();
    }
    
    this.particleType = type;
    this.currentConfig = config;
    this.isRunning = true;
    
    // Initialize particles
    this.initializeParticles();
    
    // Start animation loop
    this.lastTime = performance.now();
    this.animate();
  }

  /**
   * Initialize particle objects
   */
  initializeParticles() {
    const count = Math.min(this.currentConfig.particleCount || 30, this.maxParticles);
    this.particles = [];
    
    for (let i = 0; i < count; i++) {
      const particle = this.createParticle();
      this.particles.push(particle);
    }
  }

  /**
   * Create a single particle based on type
   * @returns {Object} Particle object
   */
  createParticle() {
    const baseParticle = {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      opacity: this.randomInRange(this.currentConfig.config.opacity || { min: 0.3, max: 0.8 }),
      color: this.getRandomColor()
    };
    
    switch (this.particleType) {
      case 'petal':
        return this.createPetalParticle(baseParticle);
      
      case 'bubble':
        return this.createBubbleParticle(baseParticle);
      
      case 'spark':
        return this.createSparkParticle(baseParticle);
      
      default:
        return baseParticle;
    }
  }

  /**
   * Create a petal particle (Feminine mode)
   * @param {Object} base - Base particle properties
   * @returns {Object} Petal particle
   */
  createPetalParticle(base) {
    const sizeRange = this.currentConfig.config.size || { min: 8, max: 18 };
    return {
      ...base,
      size: this.randomInRange(sizeRange),
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * (this.currentConfig.config.rotationSpeed || 1.5),
      vx: (Math.random() - 0.5) * 0.5,
      vy: Math.random() * (this.currentConfig.speed || 0.4) + 0.3,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.01
    };
  }

  /**
   * Create a bubble particle (Calm mode)
   * @param {Object} base - Base particle properties
   * @returns {Object} Bubble particle
   */
  createBubbleParticle(base) {
    const sizeRange = this.currentConfig.config.size || { min: 15, max: 40 };
    return {
      ...base,
      y: this.canvas.height + Math.random() * 100,
      size: this.randomInRange(sizeRange),
      vy: -(Math.random() * (this.currentConfig.speed || 0.3) + 0.2),
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: (Math.random() - 0.5) * 0.03,
      wobbleAmount: Math.random() * 30 + 10
    };
  }

  /**
   * Create a spark particle (Energetic mode)
   * @param {Object} base - Base particle properties
   * @returns {Object} Spark particle
   */
  createSparkParticle(base) {
    const sizeRange = this.currentConfig.config.size || { min: 4, max: 12 };
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * (this.currentConfig.speed || 1.5) + 0.5;
    const shapes = this.currentConfig.config.shapes || ['circle'];
    
    return {
      ...base,
      size: this.randomInRange(sizeRange),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 5,
      trail: []
    };
  }

  /**
   * Main animation loop
   */
  animate() {
    if (!this.isRunning) return;
    
    const currentTime = performance.now();
    const deltaTime = Math.min((currentTime - this.lastTime) / 16.67, 2); // Cap at 2x speed, normalize to 60 FPS
    this.lastTime = currentTime;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    this.particles.forEach(particle => {
      this.updateParticle(particle, deltaTime);
      this.drawParticle(particle);
    });
    
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  /**
   * Update particle position and properties
   * @param {Object} particle - Particle to update
   * @param {number} deltaTime - Time since last frame (normalized)
   */
  updateParticle(particle, deltaTime) {
    switch (this.particleType) {
      case 'petal':
        this.updatePetalParticle(particle, deltaTime);
        break;
      
      case 'bubble':
        this.updateBubbleParticle(particle, deltaTime);
        break;
      
      case 'spark':
        this.updateSparkParticle(particle, deltaTime);
        break;
    }
  }

  /**
   * Update petal particle
   */
  updatePetalParticle(particle, deltaTime) {
    // Sway motion
    particle.swayOffset += particle.swaySpeed * deltaTime;
    const sway = Math.sin(particle.swayOffset) * 0.5;
    
    particle.x += (particle.vx + sway) * deltaTime;
    particle.y += particle.vy * deltaTime;
    particle.rotation += particle.rotationSpeed * deltaTime;
    
    // Reset if off screen
    if (particle.y > this.canvas.height + particle.size) {
      particle.y = -particle.size;
      particle.x = Math.random() * this.canvas.width;
    }
    
    // Wrap horizontally
    if (particle.x < -particle.size) {
      particle.x = this.canvas.width + particle.size;
    } else if (particle.x > this.canvas.width + particle.size) {
      particle.x = -particle.size;
    }
  }

  /**
   * Update bubble particle
   */
  updateBubbleParticle(particle, deltaTime) {
    particle.y += particle.vy * deltaTime;
    particle.wobble += particle.wobbleSpeed * deltaTime;
    particle.x += Math.sin(particle.wobble) * 0.5 * deltaTime;
    
    // Subtle size oscillation
    particle.displaySize = particle.size + Math.sin(particle.wobble * 2) * 2;
    
    // Reset if off screen
    if (particle.y < -particle.size * 2) {
      particle.y = this.canvas.height + particle.size;
      particle.x = Math.random() * this.canvas.width;
    }
  }

  /**
   * Update spark particle
   */
  updateSparkParticle(particle, deltaTime) {
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;
    particle.rotation += particle.rotationSpeed * deltaTime;
    
    // Wrap around screen edges
    if (particle.x < 0) particle.x = this.canvas.width;
    if (particle.x > this.canvas.width) particle.x = 0;
    if (particle.y < 0) particle.y = this.canvas.height;
    if (particle.y > this.canvas.height) particle.y = 0;
  }

  /**
   * Draw particle on canvas
   * @param {Object} particle - Particle to draw
   */
  drawParticle(particle) {
    this.ctx.save();
    this.ctx.globalAlpha = particle.opacity;
    
    switch (this.particleType) {
      case 'petal':
        this.drawPetal(particle);
        break;
      
      case 'bubble':
        this.drawBubble(particle);
        break;
      
      case 'spark':
        this.drawSpark(particle);
        break;
    }
    
    this.ctx.restore();
  }

  /**
   * Draw petal shape
   */
  drawPetal(particle) {
    this.ctx.translate(particle.x, particle.y);
    this.ctx.rotate(particle.rotation * Math.PI / 180);
    this.ctx.fillStyle = particle.color;
    
    // Draw petal shape (ellipse with pointed end)
    this.ctx.beginPath();
    this.ctx.moveTo(0, -particle.size);
    this.ctx.bezierCurveTo(
      particle.size * 0.5, -particle.size * 0.5,
      particle.size * 0.5, particle.size * 0.5,
      0, particle.size * 0.3
    );
    this.ctx.bezierCurveTo(
      -particle.size * 0.5, particle.size * 0.5,
      -particle.size * 0.5, -particle.size * 0.5,
      0, -particle.size
    );
    this.ctx.fill();
  }

  /**
   * Draw bubble shape
   */
  drawBubble(particle) {
    const size = particle.displaySize || particle.size;
    
    // Main bubble
    const gradient = this.ctx.createRadialGradient(
      particle.x - size * 0.3, particle.y - size * 0.3, 0,
      particle.x, particle.y, size
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(0.5, particle.color);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Highlight
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    this.ctx.beginPath();
    this.ctx.arc(
      particle.x - size * 0.3,
      particle.y - size * 0.3,
      size * 0.2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  /**
   * Draw spark shape
   */
  drawSpark(particle) {
    this.ctx.translate(particle.x, particle.y);
    this.ctx.rotate(particle.rotation * Math.PI / 180);
    this.ctx.fillStyle = particle.color;
    
    const size = particle.size;
    
    switch (particle.shape) {
      case 'triangle':
        this.ctx.beginPath();
        this.ctx.moveTo(0, -size);
        this.ctx.lineTo(size * 0.866, size * 0.5);
        this.ctx.lineTo(-size * 0.866, size * 0.5);
        this.ctx.closePath();
        this.ctx.fill();
        break;
      
      case 'square':
        this.ctx.fillRect(-size / 2, -size / 2, size, size);
        break;
      
      case 'circle':
      default:
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        break;
    }
  }

  /**
   * Get random color from config
   * @returns {string} Color value
   */
  getRandomColor() {
    const colors = this.currentConfig.config.colors || ['#FFFFFF'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Get random value in range
   * @param {Object} range - { min, max }
   * @returns {number} Random value
   */
  randomInRange(range) {
    if (typeof range === 'number') return range;
    return Math.random() * (range.max - range.min) + range.min;
  }

  /**
   * Stop animations completely
   */
  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.particles = [];
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * Pause animations (preserve particles)
   */
  pause() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Resume animations
   */
  resume() {
    if (this.particles.length > 0 && !this.isRunning && this.currentConfig) {
      this.isRunning = true;
      this.lastTime = performance.now();
      this.animate();
    }
  }

  /**
   * Check if animations are running
   * @returns {boolean}
   */
  isAnimating() {
    return this.isRunning;
  }
}

export default FloatingEngine;
