'use client';

import PatternGame from '@/games/pattern-game/PatternGame';
import GameLayout from '@/components/shared/GameLayout';

export default function PatternGamePage() {
  return (
    <GameLayout title="Pattern Game">
      <PatternGame />
    </GameLayout>
  );
} 