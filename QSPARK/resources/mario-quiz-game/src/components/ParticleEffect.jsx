import { useEffect, useState } from 'react';
import './ParticleEffect.css';

const ParticleEffect = ({ x, y, type = 'coin', onComplete }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particles
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 8,
      vy: -Math.random() * 10 - 5,
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
    }));
    
    setParticles(newParticles);

    // Clean up after animation
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [x, y, onComplete]);

  return (
    <div className="particle-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`particle particle--${type}`}
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            '--vx': particle.vx,
            '--vy': particle.vy,
            '--rotation': `${particle.rotation}deg`,
            '--scale': particle.scale,
          }}
        >
          {type === 'coin' && '🪙'}
          {type === 'star' && '⭐'}
          {type === 'heart' && '❤️'}
        </div>
      ))}
    </div>
  );
};

export default ParticleEffect;

