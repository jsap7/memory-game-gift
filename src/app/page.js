'use client';

import Link from 'next/link';
import FlipTimer from '@/games/memory-game/FlipTimer';

export default function Home() {
  return (
    <div className="app-container">
      <div className="content-wrapper">
        <FlipTimer />
        
        <h1 className="page-title slide-up">Gigi's Games</h1>
        
        <div className="games-grid fade-in">
          <Link href="/games/memory" className="game-card">
            <h2>Remy Memy Game</h2>
            <p>Match pairs of cute pictures in this memory challenge!</p>
          </Link>
          
          <Link href="/games/quiz" className="game-card">
            <h2>Josh Quiz Game</h2>
            <p>Test your knowledge with fun trivia questions.</p>
          </Link>
          
          <Link href="/games/pattern" className="game-card">
            <h2>Pattern Game</h2>
            <p>Follow the sequence and repeat the pattern.</p>
          </Link>
          
          <Link href="/games/wordle" className="game-card">
            <h2>Wordle</h2>
            <p>Guess the five-letter word in six tries or less.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
