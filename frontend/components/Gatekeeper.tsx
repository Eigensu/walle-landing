'use client';

import React, { useState } from 'react';

interface GatekeeperProps {
  onAuthenticated: () => void;
}

export function Gatekeeper({ onAuthenticated }: GatekeeperProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const ADMIN_USER = 'admin';
  const ADMIN_PASSWORD = '1234';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
      // Store auth state in sessionStorage
      sessionStorage.setItem('adminAuth', 'true');
      onAuthenticated();
    } else {
      setError('Invalid credentials. Try admin / 1234');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Admin Panel
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Protected Area - Authentication Required
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors"
          >
            Login
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          Demo credentials: admin / 1234
        </p>
      </div>
    </div>
  );
}
