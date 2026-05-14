import { memo } from 'react';
import './Coin.css';

/**
 * Coin component that appears when answering correctly
 */
const Coin = memo(({ position, id }) => {
  const style = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: '32px',
    height: '32px',
  };

  return (
    <div className="coin" style={style} data-coin-id={id}>
      <div className="coin__inner">
        <span className="coin__symbol">🪙</span>
      </div>
    </div>
  );
});

Coin.displayName = 'Coin';

export default Coin;

