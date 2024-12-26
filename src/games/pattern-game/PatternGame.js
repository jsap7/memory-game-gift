'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Star, Music, Sparkle } from 'lucide-react';
import styles from './PatternGame.module.css';

// Game result sounds
const VICTORY_SOUND = new Audio('/assets/outro.mp3');
const FAILURE_SOUND = new Audio('/assets/meow.mp3');

const SHAPES = [
  { 
    id: 0, 
    icon: Heart, 
    color: 'text-red-500', 
    activeClass: styles.redActive,
    sound: '/assets/hi.mp3'
  },
  { 
    id: 1, 
    icon: Star, 
    color: 'text-yellow-500', 
    activeClass: styles.yellowActive,
    sound: '/assets/quack.mp3'
  },
  { 
    id: 2, 
    icon: Music, 
    color: 'text-green-500', 
    activeClass: styles.greenActive,
    sound: '/assets/fuck.mp3'
  },
  { 
    id: 3, 
    icon: Sparkle, 
    color: 'text-blue-500', 
    activeClass: styles.blueActive,
    sound: '/assets/rizz.mp3'
  }
];

// Create audio objects for each sound
const audioElements = SHAPES.reduce((acc, shape) => {
  if (typeof window !== 'undefined') {
    acc[shape.id] = new Audio(shape.sound);
  }
  return acc;
}, {});

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
  /* Commented out for easier gameplay
  [3, 2, 2, 1, 0],                 // Round 11: Five with repeat
  [0, 0, 1, 1, 2],                 // Round 12: Double hits
  [3, 2, 1, 0, 3, 2],             // Round 13: Six sequence
  [0, 1, 1, 2, 2, 3],             // Round 14: Double steps
  [3, 3, 3, 2, 1, 0],             // Round 15: Triple start
  [0, 1, 2, 3, 3, 2, 1],          // Round 16: Seven with backtrack
  [2, 2, 1, 1, 3, 3, 0],          // Round 17: Double pairs plus one
  [0, 1, 2, 3, 2, 1, 0, 3],       // Round 18: Eight with loop
  [3, 3, 2, 2, 1, 1, 0, 0],       // Round 19: Double pairs sequence
  [0, 1, 2, 3, 3, 2, 1, 0, 1],    // Round 20: Nine with loop back
  [2, 2, 3, 3, 1, 1, 0, 0, 2],    // Round 21: Double pairs plus extra
  [0, 1, 2, 3, 2, 1, 0, 3, 1, 2], // Round 22: Ten mixed
  [3, 3, 2, 2, 1, 1, 0, 0, 3, 2], // Round 23: Double pairs finale
  [0, 1, 2, 3, 3, 2, 1, 0, 0, 1, 2], // Round 24: Eleven with double
  [3, 2, 1, 0, 0, 1, 2, 3, 3, 2, 1, 0] // Round 25: Grand finale
  */
];

const PatternGame = () => {
  const [gameState, setGameState] = useState('idle');
  const [round, setRound] = useState(0);
  const [currentPattern, setCurrentPattern] = useState([]);
  const [playerInputs, setPlayerInputs] = useState([]);
  const [activeShape, setActiveShape] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const playSound = (shapeId) => {
    if (audioElements[shapeId]) {
      audioElements[shapeId].currentTime = 0; // Reset sound to start
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
    // Reset all game state
    setGameState('showing');
    setRound(0);
    setPlayerInputs([]);
    setCurrentPattern([]);
    setActiveShape(null);
    
    // Small delay before starting
    await sleep(500);
    
    // Start with first pattern
    const firstPattern = PATTERNS[0];
    setCurrentPattern(firstPattern);
    
    // Show first pattern
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

    // Visual feedback and sound
    setActiveShape(shapeId);
    playSound(shapeId);
    await sleep(200);
    setActiveShape(null);

    const newInputs = [...playerInputs, shapeId];
    setPlayerInputs(newInputs);

    // Check if incorrect
    if (shapeId !== currentPattern[playerInputs.length]) {
      FAILURE_SOUND.play();
      setGameState('failure');
      setShowModal(true);
      return;
    }

    // Check if round complete
    if (newInputs.length === currentPattern.length) {
      if (round === PATTERNS.length - 1) {
        VICTORY_SOUND.play();
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