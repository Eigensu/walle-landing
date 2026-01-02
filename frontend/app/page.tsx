'use client';

import { useTournaments } from '@/lib/hooks';
import { TournamentCard } from '@/components/TournamentCard';
import { Loader, AlertCircle } from 'lucide-react';

export default function Home() {
  const { data: tournaments, isLoading, error } = useTournaments();

  return (
    <main className="min-h-screen bg-walle-darker">
      {/* Header */}
      <header className="bg-walle-dark/80 backdrop-blur-md border-b border-walle-purple/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🎯</div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                WALL-E ARENA
              </h1>
              <p className="text-purple-300 text-sm">
                Tournaments
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading && (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-400" />
              <p className="text-purple-300">Loading contests...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center min-h-96">
            <div className="bg-red-900/30 border border-red-500/30 rounded-walle p-6 max-w-md text-center backdrop-blur-sm">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Failed to Load Contests
              </h3>
              <p className="text-red-200 text-sm">
                Make sure the backend is running on http://localhost:8000
              </p>
            </div>
          </div>
        )}

        {tournaments && tournaments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-purple-300 text-lg">No contests available yet</p>
          </div>
        )}

        {tournaments && tournaments.length > 0 && (
          <>
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">
                Tournaments
              </h2>
              <p className="text-purple-300">
                {tournaments.length} tournament{tournaments.length !== 1 ? 's' : ''} available
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <footer className="mt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="purple-gradient rounded-walle-lg p-12 text-center border border-walle-purple/30">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Us?
            </h2>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
              Experience the most engaging cricket fantasy platform with powerful features
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
