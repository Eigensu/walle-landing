'use client';

import React, { useState, useEffect } from 'react';
import { Gatekeeper } from '@/components/Gatekeeper';
import { ClientOnly } from '@/components/ClientOnly';
import { useTournaments, useDeleteTournament } from '@/lib/hooks';
import { TournamentModal } from '@/components/TournamentModal';
import { Tournament } from '@/lib/api';
import { Plus, Edit2, Trash2, Loader, AlertCircle, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | undefined>();

  const { data: tournaments, isLoading, error } = useTournaments();
  const deleteMutation = useDeleteTournament();

  // Check authentication on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAddTournament = () => {
    setEditingTournament(undefined);
    setIsModalOpen(true);
  };

  const handleEditTournament = (tournament: Tournament) => {
    setEditingTournament(tournament);
    setIsModalOpen(true);
  };

  const handleDeleteTournament = (id: number) => {
    if (confirm('Are you sure you want to delete this tournament?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  return (
    <ClientOnly
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      {!isAuthenticated ? (
        <Gatekeeper onAuthenticated={() => setIsAuthenticated(true)} />
      ) : (
        <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">⚙️ Admin Dashboard</h1>
            <p className="text-gray-400 text-sm">Manage tournaments</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded font-medium transition-colors"
            >
              Public Page
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Add Button */}
        <div className="mb-8">
          <button
            onClick={handleAddTournament}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Tournament
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-400">Loading tournaments...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Failed to Load Tournaments
              </h3>
              <p className="text-red-200">
                Make sure the backend is running on http://localhost:8000
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {tournaments && tournaments.length === 0 && (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-lg mb-4">No tournaments yet</p>
            <button
              onClick={handleAddTournament}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
            >
              <Plus className="w-4 h-4" />
              Create Your First Tournament
            </button>
          </div>
        )}

        {/* Table */}
        {tournaments && tournaments.length > 0 && (
          <div className="overflow-x-auto bg-gray-800 border border-gray-700 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                    Game
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                    API URL
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tournaments.map((tournament, idx) => (
                  <tr key={tournament.id} className={idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                    <td className="px-6 py-3 text-sm text-white">
                      {tournament.title}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-400">
                      {tournament.game_name}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-400">
                      {tournament.api_url ? (
                        <a 
                          href={tournament.api_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline truncate block max-w-48"
                          title={tournament.api_url}
                        >
                          {tournament.api_url}
                        </a>
                      ) : (
                        <span className="text-gray-500 italic">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          tournament.status === 'LIVE'
                            ? 'bg-red-600 text-white'
                            : tournament.status === 'UPCOMING'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-gray-600 text-white'
                        }`}
                      >
                        {tournament.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-400">
                      {new Date(tournament.start_time).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-sm space-x-2">
                      <button
                        onClick={() => handleEditTournament(tournament)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTournament(tournament.id)}
                        disabled={deleteMutation.isPending}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <TournamentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTournament(undefined);
        }}
        tournament={editingTournament}
      />
    </main>
      )}
    </ClientOnly>
  );
}
