'use client';

import PatternGame from '@/games/pattern-game/PatternGame';
import FlipTimer from '@/games/memory-game/FlipTimer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PatternGamePage() {
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
        
        <h1 className="page-title slide-up">Pattern Game</h1>
        
        <div className="fade-in">
          <PatternGame />
        </div>
      </div>
    </div>
  );
} 