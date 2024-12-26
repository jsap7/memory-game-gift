'use client';

import React from 'react';

const WinPopup = ({ turns, onPlayAgain }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
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