'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('**********');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', { email, password, rememberMe });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
            <p className="text-amber-600 text-center text-5xl font-bold mb-32 hover:text-amber-700 transition-colors">
              CONSOR
            </p>
          <h1 className="text-3xl font-bold text-black mb-2">
            WELCOME BACK
          </h1>
          <p className="text-black text-base">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-black text-sm font-normal mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-black text-sm font-normal mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          {/* Options Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-black">
                Remember me
              </label>
            </div>
            <Link 
              href="/forgot-password" 
              className="text-sm text-black hover:text-amber-600 transition-colors"
            >
              Forgot password
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-amber-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Sign in
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <span className="text-black text-sm">
            Don't have an account?{' '}
          </span>
          <Link 
            href="/signup" 
            className="text-green-600 text-sm hover:text-green-700 transition-colors"
          >
            Sign up fo free!
          </Link>
        </div>
      </div>
    </div>
  );
}
