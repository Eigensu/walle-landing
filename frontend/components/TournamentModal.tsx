'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateTournament, useUpdateTournament } from '@/lib/hooks';
import { Tournament, TournamentCreate, TournamentUpdate } from '@/lib/api';

interface TournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournament?: Tournament;
}

export function TournamentModal({
  isOpen,
  onClose,
  tournament,
}: TournamentModalProps) {
  const isEditMode = !!tournament;

  const [formData, setFormData] = useState<Partial<TournamentCreate>>(
    tournament
      ? {
          title: tournament.title,
          game_name: tournament.game_name,
          stream_url: tournament.stream_url,
          image_url: tournament.image_url,
          status: tournament.status,
          start_time: tournament.start_time.split('T')[0],
        }
      : {
          title: '',
          game_name: '',
          stream_url: '',
          image_url: '',
          status: 'UPCOMING',
          start_time: new Date().toISOString().split('T')[0],
        }
  );

  const createMutation = useCreateTournament();
  const updateMutation = useUpdateTournament();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.game_name || !formData.stream_url || !formData.image_url || !formData.start_time) {
      alert('Please fill in all fields');
      return;
    }

    const submitData = {
      ...formData,
      start_time: new Date(formData.start_time!).toISOString(),
    };

    if (isEditMode && tournament) {
      updateMutation.mutate(
        { id: tournament.id, data: submitData as TournamentUpdate },
        {
          onSuccess: () => {
            onClose();
            setFormData({
              title: '',
              game_name: '',
              stream_url: '',
              image_url: '',
              status: 'UPCOMING',
              start_time: new Date().toISOString().split('T')[0],
            });
          },
        }
      );
    } else {
      createMutation.mutate(submitData as TournamentCreate, {
        onSuccess: () => {
          onClose();
          setFormData({
            title: '',
            game_name: '',
            stream_url: '',
            image_url: '',
            status: 'UPCOMING',
            start_time: new Date().toISOString().split('T')[0],
          });
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {isEditMode ? 'Edit Tournament' : 'Add Tournament'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Game Name
            </label>
            <input
              type="text"
              value={formData.game_name || ''}
              onChange={(e) =>
                setFormData({ ...formData, game_name: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stream URL
            </label>
            <input
              type="url"
              value={formData.stream_url || ''}
              onChange={(e) =>
                setFormData({ ...formData, stream_url: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image_url || ''}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status || 'UPCOMING'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as 'LIVE' | 'UPCOMING' | 'COMPLETED',
                })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
            >
              <option value="UPCOMING">Upcoming</option>
              <option value="LIVE">Live</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={formData.start_time || ''}
              onChange={(e) =>
                setFormData({ ...formData, start_time: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
