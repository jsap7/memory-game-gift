'use client'

import { useState, useEffect } from 'react'
import styles from './WordleGame.module.css'

const WORD_LENGTH = 5
const MAX_ATTEMPTS = 6
const INITIAL_BOARD = Array(MAX_ATTEMPTS).fill().map(() => Array(WORD_LENGTH).fill(''))
const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
]

// Simplified word list with common 5-letter words
const WORDS = [
  'WORLD', 'DREAM', 'SMILE', 'PEACE', 'LIGHT', 'MUSIC', 'DANCE', 'LAUGH', 'SHINE', 'SPARK',
  'BRAVE', 'GRACE', 'TRUST', 'POWER', 'HAPPY', 'SMART', 'CLEAR', 'QUICK', 'SPEED', 'SWIFT',
  'NOBLE', 'SOUND', 'NOTES', 'MOVES', 'STEPS', 'FLASH', 'FLAME', 'BLAZE', 'HEART', 'MIND'
]

export default function WordleGame() {
  const [board, setBoard] = useState(INITIAL_BOARD)
  const [currentAttempt, setCurrentAttempt] = useState(0)
  const [currentPosition, setCurrentPosition] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [targetWord, setTargetWord] = useState('')
  const [shake, setShake] = useState(false)
  const [stats, setStats] = useState({ played: 0, won: 0, streak: 0, maxStreak: 0 })

  useEffect(() => {
    const savedStats = localStorage.getItem('wordleStats')
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
    setTargetWord(WORDS[Math.floor(Math.random() * WORDS.length)])
  }, [])

  useEffect(() => {
    localStorage.setItem('wordleStats', JSON.stringify(stats))
  }, [stats])

  const handleKeyPress = (key) => {
    if (gameOver) return
    
    if (key === '⌫' || key === 'Backspace') {
      if (currentPosition > 0) {
        deleteLetter()
      }
    } else if ((key === 'ENTER' || key === 'Enter') && currentPosition === WORD_LENGTH) {
      checkWord()
    } else if (currentPosition < WORD_LENGTH && /^[A-Za-z]$/.test(key)) {
      addLetter(key)
    }
  }

  useEffect(() => {
    const handleKeyDown = (event) => handleKeyPress(event.key)
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPosition, currentAttempt, gameOver])

  const addLetter = (letter) => {
    const newBoard = [...board]
    newBoard[currentAttempt][currentPosition] = letter.toUpperCase()
    setBoard(newBoard)
    setCurrentPosition(currentPosition + 1)
  }

  const deleteLetter = () => {
    const newBoard = [...board]
    newBoard[currentAttempt][currentPosition - 1] = ''
    setBoard(newBoard)
    setCurrentPosition(currentPosition - 1)
  }

  const checkWord = () => {
    const attempt = board[currentAttempt].join('')
    
    if (attempt.length !== 5) {
      setShake(true)
      setTimeout(() => setShake(false), 250)
      return
    }

    if (attempt === targetWord) {
      setGameOver(true)
      setStats(prev => ({
        played: prev.played + 1,
        won: prev.won + 1,
        streak: prev.streak + 1,
        maxStreak: Math.max(prev.maxStreak, prev.streak + 1)
      }))
      return
    }

    if (currentAttempt === MAX_ATTEMPTS - 1) {
      setGameOver(true)
      setStats(prev => ({
        ...prev,
        played: prev.played + 1,
        streak: 0
      }))
      return
    }

    setCurrentAttempt(currentAttempt + 1)
    setCurrentPosition(0)
  }

  const getCellColor = (row, col) => {
    if (row >= currentAttempt) return styles.empty
    
    const letter = board[row][col]
    const targetLetter = targetWord[col]

    if (letter === targetLetter) {
      return styles.correct
    } else if (targetWord.includes(letter)) {
      return styles.present
    } else {
      return styles.absent
    }
  }

  const resetGame = () => {
    setBoard(Array(MAX_ATTEMPTS).fill().map(() => Array(WORD_LENGTH).fill('')))
    setCurrentAttempt(0)
    setCurrentPosition(0)
    setGameOver(false)
    setTargetWord(WORDS[Math.floor(Math.random() * WORDS.length)])
  }

  return (
    <div className={styles.container}>
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.played}</span>
          <span className={styles.statLabel}>Played</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>
            {stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0}%
          </span>
          <span className={styles.statLabel}>Win Rate</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.streak}</span>
          <span className={styles.statLabel}>Streak</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.maxStreak}</span>
          <span className={styles.statLabel}>Best</span>
        </div>
      </div>

      <div className={`${styles.board} ${shake ? styles.shake : ''}`}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((letter, colIndex) => (
              <div
                key={colIndex}
                className={`${styles.cell} ${getCellColor(rowIndex, colIndex)}`}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.keyboard}>
        {KEYBOARD_LAYOUT.map((row, i) => (
          <div key={i} className={styles.keyboardRow}>
            {row.map((key) => (
              <button
                key={key}
                className={`${styles.key} ${key.length > 1 ? styles.keyLarge : ''}`}
                onClick={() => handleKeyPress(key)}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className={styles.gameOver}>
          <p>{board[currentAttempt].join('') === targetWord ? 
            'Congratulations!' : `Game Over! The word was ${targetWord}`}</p>
          <button onClick={resetGame} className={styles.playAgain}>
            Play Again
          </button>
        </div>
      )}
    </div>
  )
} 