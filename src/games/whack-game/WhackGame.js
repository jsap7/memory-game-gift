'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './WhackGame.module.css';

const GAME_DURATION = 30;
const GRID_SIZE = 9;

const EMOJIS = [
  { symbol: '😊', points: 1, probability: 0.4, duration: 3000 },
  { symbol: '🌟', points: 2, probability: 0.25, duration: 2500 },
  { symbol: '💎', points: 3, probability: 0.15, duration: 2000 },
  { symbol: '👑', points: 5, probability: 0.05, duration: 1500 },
  { symbol: '😈', points: -5, probability: 0.08, duration: 2000 },
  { symbol: '💣', points: -10, probability: 0.07, duration: 1500 }
];

export default function WhackGame() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [activeHoles, setActiveHoles] = useState(new Array(GRID_SIZE).fill(null));
  const [isPlaying, setIsPlaying] = useState(false);
  const [pointsAnimation, setPointsAnimation] = useState(null);

  // Add a reference to the frame
  const frameRef = useRef(null);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setActiveHoles(new Array(GRID_SIZE).fill(null));
    setIsPlaying(true);
  };

  const handleWhack = (index, event) => {
    if (!isPlaying || !activeHoles[index]) return;

    const points = activeHoles[index].points;
    
    // Position under the title, moved down a bit more
    const x = window.innerWidth / 2;
    const y = 340; // Moved down from 320 to 340

    // Clear this hole first
    setActiveHoles(prev => {
      const newHoles = [...prev];
      newHoles[index] = null;
      return newHoles;
    });

    // Update score
    setScore(prev => prev + points);
    
    // Always show animation with unique ID
    const animationId = Date.now() + Math.random(); // Added randomness to ensure uniqueness
    setPointsAnimation({
      points,
      x,
      y,
      id: animationId,
      isNegative: points < 0
    });

    // Clear the animation after it's done
    setTimeout(() => {
      setPointsAnimation(prev => {
        if (prev?.id === animationId) {
          return null;
        }
        return prev;
      });
    }, 500); // Shortened to match CSS animation duration
  };

  // Timer effect
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Emoji pop-up effect
  useEffect(() => {
    if (!isPlaying) return;

    const timeouts = [];

    const spawnEmoji = () => {
      setActiveHoles(prev => {
        const newHoles = [...prev];
        const emptyHoles = newHoles.map((hole, index) => hole === null ? index : -1).filter(index => index !== -1);
        if (emptyHoles.length === 0) return newHoles;

        const holeIndex = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];
        
        const random = Math.random();
        let cumulativeProbability = 0;
        const selectedEmoji = EMOJIS.find(emoji => {
          cumulativeProbability += emoji.probability;
          return random <= cumulativeProbability;
        }) || EMOJIS[0];

        const emojiData = {
          ...selectedEmoji,
          timestamp: Date.now()
        };
        newHoles[holeIndex] = emojiData;

        // Schedule removal
        const timeout = setTimeout(() => {
          setActiveHoles(current => {
            const updatedHoles = [...current];
            // Only remove if it's the same emoji instance
            if (updatedHoles[holeIndex]?.timestamp === emojiData.timestamp) {
              // Add disappearing class first
              updatedHoles[holeIndex] = {
                ...updatedHoles[holeIndex],
                isDisappearing: true
              };
              // Then remove after animation
              setTimeout(() => {
                setActiveHoles(latest => {
                  const finalHoles = [...latest];
                  if (finalHoles[holeIndex]?.timestamp === emojiData.timestamp) {
                    finalHoles[holeIndex] = null;
                  }
                  return finalHoles;
                });
              }, 300); // Match the CSS transition duration
            }
            return updatedHoles;
          });
        }, selectedEmoji.duration);

        timeouts.push(timeout);
        return newHoles;
      });
    };

    // Spawn 1-3 emojis every second
    const spawnInterval = setInterval(() => {
      const numEmojis = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numEmojis; i++) {
        spawnEmoji();
      }
    }, 1000);

    return () => {
      clearInterval(spawnInterval);
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isPlaying]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.score}>Score: {score}</div>
        <div className={styles.timer}>Time: {timeLeft}s</div>
      </div>

      {!isPlaying && timeLeft === GAME_DURATION && (
        <button className={styles.startButton} onClick={startGame}>
          Start Game
        </button>
      )}

      {!isPlaying && timeLeft === 0 && (
        <div className={styles.gameOver}>
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          <button className={styles.startButton} onClick={startGame}>
            Play Again
          </button>
        </div>
      )}

      <div className={styles.grid}>
        {activeHoles.map((hole, index) => (
          <div
            key={index}
            className={`${styles.hole} ${hole ? styles.active : ''}`}
            onClick={(event) => handleWhack(index, event)}
          >
            {hole && (
              <div className={`${styles.emoji} ${hole.isDisappearing ? styles.disappearing : ''}`}>
                {hole.symbol}
              </div>
            )}
          </div>
        ))}
      </div>

      {pointsAnimation && (
        <div 
          className={`${styles.pointsAnimation} ${pointsAnimation.isNegative ? styles.negative : ''}`}
          style={{ 
            left: pointsAnimation.x,
            top: pointsAnimation.y
          }}
        >
          {pointsAnimation.points > 0 ? '+' : ''}{pointsAnimation.points}
        </div>
      )}
    </div>
  );
} 