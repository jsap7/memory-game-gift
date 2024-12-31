'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Star, Music, Sparkle } from 'lucide-react';
import styles from './PatternGame.module.css';

const SHAPES = [
  { 
    id: 0, 
    icon: Heart, 
    color: 'text-red-500', 
    activeClass: styles.redActive,
    sound: '/games/pattern/sounds/hi.mp3'
  },
  { 
    id: 1, 
    icon: Star, 
    color: 'text-yellow-500', 
    activeClass: styles.yellowActive,
    sound: '/games/pattern/sounds/quack.mp3'
  },
  { 
    id: 2, 
    icon: Music, 
    color: 'text-green-500', 
    activeClass: styles.greenActive,
    sound: '/games/pattern/sounds/fuck.mp3'
  },
  { 
    id: 3, 
    icon: Sparkle, 
    color: 'text-blue-500', 
    activeClass: styles.blueActive,
    sound: '/games/pattern/sounds/rizz.mp3'
  }
];

const PATTERNS = [
  [0],                              // Round 1: Single
  [0, 1],                          // Round 2: Two in a row
  [2, 3],                          // Round 3: Different two
  [0, 1, 2],                       // Round 4: Three in a row
  [3, 2, 1],                       // Round 5: Reverse three
  [0, 2, 1, 3],                    // Round 6: Four mixed
  [3, 3, 1],                       // Round 7: Repeated shape
  [0, 1, 0, 1],                    // Round 8: Alternating
  [2, 2, 3, 3],                    // Round 9: Double pairs
  [0, 1, 2, 3, 1],                 // Round 10: Five mixed
];

const PatternGame = () => {
  const [gameState, setGameState] = useState('idle');
  const [round, setRound] = useState(0);
  const [currentPattern, setCurrentPattern] = useState([]);
  const [playerInputs, setPlayerInputs] = useState([]);
  const [activeShape, setActiveShape] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [audioElements, setAudioElements] = useState({});
  const [gameAudio, setGameAudio] = useState({ victory: null, failure: null });
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize audio on client side only
  useEffect(() => {
    if (!isClient) return;

    const shapeAudio = SHAPES.reduce((acc, shape) => {
      acc[shape.id] = new Audio(shape.sound);
      return acc;
    }, {});

    setAudioElements(shapeAudio);
    setGameAudio({
      victory: new Audio('/games/pattern/sounds/outro.mp3'),
      failure: new Audio('/games/pattern/sounds/meow.mp3')
    });
  }, [isClient]);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const playSound = (shapeId) => {
    if (!isClient) return;
    if (audioElements[shapeId]) {
      audioElements[shapeId].currentTime = 0;
      audioElements[shapeId].play();
    }
  };

  const displayPattern = async () => {
    setGameState('showing');
    const pattern = PATTERNS[round];
    setCurrentPattern(pattern);

    for (const shapeId of pattern) {
      setActiveShape(shapeId);
      playSound(shapeId);
      await sleep(800);
      setActiveShape(null);
      await sleep(400);
    }

    setGameState('input');
    setPlayerInputs([]);
  };

  const startGame = async () => {
    setGameState('showing');
    setRound(0);
    setPlayerInputs([]);
    setCurrentPattern([]);
    setActiveShape(null);
    
    await sleep(500);
    
    const firstPattern = PATTERNS[0];
    setCurrentPattern(firstPattern);
    
    for (const shapeId of firstPattern) {
      setActiveShape(shapeId);
      playSound(shapeId);
      await sleep(800);
      setActiveShape(null);
      await sleep(400);
    }
    
    setGameState('input');
  };

  const handleShapeClick = async (shapeId) => {
    if (gameState !== 'input') return;

    setActiveShape(shapeId);
    playSound(shapeId);
    await sleep(200);
    setActiveShape(null);

    const newInputs = [...playerInputs, shapeId];
    setPlayerInputs(newInputs);

    if (shapeId !== currentPattern[playerInputs.length]) {
      if (gameAudio.failure) {
        gameAudio.failure.play();
      }
      setGameState('failure');
      setShowModal(true);
      return;
    }

    if (newInputs.length === currentPattern.length) {
      if (round === PATTERNS.length - 1) {
        if (gameAudio.victory) {
          gameAudio.victory.play();
        }
        setGameState('success');
        setShowModal(true);
      } else {
        await sleep(500);
        setRound(round + 1);
        displayPattern();
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Pattern Memory Game</h1>
        
        {gameState === 'idle' && (
          <button onClick={startGame} className={styles.button}>
            Start Game
          </button>
        )}

        {gameState === 'showing' && (
          <p className={styles.message}>
            Watch the pattern...
          </p>
        )}

        {gameState === 'input' && (
          <p className={styles.message}>
            Round {round + 1} - Repeat the pattern!
          </p>
        )}
      </div>

      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          {SHAPES.map(({ id, icon: Icon, color, activeClass }) => (
            <button
              key={id}
              onClick={() => handleShapeClick(id)}
              disabled={gameState !== 'input'}
              className={`${styles.gridButton} ${
                activeShape === id ? activeClass : color
              }`}
            >
              <Icon size={40} />
            </button>
          ))}
        </div>
      </div>

      {/* Game Over Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            {gameState === 'failure' && (
              <>
                <h2 className={styles.modalTitle}>Game Over!</h2>
                <p className={styles.modalText}>You made it to round {round + 1}</p>
                <button onClick={() => { setShowModal(false); startGame(); }} className={styles.button}>
                  Try Again
                </button>
              </>
            )}
            {gameState === 'success' && (
              <>
                <h2 className={styles.modalTitle}>Congratulations!</h2>
                <p className={styles.modalText}>You've completed all {PATTERNS.length} rounds!</p>
                <button onClick={() => { setShowModal(false); startGame(); }} className={styles.button}>
                  Play Again
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatternGame; 