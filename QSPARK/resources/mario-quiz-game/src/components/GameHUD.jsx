import './GameHUD.css';

const GameHUD = ({ score, lives, totalQuestions }) => {
  return (
    <div className="game-hud">
      <div className="hud-item hud-score">
        <span className="hud-icon">🪙</span>
        <span className="hud-label">Score:</span>
        <span className="hud-value">{score}/{totalQuestions}</span>
      </div>

      <div className="game-hud__university">
        <h1 className="game-hud__university-name">QASSIM UNIVERSITY</h1>
        <p className="game-hud__university-arabic">جامعة القصيم</p>
      </div>

      <div className="hud-item hud-lives">
        <span className="hud-icon">❤️</span>
        <span className="hud-label">Lives:</span>
        <div className="hud-hearts">
          {Array.from({ length: 3 }).map((_, index) => (
            <span
              key={index}
              className={`heart ${index < lives ? 'heart--active' : 'heart--inactive'}`}
            >
              ❤️
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameHUD;

