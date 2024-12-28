'use client';

import Link from 'next/link';
import FlipTimer from '@/components/shared/FlipTimer';
import SpotifyPlayer from '@/components/shared/SpotifyPlayer';
import { useEffect, useState } from 'react';

const Sparkle = ({ style }) => (
  <div
    style={{
      position: 'fixed',
      pointerEvents: 'none',
      width: '10px',
      height: '10px',
      background: 'white',
      borderRadius: '50%',
      ...style
    }}
  />
);

export default function Home() {
  const [sparkles, setSparkles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Create a new sparkle
      const sparkle = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 15 + 5,
        opacity: 1,
        color: `rgba(255, ${Math.random() * 100 + 100}, ${Math.random() * 100 + 100}, ${Math.random() * 0.5 + 0.5})`
      };

      setSparkles(prev => [...prev, sparkle]);

      // Remove sparkle after animation
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== sparkle.id));
      }, 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <FlipTimer />
        
        <h1 className="page-title slide-up">Gigi's Games</h1>
        
        <div className="games-grid fade-in">
          <Link href="/games/memory" className="game-card" style={{ '--animation-order': 0 }}>
            <h2>Remy Memy Game</h2>
            <p>Match pairs of Remy and Pookie pics in this memory challenge!</p>
          </Link>
          
          <Link href="/games/quiz" className="game-card" style={{ '--animation-order': 1 }}>
            <h2>Josh Quiz Game</h2>
            <p>Test your knowledge on Joshua himself and our first times together.</p>
          </Link>
          
          <Link href="/games/pattern" className="game-card" style={{ '--animation-order': 2 }}>
            <h2>Pattern Game</h2>
            <p>Follow the sequence and repeat the pattern.</p>
          </Link>
          
          <Link href="/games/wordle" className="game-card" style={{ '--animation-order': 3 }}>
            <h2>Wordle</h2>
            <p>Guess the five-letter word in six tries or less.</p>
          </Link>
        </div>
      </div>

      <SpotifyPlayer />

      {sparkles.map(sparkle => (
        <Sparkle
          key={sparkle.id}
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
            background: sparkle.color,
            transform: 'translate(-50%, -50%)',
            animation: 'sparkle 1s forwards'
          }}
        />
      ))}
    </div>
  );
}
