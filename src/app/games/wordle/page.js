'use client';

import WordleGame from '@/games/wordle-game/WordleGame';
import GameLayout from '@/components/shared/GameLayout';

export default function WordlePage() {
  return (
    <GameLayout title="Wordle">
      <WordleGame />
    </GameLayout>
  );
} 