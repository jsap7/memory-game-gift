'use client';

import Link from 'next/link';
import FlipTimer from '@/components/shared/FlipTimer';
import SpotifyPlayer from '@/components/shared/SpotifyPlayer';
import { useEffect, useState } from 'react';

const GameCard = ({ href, title, description, animationOrder }) => {
  const handleRipple = (e) => {
    const card = e.currentTarget;
    const circle = document.createElement('div');
    const rect = card.getBoundingClientRect();
    
    circle.style.width = circle.style.height = Math.max(rect.width, rect.height) + 'px';
    circle.style.left = e.clientX - rect.left - (circle.offsetWidth / 2) + 'px';
    circle.style.top = e.clientY - rect.top - (circle.offsetHeight / 2) + 'px';
    circle.classList.add('ripple');

    const ripple = card.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }

    card.appendChild(circle);
  };

  return (
    <Link 
      href={href} 
      className="game-card" 
      style={{ '--animation-order': animationOrder }}
      onClick={handleRipple}
    >
      <h2>{title}</h2>
      <p>{description}</p>
    </Link>
  );
};

export default function Home() {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const createBubble = () => {
      const bubble = {
        id: Date.now(),
        size: Math.random() * 20 + 10,
        x: Math.random() * window.innerWidth,
        offset: Math.random() * 100 - 50 // Random X offset for floating
      };

      setBubbles(prev => [...prev, bubble]);

      setTimeout(() => {
        setBubbles(prev => prev.filter(b => b.id !== bubble.id));
      }, 4000);
    };

    const interval = setInterval(createBubble, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <FlipTimer />
        
        <h1 className="page-title slide-up">Gigi's Games</h1>
        
        <div className="games-grid fade-in">
          <GameCard
            href="/games/memory"
            title="Remy Memy Game"
            description="Match pairs of cute pictures in this memory challenge!"
            animationOrder={0}
          />
          
          <GameCard
            href="/games/quiz"
            title="Josh Quiz Game"
            description="Test your knowledge with fun trivia questions."
            animationOrder={1}
          />
          
          <GameCard
            href="/games/pattern"
            title="Pattern Game"
            description="Follow the sequence and repeat the pattern."
            animationOrder={2}
          />
          
          <GameCard
            href="/games/wordle"
            title="Wordle"
            description="Guess the five-letter word in six tries or less."
            animationOrder={3}
          />

          <GameCard
            href="/games/whack"
            title="Whack-an-Emoji"
            description="Whack the emojis as they pop up to score points!"
            animationOrder={4}
          />

          <GameCard
            href="/games/crossword"
            title="Geography Crossword"
            description="Test your geography knowledge and Josh's football favorites!"
            animationOrder={5}
          />
        </div>
      </div>

      <SpotifyPlayer />

      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="bubble"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.x,
            '--bubble-x': `${bubble.offset}px`
          }}
        />
      ))}
    </div>
  );
}
