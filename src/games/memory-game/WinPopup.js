'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import styles from './MemoryGame.module.css';

// WinPopup.js

const WinPopup = ({ turns, onPlayAgain }) => {
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-[90%] text-center shadow-2xl border-4 border-pink-300 transform scale-100 animate-[pop_0.3s_ease-out]">
        <div className="flex justify-center items-center gap-3 mb-6">
          <Heart className="w-10 h-10 text-pink-500 animate-bounce" />
          <Heart className="w-10 h-10 text-pink-500 animate-bounce [animation-delay:150ms]" />
        </div>
        <h2 className="text-4xl font-bold text-pink-500 mb-6">
          You Won!
        </h2>
        <p className="text-xl mb-8 text-gray-700">
          Congratulations! You completed the game in <span className="font-bold text-pink-500">{turns} turns</span>!
        </p>
        <button
          onClick={onPlayAgain}
          className={`${styles.button} text-xl px-8 py-3 min-w-[200px]`}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default WinPopup; 