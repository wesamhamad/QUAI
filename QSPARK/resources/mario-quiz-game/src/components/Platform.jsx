import { memo } from 'react';
import './Platform.css';

/**
 * Platform component
 * Supports different types: ground, floating, question-block
 */
const Platform = memo(({ position, size, type = 'ground', questionIndex, onHit, isHit = false, isCorrect = false }) => {
  const style = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
  };

  const handleClick = () => {
    if (type === 'question-block' && onHit) {
      onHit(questionIndex);
    }
  };

  // Build className with correct state
  let className = `platform platform--${type}`;
  if (isHit) className += ' platform--hit';
  if (isCorrect) className += ' platform--correct';

  return (
    <div
      className={className}
      style={style}
      onClick={handleClick}
      data-question-index={questionIndex}
    >
      {type === 'question-block' && !isHit && (
        <div className="platform__question-mark">?</div>
      )}
      {isCorrect && (
        <div className="platform__checkmark">✓</div>
      )}
    </div>
  );
});

Platform.displayName = 'Platform';

export default Platform;

