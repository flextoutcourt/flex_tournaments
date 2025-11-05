'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaCrown } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (status === 'loading') {
    return (
      <div className="w-10 h-10 rounded-xl bg-gray-700/50 animate-pulse"></div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-3">
        <Link
          href="/auth/signin"
          className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-700 flex items-center"
        >
          <FaSignInAlt className="mr-2" />
          <span className="hidden sm:inline">Connexion</span>
        </Link>
        <Link
          href="/auth/signup"
          className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <FaUserPlus className="mr-2" />
          <span className="hidden sm:inline">Inscription</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-slate-700 hover:bg-slate-600 px-4 py-2.5 rounded-lg transition-colors group"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
            <FaUser className="text-white text-base" />
          </div>
          {session.user?.role === 'ADMIN' && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-slate-800">
              <FaCrown className="text-white text-xs" />
            </div>
          )}
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-sm font-semibold text-white">{session.user?.name || 'User'}</p>
          <p className="text-xs text-gray-400">{session.user?.role}</p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 z-50 animate-fadeIn">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-slate-700">
            <p className="text-base font-semibold text-white mb-1">{session.user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
          </div>
          
          {/* Admin Badge */}
          {session.user?.role === 'ADMIN' && (
            <div className="px-4 py-2.5 bg-yellow-500/10 border-b border-slate-700">
              <p className="text-sm text-yellow-400 flex items-center font-semibold">
                <FaCrown className="mr-2" />
                Administrateur
              </p>
            </div>
          )}

          {/* Sign Out Button */}
          <button
            onClick={() => {
              setIsOpen(false);
              signOut({ callbackUrl: '/' });
            }}
            className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-slate-700 flex items-center transition-colors rounded-b-lg group"
          >
            <FaSignOutAlt className="mr-3 text-red-400 group-hover:scale-110 transition-transform" />
            <span className="group-hover:text-white transition-colors">Se déconnecter</span>
          </button>
        </div>
      )}
    </div>
  );
}
