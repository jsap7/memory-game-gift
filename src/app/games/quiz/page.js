'use client';

import QuizGame from '@/games/quiz-game/QuizGame';
import PragueTimer from '@/components/PragueTimer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function QuizGamePage() {
  return (
    <div className="min-h-screen bg-[#F5F5F1]">
      <div className="max-w-5xl mx-auto p-4">
        <Link 
          href="/"
          className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Games
        </Link>
        <PragueTimer />
        <QuizGame />
      </div>
    </div>
  );
} 