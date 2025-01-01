'use client';

import SlidingGame from '@/games/sliding-game/SlidingGame';
import GameLayout from '@/components/shared/GameLayout';

export default function SlidingPage() {
  return (
    <GameLayout title="Sliding Puzzle">
      <SlidingGame />
    </GameLayout>
  );
} 