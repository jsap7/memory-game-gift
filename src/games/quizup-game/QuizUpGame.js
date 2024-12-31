'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './QuizUpGame.module.css';

const QUESTION_TIME = 10; // seconds
const NEXT_QUESTION_DELAY = 5000; // 5 seconds
const MAX_POINTS = 100;
const MIN_POINTS = 50;

const questions = [
  {
    question: "Which city hosted the 2024 Summer Olympics?",
    image: "/games/quizup/images/olympics.jpg",
    options: [
      "Tokyo",
      "Paris",
      "Los Angeles",
      "London"
    ],
    correctAnswer: 1
  },
  {
    question: "Who became the most decorated U.S. gymnast in history at the 2024 Olympics?",
    image: "/games/quizup/images/simone.jpg",
    options: [
      "Gabby Douglas",
      "Simone Biles",
      "Aly Raisman",
      "Sunisa Lee"
    ],
    correctAnswer: 1
  },
  {
    question: "Which NFL team won Super Bowl LVIII in 2024?",
    image: "/games/quizup/images/chiefs.png",
    options: [
      "Kansas City Chiefs",
      "San Francisco 49ers",
      "Philadelphia Eagles",
      "Cincinnati Bengals"
    ],
    correctAnswer: 0
  },
  {
    question: "Who won the 2024 NBA Championship?",
    image: "/games/quizup/images/nba.png",
    options: [
      "Boston Celtics",
      "Denver Nuggets",
      "Los Angeles Lakers",
      "Milwaukee Bucks"
    ],
    correctAnswer: 0
  },
  {
    question: "Which country hosted the UEFA Euro 2024?",
    image: "/games/quizup/images/germany.jpg",
    options: [
      "Spain",
      "France",
      "Germany",
      "Italy"
    ],
    correctAnswer: 2
  },
  {
    question: "Which two countries co-hosted the ICC Men's T20 World Cup in 2024?",
    image: "/games/quizup/images/cricket.jpeg",
    options: [
      "Australia and New Zealand",
      "England and South Africa",
      "West Indies and the USA",
      "India and Pakistan"
    ],
    correctAnswer: 2
  },
  {
    question: "Which athlete tied for the most gold medals by a female swimmer at the 2024 Olympics?",
    image: "/games/quizup/images/ledecky.png",
    options: [
      "Missy Franklin",
      "Katie Ledecky",
      "Emma McKeon",
      "Sarah Sjöström"
    ],
    correctAnswer: 1
  },
  {
    question: "Which footballer won the Ballon d'Or in 2024?",
    image: "/games/quizup/images/rodri.jpg",
    options: [
      "Lionel Messi",
      "Erling Haaland",
      "Kylian Mbappé",
      "Rodri"
    ],
    correctAnswer: 3
  },
  {
    question: "Who won the U.S. Presidential election in 2024?",
    image: "/games/quizup/images/trump.jpeg",
    options: [
      "Joe Biden",
      "Donald Trump",
      "Ron DeSantis",
      "Kamala Harris"
    ],
    correctAnswer: 1
  },
  {
    question: "What was the significant focus of the global climate summits in 2024?",
    image: "/games/quizup/images/carbon.jpg",
    options: [
      "Water conservation",
      "Carbon neutrality goals",
      "Renewable agriculture",
      "Ocean cleanup"
    ],
    correctAnswer: 1
  },
  {
    question: "Which artist won the Grammy Award for Album of the Year with Midnights?",
    image: "/games/quizup/images/grammys.jpeg",
    options: [
      "Adele",
      "Taylor Swift",
      "Harry Styles",
      "Billie Eilish"
    ],
    correctAnswer: 1
  },
  {
    question: "What movie featured Andrew Garfield and became a meme for its curious imagery?",
    image: "/games/quizup/images/garfield.jpg",
    options: [
      "Oppenheimer",
      "We Live in Time",
      "The Social Network 2",
      "Spiderman: No Way Home"
    ],
    correctAnswer: 1
  },
  {
    question: "What word was chosen as the 2024 Word of the Year?",
    image: "/games/quizup/images/brain.jpg",
    options: [
      "Chill",
      "Brain rot",
      "Flex",
      "Drama"
    ],
    correctAnswer: 1
  },
  {
    question: "What major NASA mission in 2024 involved orbiting the Moon with a crew?",
    image: "/games/quizup/images/artemis.jpg",
    options: [
      "Voyager II",
      "Artemis II",
      "Apollo Redux",
      "Lunar Pathfinder"
    ],
    correctAnswer: 1
  },
  {
    question: "What technological breakthrough shaped work and creativity in 2024?",
    image: "/games/quizup/images/AI.jpg",
    options: [
      "VR headsets",
      "Fusion energy",
      "Advancements in AI",
      "Blockchain innovations"
    ],
    correctAnswer: 2
  }
];

const PointsAnimation = ({ points, position }) => {
  return (
    <div 
      className={styles.pointsAnimation}
      style={{
        left: position.x,
        top: position.y
      }}
    >
      +{points}
    </div>
  );
};

const QuizUpGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [pointsAnimation, setPointsAnimation] = useState(null);

  const calculatePoints = useCallback((timeRemaining) => {
    // Logarithmic scaling between MAX_POINTS and MIN_POINTS based on time remaining
    const points = Math.round(
      MIN_POINTS + (MAX_POINTS - MIN_POINTS) * (Math.log(timeRemaining + 1) / Math.log(QUESTION_TIME + 1))
    );
    return Math.max(MIN_POINTS, Math.min(MAX_POINTS, points));
  }, []);

  const handleAnswer = useCallback((answerIndex, event) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(answerIndex);

    const correct = answerIndex === questions[currentQuestion].correctAnswer;
    if (correct) {
      const points = calculatePoints(timeLeft);
      setScore(prevScore => prevScore + points);
      
      // Show points animation
      const rect = event.currentTarget.getBoundingClientRect();
      setPointsAnimation({
        points,
        position: {
          x: rect.left + (rect.width / 2) - 20,
          y: rect.top - 10
        }
      });

      // Clear animation after it completes
      setTimeout(() => {
        setPointsAnimation(null);
      }, 1000);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setTimeLeft(QUESTION_TIME);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setGameOver(true);
      }
    }, NEXT_QUESTION_DELAY);
  }, [currentQuestion, timeLeft, isAnswered, calculatePoints]);

  // Timer effect
  useEffect(() => {
    if (isAnswered || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          handleAnswer(-1); // Force timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnswered, gameOver, handleAnswer]);

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(QUESTION_TIME);
    setSelectedAnswer(null);
    setGameOver(false);
    setIsAnswered(false);
  };

  if (gameOver) {
    return (
      <div className={styles.container}>
        <div className={styles.gameOver}>
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          <button onClick={restartGame} className={styles.button}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progressPercentage = (timeLeft / QUESTION_TIME) * 100;

  return (
    <div className={styles.container}>
      {pointsAnimation && (
        <PointsAnimation 
          points={pointsAnimation.points}
          position={pointsAnimation.position}
        />
      )}
      
      <div className={styles.header}>
        <div className={styles.score}>Score: {score}</div>
        <div className={styles.questionCounter}>
          Question {currentQuestion + 1}/{questions.length}
        </div>
      </div>

      <div className={styles.timerBar}>
        <div 
          className={styles.timerProgress} 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className={styles.questionContainer}>
        <h2 className={styles.question}>{question.question}</h2>
        
        <div className={styles.imageContainer}>
          <img
            src={question.image}
            alt="Question"
            className={styles.image}
          />
        </div>

        <div className={styles.optionsGrid}>
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={(e) => handleAnswer(index, e)}
              disabled={isAnswered}
              className={`${styles.option} ${
                isAnswered && index === question.correctAnswer
                  ? styles.correct
                  : isAnswered && index === selectedAnswer && index !== question.correctAnswer
                  ? styles.incorrect
                  : ''
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizUpGame; 