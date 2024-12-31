'use client';

import QuizUpGame from '@/games/quizup-game/QuizUpGame';
import GameLayout from '@/components/shared/GameLayout';

export default function QuizUpPage() {
  return (
    <GameLayout title="2024 Events Quiz">
      <QuizUpGame />
    </GameLayout>
  );
} 