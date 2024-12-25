'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Clock } from 'lucide-react';
import Image from 'next/image';
import ChristmasEmojis from './ChristmasEmojis';
import WinPopup from './WinPopup';

const MemoryGame = () => {
  // You'll replace these with your actual image paths
  const initialCards = [
    { id: 1, img: '/assets/image1.jpg', matched: false },
    { id: 2, img: '/assets/image2.jpg', matched: false },
    { id: 3, img: '/assets/image3.jpg', matched: false },
    { id: 4, img: '/assets/image4.jpg', matched: false },
    { id: 5, img: '/assets/image5.jpg', matched: false },
    { id: 6, img: '/assets/image6.jpg', matched: false },
    { id: 7, img: '/assets/image7.jpg', matched: false },
    { id: 8, img: '/assets/image8.jpg', matched: false },
    { id: 9, img: '/assets/image9.jpg', matched: false },
    { id: 10, img: '/assets/image10.jpg', matched: false },
  ];

  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [cardFlipCount, setCardFlipCount] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  // Initialize game
  useEffect(() => {
    shuffleCards();
    // Set your trip date here
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

  // Shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...initialCards, ...initialCards]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setHasWon(false);
  };

  // Handle choice
  const handleChoice = (card) => {
    if (!disabled && card.id !== choiceOne?.id) {
      choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
      setCardFlipCount(prev => prev + 1);
    }
  };

  // Compare selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.img === choiceTwo.img) {
        setCards(prevCards => {
          const newCards = prevCards.map(card => {
            if (card.img === choiceOne.img) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
          
          // Check if all cards are matched
          if (newCards.every(card => card.matched)) {
            setHasWon(true);
          }
          
          return newCards;
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  // Reset choices & increase turn
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns + 1);
    setDisabled(false);
  };

  const isFlipped = (card) => {
    return card === choiceOne || 
           card === choiceTwo || 
           card.matched;
  };

  return (
    <>
      <ChristmasEmojis onCardFlip={cardFlipCount} />
      <div className="max-w-5xl mx-auto p-2 sm:p-4">
        {/* Countdown Timer */}
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

        {/* Game Section */}
        <div className="text-center mb-3 sm:mb-4">
          <h1 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4 text-pink-600 flex items-center justify-center gap-2">
            <Heart className="text-pink-500 w-4 h-4 sm:w-5 sm:h-5" />
            The Remy Memory Game
            <Heart className="text-pink-500 w-4 h-4 sm:w-5 sm:h-5" />
          </h1>
          <button 
            onClick={shuffleCards}
            className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md transition-colors"
          >
            New Game
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-3 card-grid">
          {cards.map(card => (
            <div key={card.id} className="aspect-square">
              <div
                className={`relative w-full h-full cursor-pointer transition-all duration-300 transform preserve-3d
                  ${card.matched ? 'scale-95 opacity-70' : ''}`}
                onClick={() => handleChoice(card)}
              >
                <div 
                  className={`absolute w-full h-full backface-hidden transition-transform duration-500
                    ${isFlipped(card) ? 'rotate-y-0' : 'rotate-y-180'}`}
                >
                  <Image
                    src={card.img}
                    alt="card front"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover rounded-md sm:rounded-lg border border-pink-300 sm:border-2"
                  />
                </div>
                <div 
                  className={`absolute w-full h-full backface-hidden transition-transform duration-500 bg-pink-100 rounded-md sm:rounded-lg border border-pink-300 sm:border-2
                    ${isFlipped(card) ? 'rotate-y-180' : 'rotate-y-0'}`}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-3 sm:mt-4 text-sm sm:text-base text-pink-600">Turns: {turns}</p>
      </div>
      {hasWon && (
        <WinPopup
          turns={turns}
          onPlayAgain={shuffleCards}
        />
      )}
    </>
  );
};

export default MemoryGame; 