import { useState, useRef, useEffect, useCallback } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { useKeyboard } from '../hooks/useKeyboard';
import { Physics } from '../engine/Physics';
import { Camera } from '../engine/Camera';
import Character from './Character';
import Platform from './Platform';
import QuizModal from './QuizModal';
import GameHUD from './GameHUD';
import Coin from './Coin';
import './Game.css';

const GAME_CONFIG = {
  worldWidth: 4000,
  worldHeight: 600,
  groundLevel: 486, // مستوى الأرض (600 - 50 - 64 = 486)
  playerSpeed: 5,
  autoWalkSpeed: 2.5, // سرعة المشي التلقائي
  jumpForce: 12,
  doubleJumpForce: 10,
  gravity: 0.6,
  maxFallSpeed: 15,
};

const Game = ({ questions = [], onComplete }) => {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [player, setPlayer] = useState({
    x: 100,
    y: 486, // على الأرض مباشرة (600 - 50 - 64 = 486)
    width: 64,
    height: 64,
    velocityX: 0,
    velocityY: 0,
    onGround: true,
    canDoubleJump: true,
    state: 'walking', // idle, walking, jumping, falling
    direction: 'right',
  });
  
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [hitBlocks, setHitBlocks] = useState(new Set());
  const [correctBlocks, setCorrectBlocks] = useState(new Set()); // Track blocks with correct answers
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [coins, setCoins] = useState([]);
  const [collectedCoins, setCollectedCoins] = useState(new Set());
  const [isHurt, setIsHurt] = useState(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(null); // Track current block being answered

  // Refs
  const physicsRef = useRef(new Physics());
  const cameraRef = useRef(new Camera({ 
    worldWidth: GAME_CONFIG.worldWidth,
    worldHeight: GAME_CONFIG.worldHeight 
  }));

  // Keyboard input
  const keys = useKeyboard(['ArrowLeft', 'ArrowRight', 'ArrowUp', ' ', 'a', 'd', 'w']);

  // Level data
  const platforms = [
    { x: 0, y: 550, width: 800, height: 50, type: 'ground' },
    { x: 450, y: 400, width: 250, height: 30, type: 'floating' },
    { x: 900, y: 500, width: 180, height: 30, type: 'floating' },
    { x: 1300, y: 450, width: 120, height: 30, type: 'floating' },
    { x: 1500, y: 350, width: 120, height: 30, type: 'floating' },
    { x: 1900, y: 420, width: 200, height: 30, type: 'floating' },
    { x: 2300, y: 480, width: 100, height: 30, type: 'floating' },
    { x: 2500, y: 380, width: 100, height: 30, type: 'floating' },
    { x: 2900, y: 450, width: 250, height: 30, type: 'floating' },
    { x: 3500, y: 500, width: 500, height: 50, type: 'ground' },
  ];

  // Generate question blocks based on available questions
  const questionBlocks = questions.slice(0, 10).map((_, index) => {
    const positions = [
      { x: 558, y: 330 },
      { x: 980, y: 430 },
      { x: 1538, y: 280 },
      { x: 1990, y: 350 },
      { x: 2518, y: 310 },
      { x: 3000, y: 380 },
      { x: 3300, y: 320 },
      { x: 3600, y: 400 },
      { x: 3850, y: 350 },
      { x: 4100, y: 380 },
    ];
    return {
      ...positions[index],
      width: 64,
      height: 64,
      type: 'question-block',
      questionIndex: index
    };
  });

  // Game loop
  useGameLoop((deltaTime) => {
    if (!gameStarted || currentQuestion) return;

    setPlayer(prev => {
      let newState = { ...prev };

      // Horizontal movement - Auto-walk + manual control
      let velocityX = GAME_CONFIG.autoWalkSpeed; // المشي التلقائي للأمام

      if (keys['ArrowLeft'] || keys['a']) {
        velocityX = -GAME_CONFIG.playerSpeed;
        newState.direction = 'left';
        newState.state = 'walking';
      } else if (keys['ArrowRight'] || keys['d']) {
        velocityX = GAME_CONFIG.playerSpeed;
        newState.direction = 'right';
        newState.state = 'walking';
      } else {
        // المشي التلقائي للأمام
        newState.direction = 'right';
        newState.state = prev.onGround ? 'walking' : prev.state;
      }

      newState.x += velocityX;
      newState.x = Math.max(0, Math.min(newState.x, GAME_CONFIG.worldWidth - newState.width));

      // Apply gravity (increase downward velocity)
      if (!prev.onGround) {
        newState.velocityY += GAME_CONFIG.gravity;
        // Limit maximum fall speed
        if (newState.velocityY > GAME_CONFIG.maxFallSpeed) {
          newState.velocityY = GAME_CONFIG.maxFallSpeed;
        }
      }

      // Apply vertical velocity
      newState.y += newState.velocityY;

      // Debug logging
      if (newState.y < 50 || newState.y > 500) {
        console.log('Character Y position:', newState.y, 'Velocity:', newState.velocityY, 'OnGround:', newState.onGround);
      }

      // Prevent going above screen (ceiling)
      if (newState.y < 0) {
        newState.y = 0;
        newState.velocityY = 0;
        console.warn('Character hit ceiling! Resetting to Y=0');
      }

      // Check if on ground
      const groundY = GAME_CONFIG.worldHeight - 50 - newState.height;
      if (newState.y >= groundY) {
        newState.y = groundY;
        newState.velocityY = 0;
        newState.onGround = true;
        newState.canDoubleJump = true;
        if (velocityX !== 0 || GAME_CONFIG.autoWalkSpeed !== 0) {
          newState.state = 'walking';
        } else {
          newState.state = 'idle';
        }
      } else {
        newState.onGround = false;
      }

      // Prevent going below ground (extra safety)
      if (newState.y > groundY) {
        newState.y = groundY;
        newState.velocityY = 0;
        newState.onGround = true;
      }

      // Platform collision
      let onPlatform = false;
      platforms.forEach(platform => {
        const playerBottom = newState.y + newState.height;
        const playerRight = newState.x + newState.width;
        const platformTop = platform.y;
        const platformBottom = platform.y + platform.height;
        const platformLeft = platform.x;
        const platformRight = platform.x + platform.width;

        // Check if player is above platform and falling
        if (
          newState.velocityY >= 0 && // Falling down
          playerBottom >= platformTop &&
          playerBottom <= platformTop + 15 &&
          playerRight > platformLeft &&
          newState.x < platformRight
        ) {
          newState.y = platformTop - newState.height;
          newState.velocityY = 0;
          newState.onGround = true;
          newState.canDoubleJump = true;
          onPlatform = true;
          if (velocityX !== 0 || GAME_CONFIG.autoWalkSpeed !== 0) {
            newState.state = 'walking';
          } else {
            newState.state = 'idle';
          }
        }

        // Check if player hit platform from below (for question blocks)
        if (
          newState.velocityY < 0 && // Moving up
          newState.y <= platformBottom &&
          newState.y >= platformBottom - 15 &&
          playerRight > platformLeft &&
          newState.x < platformRight
        ) {
          newState.velocityY = 0;
          newState.y = platformBottom;
        }
      });

      // Update animation state based on velocity
      if (!newState.onGround && !onPlatform) {
        newState.state = newState.velocityY < 0 ? 'jumping' : 'falling';
      }

      // Check question block collision
      questionBlocks.forEach((block, index) => {
        if (hitBlocks.has(index)) return;

        const playerTop = newState.y;
        const playerBottom = newState.y + newState.height;
        const playerRight = newState.x + newState.width;
        const blockBottom = block.y + block.height;
        const blockLeft = block.x;
        const blockRight = block.x + block.width;

        // Hit from below
        if (
          newState.velocityY < 0 && // Moving up
          playerTop <= blockBottom &&
          playerTop >= blockBottom - 15 &&
          playerRight > blockLeft &&
          newState.x < blockRight
        ) {
          setHitBlocks(prev => new Set([...prev, index]));
          setCurrentBlockIndex(index); // Track which block is being answered

          // Check if question exists
          if (questions[block.questionIndex]) {
            setCurrentQuestion({
              question: questions[block.questionIndex],
              blockPosition: { x: block.x, y: block.y, width: block.width, height: block.height }
            });
          }
          newState.velocityY = 0;
        }
      });

      // Check coin collection
      coins.forEach(coin => {
        if (collectedCoins.has(coin.id)) return;

        const playerCenterX = newState.x + newState.width / 2;
        const playerCenterY = newState.y + newState.height / 2;
        const coinCenterX = coin.x + 16; // coin width is 32, so center is +16
        const coinCenterY = coin.y + 16;

        const distance = Math.sqrt(
          Math.pow(playerCenterX - coinCenterX, 2) +
          Math.pow(playerCenterY - coinCenterY, 2)
        );

        // Collect coin if close enough
        if (distance < 40) {
          setCollectedCoins(prev => new Set([...prev, coin.id]));
          setScore(prev => prev + 10); // +10 points per coin
        }
      });

      return newState;
    });

    // Update camera
    cameraRef.current.follow(player);
    setCameraOffset({
      x: cameraRef.current.x,
      y: cameraRef.current.y
    });
  }, gameStarted);

  // Jump handling
  useEffect(() => {
    const handleJump = () => {
      if (!gameStarted || currentQuestion) return;

      setPlayer(prev => {
        if (prev.onGround) {
          return { ...prev, velocityY: -GAME_CONFIG.jumpForce, onGround: false, state: 'jumping' };
        } else if (prev.canDoubleJump) {
          return { ...prev, velocityY: -GAME_CONFIG.doubleJumpForce, canDoubleJump: false, state: 'jumping' };
        }
        return prev;
      });
    };

    if (keys['ArrowUp'] || keys[' '] || keys['w']) {
      handleJump();
    }
  }, [keys, gameStarted, currentQuestion]);

  // Handle quiz answer
  const handleAnswer = useCallback((isCorrect, blockPosition) => {
    if (isCorrect) {
      setScore(prev => prev + 100); // +100 points for correct answer

      // Mark block as correctly answered (turn green)
      if (currentBlockIndex !== null) {
        setCorrectBlocks(prev => new Set([...prev, currentBlockIndex]));
      }

      // Spawn coins
      const numCoins = 5;
      const newCoins = [];
      for (let i = 0; i < numCoins; i++) {
        newCoins.push({
          id: Date.now() + i + Math.random(),
          x: blockPosition.x + blockPosition.width / 2 - 16 + (i - 2) * 25,
          y: blockPosition.y - 10,
        });
      }
      setCoins(prev => [...prev, ...newCoins]);

      // Remove coins after animation
      setTimeout(() => {
        setCoins(prev => prev.filter(coin => !newCoins.find(nc => nc.id === coin.id)));
      }, 1500);
    } else {
      // Wrong answer - lose a life and show hurt animation
      setLives(prev => Math.max(0, prev - 1));
      setIsHurt(true);

      // Push player back and make them bounce
      setPlayer(prev => ({
        ...prev,
        velocityX: -8,
        velocityY: -8,
        x: Math.max(0, prev.x - 30)
      }));

      // Remove hurt state after animation
      setTimeout(() => {
        setIsHurt(false);
      }, 1000);
    }
    setCurrentQuestion(null);
    setCurrentBlockIndex(null); // Reset current block index
  }, [currentBlockIndex]);

  // Start game
  const handleStart = () => {
    setGameStarted(true);
  };

  return (
    <div className="game-container">
      {!gameStarted && (
        <div className="start-screen">
          <h1>🎮 Mario Quiz Game</h1>
          <p>Use Arrow Keys or WASD to move</p>
          <p>Press Space or ↑ to jump</p>
          <p>Hit question blocks to answer quizzes!</p>
          <button onClick={handleStart} className="start-button">
            Start Game
          </button>
        </div>
      )}

      <GameHUD score={score} lives={lives} totalQuestions={questions.length} />

      <div className="game-world" style={{
        transform: `translate(${-cameraOffset.x}px, ${-cameraOffset.y}px)`,
        width: `${GAME_CONFIG.worldWidth}px`,
        height: `${GAME_CONFIG.worldHeight}px`,
      }}>
        {gameStarted && (
          <Character
            position={{ x: player.x, y: player.y }}
            state={isHurt ? 'hurt' : player.state}
            direction={player.direction}
            size={{ width: player.width, height: player.height }}
          />
        )}

        {platforms.map((platform, index) => (
          <Platform
            key={`platform-${index}`}
            position={{ x: platform.x, y: platform.y }}
            size={{ width: platform.width, height: platform.height }}
            type={platform.type}
          />
        ))}

        {questionBlocks.map((block, index) => (
          <Platform
            key={`question-${index}`}
            position={{ x: block.x, y: block.y }}
            size={{ width: block.width, height: block.height }}
            type={hitBlocks.has(index) ? 'ground' : block.type}
            questionIndex={block.questionIndex}
            isHit={hitBlocks.has(index)}
            isCorrect={correctBlocks.has(index)}
          />
        ))}

        {/* Coins - only show uncollected ones */}
        {coins.filter(coin => !collectedCoins.has(coin.id)).map(coin => (
          <Coin
            key={coin.id}
            id={coin.id}
            position={{ x: coin.x, y: coin.y }}
          />
        ))}
      </div>

      {currentQuestion && (
        <QuizModal
          question={currentQuestion.question}
          blockPosition={currentQuestion.blockPosition}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  );
};

export default Game;

