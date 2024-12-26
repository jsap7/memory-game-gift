'use client';

import React, { useState } from 'react';
import { Heart } from 'lucide-react';

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
    image: "/assets/meandyou.jpg", // Optional image
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
    // Explanation popup will be closed by user clicking "Next"
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
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-pink-600 mb-4 text-center">Quiz Complete!</h2>
        <p className="text-lg text-center mb-6">
          You scored <span className="font-bold text-pink-600">{score}</span> out of{" "}
          <span className="font-bold text-pink-600">{questions.length}</span>!
        </p>
        <div className="text-center">
          <button
            onClick={restartQuiz}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-pink-600 flex items-center justify-center gap-2 mb-2">
          <Heart className="text-pink-500" />
          Joshy's Quiz
          <Heart className="text-pink-500" />
        </h1>
        <div className="flex justify-center items-center gap-4">
          <p className="text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <p className="text-pink-600 font-semibold">
            Score: {score}
          </p>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{question.question}</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col items-center">
          {question.image && (
            <div className="w-full flex justify-center mb-6">
              <div className="relative w-full max-w-md flex justify-center">
                <img
                  src={question.image}
                  alt="Question"
                  className="h-[250px] w-auto object-contain"
                />
              </div>
            </div>
          )}

          <div className="w-full max-w-md grid grid-cols-1 gap-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`p-3 rounded-lg text-center transition-colors ${
                  selectedAnswer === null
                    ? 'bg-white hover:bg-pink-50 text-pink-600 border-2 border-pink-200'
                    : selectedAnswer === index
                    ? index === question.correctAnswer
                      ? 'bg-green-500 text-white border-2 border-green-600'
                      : 'bg-red-500 text-white border-2 border-red-600'
                    : index === question.correctAnswer
                    ? 'bg-green-500 text-white border-2 border-green-600'
                    : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-6 w-full max-w-md">
              <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-4">
                <p className="text-xl font-bold text-pink-600 mb-2 text-center">
                  {selectedAnswer === question.correctAnswer ? '🎉 Correct!' : '😅 Oops!'}
                </p>
                <p className="text-lg text-pink-700 text-center mb-4">{question.explanation}</p>
                <div className="text-center">
                  <button
                    onClick={handleNext}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full transition-colors"
                  >
                    {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizGame; 