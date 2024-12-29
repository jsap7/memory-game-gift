'use client';

import CrosswordGame from '@/games/crossword-game/CrosswordGame';
import GameLayout from '@/components/shared/GameLayout';

export default function CrosswordPage() {
  return (
    <GameLayout title="Crossword">
      <CrosswordGame />
    </GameLayout>
  );
} 