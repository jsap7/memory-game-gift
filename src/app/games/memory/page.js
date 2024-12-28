'use client';

import MemoryGame from '@/games/memory-game/MemoryGame';
import GameLayout from '@/components/shared/GameLayout';

export default function MemoryGamePage() {
  return (
    <GameLayout title="Remy Memy Game">
      <MemoryGame />
    </GameLayout>
  );
} 