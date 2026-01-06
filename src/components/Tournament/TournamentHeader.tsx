// components/Tournament/TournamentHeader.tsx
'use client';

import React from 'react';
import { FaTrophy, FaClock, FaUsers } from 'react-icons/fa';
import { useMouseHalo } from '@/hooks/useMouseHalo';

interface TournamentHeaderProps {
  title: string;
  description?: string;
  createdAt: Date;
  itemsCount: number;
  editLink: string;
  statusBadge: React.ReactNode;
  actionButtons: React.ReactNode;
}

export default function TournamentHeader({
  title,
  description,
  createdAt,
  itemsCount,
  editLink,
  statusBadge,
  actionButtons,
}: TournamentHeaderProps) {
  const cardRef = useMouseHalo('rgba(99, 102, 241, 0.4)');

  return (
    <header className="mb-8 md:mb-12 animate-fadeIn">
      <div
        ref={cardRef}
        className="bg-gradient-to-br from-slate-800/80 via-slate-800/80 to-slate-900/80 border-2 border-indigo-500/20 hover:border-indigo-500/40 p-6 md:p-10 rounded-2xl backdrop-blur-sm shadow-2xl transition-all duration-500 relative group animate-borderGlow overflow-hidden"
      >
        {/* Mouse Halo Effect */}
        <div className="halo-effect absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none"></div>

        {/* Animated gradient orbs */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl group-hover:bg-indigo-600/30 transition-all duration-700 animate-pulse"></div>
        <div
          className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl group-hover:bg-purple-600/30 transition-all duration-700 animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        ></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                {/* Trophy icon with glow */}
                <div className="relative animate-floatSmooth">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-2xl">
                    <FaTrophy className="h-8 w-8 text-yellow-300 drop-shadow-2xl" />
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-3 break-words">
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
                      {title}
                    </span>
                  </h1>
                  {description && (
                    <p className="text-base md:text-lg text-gray-300 max-w-3xl leading-relaxed whitespace-pre-line">
                      {description}
                    </p>
                  )}
                </div>
              </div>

              {/* Meta information */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-lg backdrop-blur-sm hover:bg-slate-700/70 transition-all duration-300 transform hover:scale-105">
                  <FaClock className="text-indigo-400" />
                  <span>
                    Créé le {createdAt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-lg backdrop-blur-sm hover:bg-slate-700/70 transition-all duration-300 transform hover:scale-105">
                  <FaUsers className="text-purple-400" />
                  <span>
                    {itemsCount} participant{itemsCount > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {actionButtons}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
