'use client';

import WhackGame from '@/games/whack-game/WhackGame';
import GameLayout from '@/components/shared/GameLayout';

export default function WhackGamePage() {
  return (
    <GameLayout title="Whack-an-Emoji">
      <WhackGame />
    </GameLayout>
  );
} 