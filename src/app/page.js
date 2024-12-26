'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import PragueTimer from '@/components/PragueTimer';
import MemoryGame from '@/games/memory-game/MemoryGame';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F5F5F1] p-4">
      <div className="max-w-5xl mx-auto">
        <PragueTimer />
        
        <div className="flex justify-center gap-4 mb-8">
          <Link 
            href="/"
            className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors"
          >
            Remy Memy Game
          </Link>
          <Link 
            href="/games/quiz"
            className="bg-white text-pink-600 px-4 py-2 rounded-md hover:bg-pink-50 transition-colors border border-pink-200"
          >
            Josh Quiz Game
          </Link>
        </div>

        <MemoryGame />
      </div>
    </main>
  );
}
