'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './CrosswordGame.module.css';

// Import the generator properly
const clg = require('crossword-layout-generator');

// Words we want to include
const words = [
  { answer: 'MANCITY', clue: "Josh's favorite Premier League team" },
  { answer: 'FODEN', clue: "Josh's favorite player" },
  { answer: 'AGUERO', clue: "City's top scorer" },
  { answer: 'ENGLAND', clue: "Where Premier League is played" },
  { answer: 'UNITED', clue: "City's rival" },
  { answer: 'LEAGUE', clue: "Competition type" },
  { answer: 'BLUE', clue: "City's color" }
];

const formatTime = (seconds) => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const secs = seconds % 60;
  return { days, hours, minutes, secs };
};

const CrosswordGame = () => {
  const [layout, setLayout] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedClue, setSelectedClue] = useState(null);
  const [selectedCell, setSelectedCell] = useState({ clueId: null, position: 0 });
  const [completed, setCompleted] = useState(false);
  const [gridSize, setGridSize] = useState({ width: 0, height: 0 });
  const [timer, setTimer] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const inputRefs = useRef({});
  const timerRef = useRef(null);

  useEffect(() => {
    try {
      // Generate the layout using the library
      const result = clg.generateLayout(words);
      
      // Filter out words that weren't placed (orientation === "none")
      const placedWords = result.result.filter(word => word.orientation !== "none");
      
      // Calculate grid size
      const maxX = Math.max(...placedWords.map(w => w.startx + (w.orientation === 'across' ? w.answer.length : 1)));
      const maxY = Math.max(...placedWords.map(w => w.starty + (w.orientation === 'down' ? w.answer.length : 1)));
      
      setGridSize({ width: maxX, height: maxY });
      setLayout(placedWords);

      // Initialize answers with correct length arrays
      const initialAnswers = {};
      placedWords.forEach(entry => {
        initialAnswers[entry.position] = Array(entry.answer.length).fill('');
      });
      setUserAnswers(initialAnswers);
      
      // Start the timer
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    } catch (error) {
      console.error('Error generating crossword:', error);
    }
  }, []);

  useEffect(() => {
    if (completed && timerRef.current) {
      clearInterval(timerRef.current);
      setShowModal(true);
    }
  }, [completed]);

  const checkCompletion = (answers) => {
    if (!layout) return false;
    
    console.log('Checking all words:');
    let correctCount = 0;
    const totalWords = layout.length;
    const requiredCorrect = 5; // Only need 5 out of 7 words to win

    for (const entry of layout) {
      const userAnswerArray = answers[entry.position] || Array(entry.answer.length).fill('');
      const userAnswer = userAnswerArray.join('').toUpperCase();
      const correctAnswer = entry.answer.toUpperCase();
      
      // More lenient comparison - ignore empty cells
      const isWordCorrect = userAnswer.length > 0 && userAnswer === correctAnswer;
      
      console.log(`Word ${entry.position} (${entry.orientation}): "${userAnswer}" === "${correctAnswer}" -> ${isWordCorrect}`);
      
      if (isWordCorrect) {
        correctCount++;
      }
    }

    console.log(`Words correct: ${correctCount}/${totalWords} (need ${requiredCorrect})`);
    return correctCount >= requiredCorrect;
  };

  const focusCell = (clueId, position) => {
    const key = `${clueId}-${position}`;
    const input = inputRefs.current[key];
    if (input) {
      input.focus();
    }
  };

  const handleInputChange = (clueId, position, value) => {
    const letter = value.toUpperCase();
    if (letter.match(/[A-Z]/) || letter === '') {
      setUserAnswers(prev => {
        const newAnswers = { ...prev };
        const entry = layout.find(e => e.position === clueId);
        if (!newAnswers[clueId] || newAnswers[clueId].length !== entry.answer.length) {
          newAnswers[clueId] = Array(entry.answer.length).fill('');
        }
        newAnswers[clueId][position] = letter;

        // Check completion with the updated answers
        const isComplete = checkCompletion(newAnswers);
        if (isComplete) {
          setCompleted(true);
          setShowModal(true);
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
        }

        return newAnswers;
      });

      // Move to next cell if a letter was entered
      if (letter !== '') {
        const currentWord = layout.find(entry => entry.position === clueId);
        if (position < currentWord.answer.length - 1) {
          focusCell(clueId, position + 1);
        }
      }
    }
  };

  const handleKeyDown = (clueId, position, e) => {
    const currentWord = layout.find(entry => entry.position === clueId);
    
    switch (e.key) {
      case 'ArrowRight':
        if (currentWord.orientation === 'across' && position < currentWord.answer.length - 1) {
          focusCell(clueId, position + 1);
        }
        break;
      case 'ArrowLeft':
        if (currentWord.orientation === 'across' && position > 0) {
          focusCell(clueId, position - 1);
        }
        break;
      case 'ArrowDown':
        if (currentWord.orientation === 'down' && position < currentWord.answer.length - 1) {
          focusCell(clueId, position + 1);
        }
        break;
      case 'ArrowUp':
        if (currentWord.orientation === 'down' && position > 0) {
          focusCell(clueId, position - 1);
        }
        break;
      case 'Backspace':
        if (userAnswers[clueId][position] === '' && position > 0) {
          focusCell(clueId, position - 1);
        }
        break;
    }
  };

  const handleClueClick = (clueId) => {
    setSelectedClue(clueId);
    focusCell(clueId, 0);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  if (!layout) {
    return <div className={styles.loading}>Generating crossword...</div>;
  }

  const time = formatTime(timer);

  return (
    <div className={styles.container}>
      <div className={styles.timer}>
        <div className={styles.timerBlock}>
          <span className={styles.timerDigit}>{String(time.days).padStart(2, '0')}</span>
          <span className={styles.timerLabel}>DAYS</span>
        </div>
        <div className={styles.timerBlock}>
          <span className={styles.timerDigit}>{String(time.hours).padStart(2, '0')}</span>
          <span className={styles.timerLabel}>HOURS</span>
        </div>
        <div className={styles.timerBlock}>
          <span className={styles.timerDigit}>{String(time.minutes).padStart(2, '0')}</span>
          <span className={styles.timerLabel}>MINS</span>
        </div>
        <div className={styles.timerBlock}>
          <span className={styles.timerDigit}>{String(time.secs).padStart(2, '0')}</span>
          <span className={styles.timerLabel}>SECS</span>
        </div>
      </div>

      <div className={styles.gameLayout}>
        <div 
          className={styles.grid}
          style={{
            width: `${gridSize.width * 42}px`,
            height: `${gridSize.height * 42}px`
          }}
        >
          {layout.map(entry => (
            <div 
              key={entry.position}
              className={`${styles.word} ${styles[entry.orientation]}`}
              style={{
                top: `${(entry.starty - 1) * 40}px`,
                left: `${(entry.startx - 1) * 40}px`,
                width: entry.orientation === 'across' ? `${entry.answer.length * 40}px` : '40px',
                height: entry.orientation === 'down' ? `${entry.answer.length * 40}px` : '40px'
              }}
            >
              <div className={styles.number}>{entry.position}</div>
              {Array.from({ length: entry.answer.length }).map((_, i) => (
                <input
                  key={i}
                  ref={el => inputRefs.current[`${entry.position}-${i}`] = el}
                  type="text"
                  maxLength={1}
                  value={userAnswers[entry.position]?.[i] || ''}
                  onChange={(e) => handleInputChange(entry.position, i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(entry.position, i, e)}
                  className={`${styles.cell} ${selectedClue === entry.position ? styles.selected : ''}`}
                />
              ))}
            </div>
          ))}
        </div>

        <div className={styles.clues}>
          <div className={styles.clueSection}>
            <h3>Across</h3>
            {layout
              .filter(e => e.orientation === 'across')
              .sort((a, b) => a.position - b.position)
              .map(entry => (
                <div
                  key={entry.position}
                  className={`${styles.clue} ${selectedClue === entry.position ? styles.selected : ''}`}
                  onClick={() => handleClueClick(entry.position)}
                >
                  {entry.position}. {entry.clue}
                </div>
              ))}
          </div>

          <div className={styles.clueSection}>
            <h3>Down</h3>
            {layout
              .filter(e => e.orientation === 'down')
              .sort((a, b) => a.position - b.position)
              .map(entry => (
                <div
                  key={entry.position}
                  className={`${styles.clue} ${selectedClue === entry.position ? styles.selected : ''}`}
                  onClick={() => handleClueClick(entry.position)}
                >
                  {entry.position}. {entry.clue}
                </div>
              ))}
          </div>
        </div>
      </div>
      
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>🎉 Congratulations!</h2>
            <p>You've completed the crossword in:</p>
            <div className={styles.completionTime}>
              {time.days > 0 && <span>{time.days} days </span>}
              {time.hours > 0 && <span>{time.hours} hours </span>}
              {time.minutes > 0 && <span>{time.minutes} minutes </span>}
              <span>{time.secs} seconds</span>
            </div>
            <button onClick={handleModalClose} className={styles.modalButton}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrosswordGame; 