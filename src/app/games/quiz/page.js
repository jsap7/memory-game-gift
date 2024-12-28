'use client';

import QuizGame from '@/games/quiz-game/QuizGame';
import GameLayout from '@/components/shared/GameLayout';

export default function QuizGamePage() {
  return (
    <GameLayout title="Josh Quiz Game">
      <QuizGame />
    </GameLayout>
  );
} 