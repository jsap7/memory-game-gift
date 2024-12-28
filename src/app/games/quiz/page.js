'use client';

import QuizGame from '@/games/quiz-game/QuizGame';
import FlipTimer from '@/games/memory-game/FlipTimer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function QuizGamePage() {
  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="nav-container fade-in">
          <Link href="/" className="back-button">
            <ArrowLeft />
            Back to Games
          </Link>
          <FlipTimer />
        </div>
        
        <h1 className="page-title slide-up">Josh Quiz Game</h1>
        
        <div className="fade-in">
          <QuizGame />
        </div>
      </div>
    </div>
  );
} 