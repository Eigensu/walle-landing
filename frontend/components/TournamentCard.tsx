'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
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
      className="relative overflow-hidden rounded-walle-lg cursor-pointer transition-all hover:scale-[1.02] group purple-gradient border border-walle-purple/30"
    >
      {/* Live Indicator - Top Right */}
      {isLive && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-full animate-pulse-green shadow-lg">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <span className="text-xs font-bold tracking-wide">LIVE</span>
        </div>
      )}

      {/* Content */}
      <div className="p-6 text-white relative min-h-[240px] flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold mb-2 leading-tight pr-20">{tournament.title}</h3>
          <p className="text-purple-200 text-sm mb-6">
            Starts: {formattedDate}, {formattedTime}
          </p>
        </div>

        {/* Logo/Image in bottom right */}
        {tournament.image_url && (
          <div className="absolute bottom-6 right-6 w-20 h-20 opacity-40 group-hover:opacity-60 transition-opacity">
            <img
              src={tournament.image_url}
              alt={tournament.game_name}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* CTA Button */}
        <button
          className="w-fit bg-walle-dark hover:bg-walle-purple text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-purple-500/30 flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            if (tournament.stream_url) {
              window.open(tournament.stream_url, '_blank');
            }
          }}
        >
          Go to Tournament
        </button>
      </div>
    </div>
  );
}
