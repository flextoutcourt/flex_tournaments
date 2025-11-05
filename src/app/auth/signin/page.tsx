'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaSignInAlt, FaEnvelope, FaLock, FaExclamationTriangle } from 'react-icons/fa';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/tournaments';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email ou mot de passe incorrect');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex p-4 mb-4 bg-indigo-600/20 rounded-xl border border-indigo-600/30">
              <FaSignInAlt className="h-12 w-12 text-indigo-400" />
            </div>
            <h1 className="text-4xl font-bold mb-2 text-white">
              Connexion
            </h1>
            <p className="text-gray-400">Connectez-vous pour créer des tournois</p>
          </div>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-error mb-6 flex items-start">
                <FaExclamationTriangle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="label">
                  <FaEnvelope className="inline-block mr-2 mb-0.5" />
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input"
                  placeholder="votre@email.com"
                  autoComplete="email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="label">
                  <FaLock className="inline-block mr-2 mb-0.5" />
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center px-6 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Connexion...</span>
                  </>
                ) : (
                  <>
                    <FaSignInAlt className="mr-2" />
                    <span>Se connecter</span>
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Pas encore de compte ?{' '}
                <Link href="/auth/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                  S'inscrire
                </Link>
              </p>
            </div>
        </div>
      </div>
    </div>
  );
}
