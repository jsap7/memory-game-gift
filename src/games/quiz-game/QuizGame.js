'use client';

import React, { useState } from 'react';
import styles from './QuizGame.module.css';

// Sample questions - we can move this to a separate file later
const questions = [
  {
    id: 1,
    question: "What were you asked to hold?",
    image: "/assets/holdit.jpg", // Optional image
    options: [
      "Jacket",
      "Pool Stick",
      "Hat",
      "Drink"
    ],
    correctAnswer: 2, // Index of correct answer
    explanation: "Brendan asked you to hold his hat, and I said 'Hold it bitch!'" // Optional explanation

  },
  {
    id: 2,
    question: "What was the first movie we watched together (that you didnt fall asleep for)?",
    image: "/assets/nwoo.jpg", // Optional image
    options: [
      "Interstellar",
      "Cloudy with a Chance of Meatballs 2",
      "Cloudy with a Chance of Meatballs",
      "Happy Gilmore"
    ],
    correctAnswer: 1, // Index of correct answer
    explanation: "Nwoo racist as fuck!" // Optional explanation
  },
  {
    id: 3,
    question: "What did we share on our first date?",
    image: "/assets/salt-line.jpg", // Optional image
    options: [
      "Crab Dip",
      "Ice Cream",
      "Breadsticks",
      "Mussels"
    ],
    correctAnswer: 0, // Index of correct answer
    explanation: "That crab dip was yummy as hell!" // Optional explanation
  },

  {
    id: 4,
    question: "What was my street name in Baltimore?",
    image: "/assets/bmore.png", // Optional image
    options: [
      "Da Hood",
      "Hamburger",
      "Cross Street",
      "Hamburg"
    ],
    correctAnswer: 3, // Index of correct answer
    explanation: "Just some lowkey drug deals on that street, nbd!" // Optional explanation
  },

  {
    id: 5,
    question: "What's my go to fast food?",
    image: "/assets/fat-guy.png", // Optional image
    options: [
      "Wendys",
      "Chick-fil-a",
      "Popeyes",
      "McDonalds"
    ],
    correctAnswer: 1, // Index of correct answer
    explanation: "Mmmmm chicken in my bellyyyyy" // Optional explanation
  },

  {
    id: 6,
    question: "What were you boutta yell at me after this picture?",
    image: "/assets/enuf.png", // Optional image
    options: [
      "Stawppp Joshhhh",
      "Grrrrrr",
      "ENUF!",
      "hehehehehe"
    ],
    correctAnswer: 2, // Index of correct answer
    explanation: "ENUFFFFFFF" // Optional explanation
  },

  
  {
    id: 7,
    question: "What was the species of the cool clownfish I had?",
    image: "/assets/blackstorm.jpg", // Optional image
    options: [
      "Clownfish",
      "Storm Trooper",
    "Black Storm",
    "Ur Mom LOL"
    ],
    correctAnswer: 2, // Index of correct answer
    explanation: "Black Storm is the coolest clownfish ever!" // Optional explanation
  },

  {
    id: 8,
    question: "What position did I play in soccer?",
    image: "/assets/soccer.jpg", // Optional image
    options: [
      "Left Back",
      "Right Back",
      "Center Midfield",
      "Striker"
    ],
    correctAnswer: 2, // Index of correct answer
    explanation: "Cant touch this!" // Optional explanation
  },

  {
    id: 9,
    question: "How did they spell Lovie in ur book?",
    image: "/assets/lovie.jpg", // Optional image
    options: [
      "Lovie",
      "Louis",
      "Luvie",
      "Louie"
    ],
    correctAnswer: 1, // Index of correct answer
    explanation: "Calling Lovie anything else is a hate crime!" // Optional explanation
  },

  {
    id: 10,
    question: "Who is my favorite person in the whole world?",
    image: "/assets/you.jpg", // Optional image
    options: [
      "You",
      "Me",
      "Phil Foden",
      "My Dad"
    ],
    correctAnswer: 0, // Index of correct answer
    explanation: "I love love love you so much!" // Optional explanation
  }


  // Add more questions here
];

const QuizGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (answerIndex) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  if (showResult) {
    return (
      <div className={styles.container}>
        <div className={styles.results}>
          <h2 className={styles.resultsTitle}>Quiz Complete!</h2>
          <p className={styles.resultsScore}>
            You scored {score} out of {questions.length}!
          </p>
          <button onClick={restartQuiz} className={styles.button}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.stats}>
          <span className={styles.statItem}>
            Question <span className={styles.statValue}>{currentQuestion + 1}</span> of <span className={styles.statValue}>{questions.length}</span>
          </span>
          <span className={styles.statItem}>
            Score: <span className={styles.statValue}>{score}</span>
          </span>
        </div>
      </div>

      <div className={styles.questionContainer}>
        <h2 className={styles.question}>{question.question}</h2>
        
        {question.image && (
          <div className={styles.imageContainer}>
            <img
              src={question.image}
              alt="Question"
              className={styles.image}
            />
          </div>
        )}

        <div className={styles.optionsGrid}>
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
              className={`${styles.option} ${
                selectedAnswer !== null && index === question.correctAnswer
                  ? styles.correct
                  : selectedAnswer === index && index !== question.correctAnswer
                  ? styles.incorrect
                  : ''
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {showExplanation && (
          <div className={styles.explanation}>
            <h3 className={styles.explanationTitle}>
              {selectedAnswer === question.correctAnswer ? '🎉 Correct!' : '😅 Oops!'}
            </h3>
            <p className={styles.explanationText}>{question.explanation}</p>
            <button onClick={handleNext} className={styles.button}>
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGame; 