'use client';

import React from 'react';
import { ExternalLink, Radio } from 'lucide-react';
import { Tournament } from '@/lib/api';

interface TournamentCardProps {
  tournament: Tournament;
  onClick?: () => void;
}

export function TournamentCard({ tournament, onClick }: TournamentCardProps) {
  const isLive = tournament.status === 'LIVE';
  const startDate = new Date(tournament.start_time);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-105 ${
        isLive ? 'ring-2 ring-red-500 ring-opacity-50' : ''
      }`}
    >
      {/* Image */}
      <div className="relative w-full h-48 bg-gray-800 overflow-hidden">
        {tournament.image_url && (
          <img
            src={tournament.image_url}
            alt={tournament.title}
            className="w-full h-full object-cover"
          />
        )}
        {/* Live Indicator */}
        {isLive && (
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full animate-pulse-red">
            <Radio className="w-4 h-4 fill-current" />
            <span className="text-sm font-semibold">LIVE</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-gray-900 p-4 text-white">
        <h3 className="text-lg font-bold truncate">{tournament.title}</h3>
        <p className="text-sm text-gray-400 mb-3">{tournament.game_name}</p>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <p>{formattedDate}</p>
            <p>{formattedTime}</p>
          </div>
          {isLive ? (
            <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
              LIVE
            </span>
          ) : (
            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
              {tournament.status}
            </span>
          )}
        </div>

        {tournament.stream_url && (
          <button
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold text-sm flex items-center justify-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              window.open(tournament.stream_url, '_blank');
            }}
          >
            <ExternalLink className="w-4 h-4" />
            Watch Stream
          </button>
        )}
      </div>
    </div>
  );
}
