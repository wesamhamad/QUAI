import { memo } from 'react';
import './Character.css';

/**
 * Character component with sprite animations
 * Supports idle, walk, jump, and fall states
 */
const Character = memo(({ position, state, direction, size = { width: 64, height: 64 } }) => {
  // Clamp position to ensure character stays on screen
  const clampedY = Math.max(0, Math.min(position.y, 600 - size.height));

  const style = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${clampedY}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    transform: `scaleX(${direction === 'left' ? -1 : 1})`,
    pointerEvents: 'none',
  };

  return (
    <div
      className={`character character--${state}`}
      style={style}
      data-state={state}
    >
      {/* Saudi Student Character */}
      <div className="character__body">
        {/* Head with Shemagh */}
        <div className="character__head">
          <div className="character__shemagh"></div>
          <div className="character__agal"></div>
          <div className="character__face">
            <div className="character__eyes">
              <div className="character__eye character__eye--left"></div>
              <div className="character__eye character__eye--right"></div>
            </div>
            <div className="character__smile"></div>
          </div>
        </div>

        {/* Thobe (Traditional dress) */}
        <div className="character__thobe">
          <div className="character__collar"></div>
        </div>

        {/* Backpack */}
        <div className="character__backpack"></div>

        {/* Arms */}
        <div className="character__arm character__arm--left"></div>
        <div className="character__arm character__arm--right">
          <div className="character__phone"></div>
        </div>

        {/* Legs */}
        <div className="character__leg character__leg--left"></div>
        <div className="character__leg character__leg--right"></div>
      </div>
    </div>
  );
});

Character.displayName = 'Character';

export default Character;

