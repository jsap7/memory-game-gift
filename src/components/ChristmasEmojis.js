'use client';

import React, { useState, useEffect } from 'react';

// Generate emoji positions once, outside the component
const generateEmojiPositions = () => {
  const emojis = ['🎄', '🎅', '🎁', '⛄', '🦌', '🔔', '❄️', '✨'];
  const positions = [];
  
  // Generate 50 emojis
  for (let i = 0; i < 50; i++) {
    positions.push({
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: 2 + Math.random() * 96,
      y: 2 + Math.random() * 96,
    });
  }
  
  return positions;
};

const ChristmasEmoji = ({ emoji, position, shouldBounce }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (shouldBounce) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [shouldBounce]);

  return (
    <div
      className={`absolute transition-transform ${isAnimating ? 'animate-bounce' : ''}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        fontSize: '24px',
        opacity: 0.7,
      }}
    >
      {emoji}
    </div>
  );
};

const ChristmasEmojis = ({ onCardFlip }) => {
  const [emojiPositions, setEmojiPositions] = useState([]);
  const [shouldBounce, setShouldBounce] = useState(false);

  useEffect(() => {
    // Generate positions only on client-side
    setEmojiPositions(generateEmojiPositions());
  }, []);

  useEffect(() => {
    if (onCardFlip) {
      setShouldBounce(prev => !prev);
    }
  }, [onCardFlip]);

  if (emojiPositions.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none">
      {emojiPositions.map((pos, index) => (
        <ChristmasEmoji
          key={index}
          emoji={pos.emoji}
          position={pos}
          shouldBounce={shouldBounce}
        />
      ))}
    </div>
  );
};

export default ChristmasEmojis; 