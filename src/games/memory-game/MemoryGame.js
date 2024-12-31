'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import WinPopup from './WinPopup';
import styles from './MemoryGame.module.css';

const MemoryGame = () => {
  const cardImages = [
    { id: 1, img: '/games/memory/images/image1.png', matched: false },
    { id: 2, img: '/games/memory/images/image2.png', matched: false },
    { id: 3, img: '/games/memory/images/image3.png', matched: false },
    { id: 4, img: '/games/memory/images/image4.png', matched: false },
    { id: 5, img: '/games/memory/images/image5.png', matched: false },
    { id: 6, img: '/games/memory/images/image6.png', matched: false },
    { id: 7, img: '/games/memory/images/image7.png', matched: false },
    { id: 8, img: '/games/memory/images/image8.png', matched: false },
    { id: 9, img: '/games/memory/images/image9.png', matched: false },
    { id: 10, img: '/games/memory/images/image10.png', matched: false },
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
    const shuffledCards = [...cardImages, ...cardImages]
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
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
          </h1>
          <div className={styles.stats}>
            Turns: {turns}
          </div>
          <button 
            onClick={shuffleCards}
            className={styles.button}
          >
            New Game
          </button>
        </div>

        <div className={styles.grid}>
          {cards.map(card => (
            <div key={card.id} className={styles.card}>
              <div
                className={`${styles.cardInner} ${isFlipped(card) ? styles.flipped : ''}`}
                onClick={() => !card.matched && handleChoice(card)}
              >
                <div className={styles.cardFront}>
                  <img
                    src={card.img}
                    alt="Memory Card"
                    loading="eager"
                  />
                </div>
                <div className={styles.cardBack}>
                  <Heart className="w-8 h-8 text-pink-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
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