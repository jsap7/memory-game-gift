'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// State data
const statesList = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' }, { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }
];

// Dynamically import the Map component with SSR disabled
const GameMap = dynamic(() => import('./game-map'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      height: '600px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px'
    }}>
      Loading map...
    </div>
  )
});

export default function StatesGame() {
  const [time, setTime] = useState(0);
  const [currentState, setCurrentState] = useState(null);
  const [gameStatus, setGameStatus] = useState('ready'); // ready, playing, gameOver
  const [feedback, setFeedback] = useState('');
  const [remainingStates, setRemainingStates] = useState([]);
  const [correctGuesses, setCorrectGuesses] = useState([]);
  const [showPenalty, setShowPenalty] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval;
    if (gameStatus === 'playing') {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStatus]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const shuffleStates = useCallback(() => {
    return [...statesList].sort(() => Math.random() - 0.5);
  }, []);

  const startGame = () => {
    setTime(0);
    setRemainingStates(shuffleStates());
    setGameStatus('playing');
    setFeedback('');
    setCorrectGuesses([]);
  };

  const nextState = useCallback(() => {
    if (remainingStates.length === 0) {
      setGameStatus('gameOver');
      setCurrentState(null);
      return;
    }
    
    const nextStates = [...remainingStates];
    const next = nextStates.pop();
    setRemainingStates(nextStates);
    setCurrentState(next);
    setFeedback('');
  }, [remainingStates]);

  useEffect(() => {
    if (gameStatus === 'playing' && !currentState) {
      nextState();
    }
  }, [gameStatus, currentState, nextState]);

  const handleStateClick = useCallback((stateCode) => {
    if (gameStatus !== 'playing' || !currentState) return;

    if (stateCode === currentState.code) {
      setFeedback('Correct!');
      setCorrectGuesses(prev => [...prev, currentState.code]);
      setTimeout(() => {
        nextState();
      }, 1000);
    } else {
      setTime(prev => prev + 5);
      setShowPenalty(true);
      setFeedback(`Wrong! That was ${statesList.find(s => s.code === stateCode)?.name}`);
      
      setTimeout(() => {
        setShowPenalty(false);
      }, 1000);
    }
  }, [currentState, gameStatus, nextState]);

  return (
    <div className="game-container">
      <Link href="/" className="back-button">
        ← Back to Games
      </Link>

      <div className="game-header">
        <h1>State Guesser</h1>
        <div className="game-stats">
          <div className="time">Time: {formatTime(time)}</div>
          <div className="states-remaining">States Remaining: {remainingStates.length}</div>
        </div>
      </div>

      {gameStatus === 'ready' && (
        <div className="game-message">
          <h2>How to Play</h2>
          <p>Find all states as quickly as you can! Wrong guesses add a 5-second penalty.</p>
          <button className="start-button" onClick={startGame}>Start Game</button>
        </div>
      )}

      {gameStatus === 'playing' && currentState && (
        <div className="game-play">
          <div className="target-state">Find: {currentState.name}</div>
          {feedback && <div className={`feedback ${feedback.includes('Correct') ? 'correct' : 'wrong'}`}>{feedback}</div>}
        </div>
      )}

      {gameStatus === 'gameOver' && (
        <div className="game-message">
          <h2>Game Over!</h2>
          <p>Final Time: {formatTime(time)}</p>
          <button className="start-button" onClick={startGame}>Play Again</button>
        </div>
      )}

      <div className="map-container">
        <GameMap 
          onStateClick={handleStateClick} 
          correctGuesses={correctGuesses}
          gameStatus={gameStatus}
        />
      </div>

      {showPenalty && (
        <div className="penalty-flash">
          +5 SECOND PENALTY
        </div>
      )}

      <style jsx>{`
        .game-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .back-button {
          display: inline-block;
          padding: 0.5rem 1rem;
          margin-bottom: 1rem;
          background: white;
          border-radius: 8px;
          color: #333;
          text-decoration: none;
          font-weight: 500;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s ease;
        }

        .back-button:hover {
          transform: translateX(-2px);
        }

        .game-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .game-header h1 {
          font-size: 2.5rem;
          color: #333;
          margin: 0 0 1rem 0;
        }

        .game-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          font-size: 1.2rem;
          color: #666;
        }

        .game-message {
          text-align: center;
          margin: 2rem 0;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .game-message h2 {
          margin: 0 0 1rem 0;
          color: #333;
        }

        .game-message p {
          color: #666;
          margin-bottom: 1.5rem;
        }

        .start-button {
          padding: 0.8rem 2rem;
          font-size: 1.1rem;
          background: linear-gradient(135deg, #2196F3 0%, #00BCD4 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .start-button:hover {
          transform: translateY(-2px);
        }

        .game-play {
          text-align: center;
          margin-bottom: 2rem;
        }

        .target-state {
          font-size: 2rem;
          color: #333;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .feedback {
          font-size: 1.2rem;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          display: inline-block;
          font-weight: 500;
          animation: slideIn 0.3s ease-out;
        }

        .feedback.correct {
          background: #E8F5E9;
          color: #2E7D32;
        }

        .feedback.wrong {
          background: #FFEBEE;
          color: #C62828;
          border: 2px solid #EF5350;
          animation: shake 0.5s ease-in-out;
        }

        .map-container {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .penalty-flash {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(198, 40, 40, 0.95);
          color: white;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: bold;
          font-size: 1.2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          animation: penaltyFlash 1s ease-out;
        }

        @keyframes penaltyFlash {
          0% { 
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          15% { 
            transform: translate(-50%, 0);
            opacity: 1;
          }
          85% { 
            transform: translate(-50%, 0);
            opacity: 1;
          }
          100% { 
            transform: translate(-50%, -100%);
            opacity: 0;
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes slideIn {
          0% { transform: translateY(-10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @media (max-width: 768px) {
          .game-container {
            padding: 1rem;
          }

          .game-header h1 {
            font-size: 2rem;
          }

          .game-stats {
            flex-direction: column;
            gap: 0.5rem;
          }

          .target-state {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
} 