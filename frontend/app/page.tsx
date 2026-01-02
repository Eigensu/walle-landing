'use client';

import { useTournaments } from '@/lib/hooks';
import { TournamentCard } from '@/components/TournamentCard';
import { Loader, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { data: tournaments, isLoading, error } = useTournaments();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">
              🎮 Tournament Aggregator
            </h1>
            <p className="text-gray-400 text-sm">
              Discover and watch live gaming tournaments
            </p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded font-medium transition-colors"
          >
            Admin Panel
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading && (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-400">Loading tournaments...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center min-h-96">
            <div className="bg-red-900 border border-red-700 rounded-lg p-6 max-w-md text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Failed to Load Tournaments
              </h3>
              <p className="text-red-200 text-sm">
                Make sure the backend is running on http://localhost:8000
              </p>
            </div>
          </div>
        )}

        {tournaments && tournaments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No tournaments available yet</p>
          </div>
        )}

        {tournaments && tournaments.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                All Tournaments
              </h2>
              <p className="text-gray-400">
                {tournaments.length} tournament{tournaments.length !== 1 ? 's' : ''} available
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-400 text-sm">
          <p>Tournament Aggregator © 2024 • Built with Next.js & FastAPI</p>
        </div>
      </footer>
    </main>
  );
}
