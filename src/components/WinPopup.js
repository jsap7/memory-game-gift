'use client';

import React, { useEffect, useState } from 'react';

const generateConfetti = () => {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  const particles = [];

  for (let i = 0; i < 50; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100,
      y: -20,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 3 + Math.random() * 4,
      speed: 2 + Math.random() * 2,
      angle: -30 + Math.random() * 60,
    });
  }

  return particles;
};

const Confetti = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setParticles(generateConfetti());
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.color,
            transform: `rotate(${particle.angle}deg)`,
            animationDuration: `${1 + Math.random() * 2}s`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
};

const WinPopup = ({ turns, onPlayAgain }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <Confetti />
      <div className="bg-white rounded-lg p-4 sm:p-6 text-center max-w-xs sm:max-w-sm mx-auto relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-3 sm:mb-4">🎉 You Won! 🎉</h2>
        <p className="text-base sm:text-lg mb-4 sm:mb-6">
          Congratulations! You completed the game in <span className="font-bold text-pink-600">{turns} turns</span>!
        </p>
        <button
          onClick={onPlayAgain}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default WinPopup; 