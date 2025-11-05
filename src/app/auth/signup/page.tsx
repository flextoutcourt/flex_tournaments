'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUserPlus, FaEnvelope, FaLock, FaUser, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

export default function SignUpPage() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/signin');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue');
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
              <FaUserPlus className="h-12 w-12 text-indigo-400" />
            </div>
            <h1 className="text-4xl font-bold mb-2 text-white">
              Inscription
            </h1>
            <p className="text-gray-400">Créez votre compte pour gérer des tournois</p>
          </div>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-error mb-6 flex items-start">
                <FaExclamationTriangle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="alert alert-success mb-6 flex items-start">
                <FaCheckCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-sm">Compte créé avec succès ! Redirection...</p>
              </div>
            )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="label">
              <FaUser className="inline-block mr-2 mb-0.5" />
              Nom
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input"
              placeholder="Votre nom"
            />
          </div>

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
            />
          </div>

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
              minLength={6}
              className="input"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="label">
              <FaLock className="inline-block mr-2 mb-0.5" />
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full inline-flex items-center justify-center px-6 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Inscription...
              </>
            ) : (
              <>
                <FaUserPlus className="mr-2" />
                S'inscrire
              </>
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Déjà un compte ?{' '}
            <Link href="/auth/signin" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
