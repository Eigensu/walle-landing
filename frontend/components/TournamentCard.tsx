'use client';

import React from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import { Tournament } from '@/lib/api';

interface TournamentCardProps {
  tournament: Tournament;
  onClick?: () => void;
}

export function TournamentCard({ tournament, onClick }: TournamentCardProps) {
  const isLive = tournament.status === 'LIVE';
  const startDate = new Date(tournament.start_time);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 group bg-walle-dark border border-walle-purple/40 hover:border-purple-500/60"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/5" />
      
      {/* Content */}
      <div className="relative p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            {/* Status Badge */}
            {isLive ? (
              <div className="inline-flex items-center gap-1.5 bg-green-500/20 text-green-400 px-3 py-1 rounded-full mb-4">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs font-semibold tracking-wide">LIVE NOW</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full mb-4">
                <span className="text-xs font-semibold tracking-wide">UPCOMING</span>
              </div>
            )}
            
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight">
              {tournament.title}
            </h3>
            
            <div className="flex items-center gap-2 text-purple-300">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{formattedDate} at {formattedTime}</span>
            </div>
          </div>

          {/* Tournament Image */}
          {tournament.image_url && (
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-walle-dark/50 p-2 flex items-center justify-center">
              <img
                src={tournament.image_url}
                alt={tournament.game_name}
                className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
          onClick={(e) => {
            e.stopPropagation();
            if (tournament.stream_url) {
              window.open(tournament.stream_url, '_blank');
            }
          }}
        >
          Go to Tournament
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
