'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const PragueTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const tripDate = new Date('2025-01-23T00:05:00');
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = tripDate - now;
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mb-4 sm:mb-6 bg-pink-50 rounded-lg p-3 sm:p-4 shadow-md">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Clock className="text-pink-500 w-4 h-4 sm:w-5 sm:h-5" />
        <h2 className="text-lg sm:text-2xl font-bold text-pink-500">Time Until Prague!</h2>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
        <div>
          <div className="text-xl sm:text-3xl font-bold text-pink-600">{timeLeft.days}</div>
          <div className="text-xs sm:text-sm text-pink-400">Days</div>
        </div>
        <div>
          <div className="text-xl sm:text-3xl font-bold text-pink-600">{timeLeft.hours}</div>
          <div className="text-xs sm:text-sm text-pink-400">Hours</div>
        </div>
        <div>
          <div className="text-xl sm:text-3xl font-bold text-pink-600">{timeLeft.minutes}</div>
          <div className="text-xs sm:text-sm text-pink-400">Minutes</div>
        </div>
        <div>
          <div className="text-xl sm:text-3xl font-bold text-pink-600">{timeLeft.seconds}</div>
          <div className="text-xs sm:text-sm text-pink-400">Seconds</div>
        </div>
      </div>
    </div>
  );
};

export default PragueTimer; 