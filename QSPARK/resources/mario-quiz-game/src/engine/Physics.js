/**
 * Physics engine for the game
 * Handles gravity, velocity, and collision detection
 */

export class Physics {
  constructor(config = {}) {
    this.gravity = config.gravity || 0.8;
    this.friction = config.friction || 0.85;
    this.maxVelocityY = config.maxVelocityY || 20;
  }

  /**
   * Apply gravity to velocity
   */
  applyGravity(velocityY) {
    // Gravity pulls down, so we subtract from velocityY (positive Y is down in screen coordinates)
    return Math.min(this.maxVelocityY, velocityY + this.gravity);
  }

  /**
   * Check AABB collision between two rectangles
   */
  checkCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  /**
   * Check if entity is on top of platform
   */
  isOnPlatform(entity, platform, velocityY) {
    const entityBottom = entity.y + entity.height;
    const platformTop = platform.y;

    return (
      velocityY >= 0 && // Falling or stationary (positive Y is down)
      entityBottom >= platformTop &&
      entityBottom <= platformTop + 10 && // Tolerance
      entity.x + entity.width > platform.x &&
      entity.x < platform.x + platform.width
    );
  }

  /**
   * Check if entity hit platform from below
   */
  hitFromBelow(entity, platform, velocityY) {
    const entityTop = entity.y;
    const platformBottom = platform.y + platform.height;

    return (
      velocityY < 0 && // Moving up (negative Y is up)
      entityTop <= platformBottom &&
      entityTop >= platformBottom - 10 && // Tolerance
      entity.x + entity.width > platform.x &&
      entity.x < platform.x + platform.width
    );
  }

  /**
   * Resolve platform collision
   */
  resolvePlatformCollision(entity, platform, velocityY) {
    if (this.isOnPlatform(entity, platform, velocityY)) {
      return {
        y: platform.y - entity.height,
        velocityY: 0,
        onGround: true
      };
    }
    
    if (this.hitFromBelow(entity, platform, velocityY)) {
      return {
        y: platform.y + platform.height,
        velocityY: -velocityY * 0.5, // Bounce back
        onGround: false
      };
    }
    
    return null;
  }
}

