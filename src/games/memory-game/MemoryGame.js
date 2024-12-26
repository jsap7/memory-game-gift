'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import WinPopup from './WinPopup';

const MemoryGame = () => {
  const initialCards = [
    { id: 1, img: '/assets/image1.png', matched: false },
    { id: 2, img: '/assets/image2.png', matched: false },
    { id: 3, img: '/assets/image3.png', matched: false },
    { id: 4, img: '/assets/image4.png', matched: false },
    { id: 5, img: '/assets/image5.png', matched: false },
    { id: 6, img: '/assets/image6.png', matched: false },
    { id: 7, img: '/assets/image7.png', matched: false },
    { id: 8, img: '/assets/image8.png', matched: false },
    { id: 9, img: '/assets/image9.png', matched: false },
    { id: 10, img: '/assets/image10.png', matched: false },
  ];

  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    shuffleCards();
  }, []);

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

  const handleChoice = (card) => {
    if (!disabled && card.id !== choiceOne?.id) {
      choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    }
  };

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
          
          if (newCards.every(card => card.matched)) {
            setTimeout(() => setHasWon(true), 500);
          }
          
          return newCards;
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

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
    <div>
      <div className="text-center mb-6">
        <h1 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4 text-pink-600 flex items-center justify-center gap-2">
          <Heart className="text-pink-500 w-4 h-4 sm:w-5 sm:h-5" />
          Remy Memy Game
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
                ${card.matched ? 'card-matched opacity-70' : ''}`}
              onClick={() => handleChoice(card)}
            >
              <div 
                className={`absolute w-full h-full backface-hidden transition-transform duration-500
                  ${isFlipped(card) ? 'rotate-y-0' : 'rotate-y-180'}`}
              >
                <img
                  src={card.img}
                  alt="Memory Card"
                  className="w-full h-full object-cover rounded-md sm:rounded-lg border border-pink-300 sm:border-2"
                  loading="eager"
                />
              </div>
              <div 
                className={`absolute w-full h-full backface-hidden transition-transform duration-500 bg-gradient-to-br from-pink-100 to-pink-200 rounded-md sm:rounded-lg border border-pink-300 sm:border-2 flex items-center justify-center
                  ${isFlipped(card) ? 'rotate-y-180' : 'rotate-y-0'}`}
              >
                <Heart className="w-8 h-8 text-pink-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center mt-3 sm:mt-4 text-sm sm:text-base text-pink-600">Turns: {turns}</p>

      {hasWon && (
        <WinPopup
          turns={turns}
          onPlayAgain={shuffleCards}
        />
      )}
    </div>
  );
};

export default MemoryGame; 