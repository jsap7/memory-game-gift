'use client';

import Link from 'next/link';
import SpotifyPlayer from '@/components/shared/SpotifyPlayer';
import { Analytics } from '@vercel/analytics/react';
import { useState } from 'react';

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
  const [showGames, setShowGames] = useState(false);
  const [bubbles, setBubbles] = useState([]);

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <h1 className="page-title slide-up">Gigi's Games</h1>
        
        {/* Games Section */}
        <div className="section-container fade-in">
          <button 
            onClick={() => setShowGames(!showGames)}
            className="section-toggle"
          >
            <h2>Mini Games {showGames ? '▼' : '▶'}</h2>
          </button>
          
          {showGames && (
            <div className="games-grid">
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
                title="Man City Crossword"
                description="Test Josh's football favorites!"
                animationOrder={5}
              />

              <GameCard
                href="/games/quizup"
                title="2024 Events Quiz"
                description="Test your knowledge of 2024 events against the clock!"
                animationOrder={6}
              />

              <GameCard
                href="/games/sliding"
                title="Sliding Puzzle"
                description="Rearrange the tiles to complete the picture!"
                animationOrder={7}
              />
            </div>
          )}
        </div>

        {/* Travel Map Section */}
        <button 
          onClick={() => window.location.href = '/world-map'} 
          className="travel-button"
        >
          <h2>The Travel Map</h2>
          <p>"Oh, the places you'll go!"</p>
          <div className="travel-icons">
            🗺️ ✈️ 🌎 🧭
          </div>
        </button>
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

      <Analytics />

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          padding-bottom: 100px;
          position: relative;
          background: #f5f5f5;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
          width: 100%;
        }

        @media (min-width: 768px) {
          .content-wrapper {
            padding: 2rem;
          }
        }

        .page-title {
          font-size: 2rem;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 768px) {
          .page-title {
            font-size: 2.5rem;
            margin-bottom: 2rem;
          }
        }

        .section-container {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 1.5rem;
        }

        @media (min-width: 768px) {
          .section-container {
            border-radius: 20px;
            margin-bottom: 3rem;
          }
        }

        .section-toggle {
          width: 100%;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
          border-bottom: 1px solid #f0f0f0;
        }

        @media (min-width: 768px) {
          .section-toggle {
            padding: 1.5rem 2rem;
          }
        }

        .section-toggle h2 {
          margin: 0;
          font-size: 1.4rem;
          color: #333;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (min-width: 768px) {
          .section-toggle h2 {
            font-size: 1.8rem;
            gap: 1rem;
          }
        }

        .games-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          padding: 1rem;
        }

        @media (min-width: 640px) {
          .games-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            padding: 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .games-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            padding: 2rem;
          }
        }

        .travel-button {
          width: 100%;
          padding: 1.5rem;
          background: linear-gradient(135deg, #FF4081 0%, #AE6EE7 100%);
          border: none;
          border-radius: 15px;
          color: white;
          cursor: pointer;
          transition: transform 0.2s ease;
          margin-top: 1rem;
        }

        @media (min-width: 768px) {
          .travel-button {
            padding: 2rem;
            border-radius: 20px;
          }
        }

        .travel-button h2 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 600;
          color: white;
        }

        @media (min-width: 768px) {
          .travel-button h2 {
            font-size: 2.5rem;
          }
        }

        .travel-button p {
          margin: 0.5rem 0 0.75rem 0;
          font-size: 1rem;
          font-style: italic;
          opacity: 0.9;
          font-family: 'Georgia', serif;
        }

        @media (min-width: 768px) {
          .travel-button p {
            margin: 0.5rem 0 1rem 0;
            font-size: 1.2rem;
          }
        }

        .travel-icons {
          font-size: 1.4rem;
          letter-spacing: 0.3rem;
        }

        @media (min-width: 768px) {
          .travel-icons {
            font-size: 1.8rem;
            letter-spacing: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
