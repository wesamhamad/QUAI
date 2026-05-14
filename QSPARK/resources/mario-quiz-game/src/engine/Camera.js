/**
 * Camera system for following the player
 * Implements smooth scrolling and boundaries
 */

export class Camera {
  constructor(config = {}) {
    this.x = 0;
    this.y = 0;
    this.updateViewportSize();
    this.worldWidth = config.worldWidth || 4000;
    this.worldHeight = config.worldHeight || 600;
    this.smoothing = config.smoothing || 0.1;
    this.deadZone = config.deadZone || { x: 200, y: 100 };

    // Update viewport size on window resize
    window.addEventListener('resize', () => this.updateViewportSize());
  }

  updateViewportSize() {
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
  }

  /**
   * Update camera position to follow target
   */
  follow(target) {
    // Calculate desired camera position (center on target horizontally only)
    const desiredX = target.x - this.viewportWidth / 2 + target.width / 2;

    // Apply smoothing for horizontal movement only
    this.x += (desiredX - this.x) * this.smoothing;

    // Keep camera Y fixed at 0 (no vertical scrolling)
    this.y = 0;

    // Clamp camera to world boundaries
    this.x = Math.max(0, Math.min(this.x, this.worldWidth - this.viewportWidth));
  }

  /**
   * Get transform style for world container
   */
  getTransform() {
    return `translate(${-this.x}px, ${-this.y}px)`;
  }

  /**
   * Check if object is visible in camera view
   */
  isVisible(object) {
    return (
      object.x + object.width > this.x &&
      object.x < this.x + this.viewportWidth &&
      object.y + object.height > this.y &&
      object.y < this.y + this.viewportHeight
    );
  }
}

