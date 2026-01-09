import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { authAPI } from '../utils/api';

type UserRole = 'admin' | 'teacher' | null;

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('demo@smartlearn.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { session, user } = await authAPI.signIn(email, password);
      const role = user?.user_metadata?.role || 'admin';
      console.log('Login successful:', { email, role });
      onLogin(role as UserRole);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please use: demo@smartlearn.com / demo123');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Email not confirmed. Please contact support.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-10">
        {/* Logo and System Name */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center relative">
              <GraduationCap size={40} strokeWidth={2} className="text-white" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#2ac8d2]"></div>
            </div>
          </div>
          <h1 className="text-gray-900">SmartLearn</h1>
          <p className="text-gray-600 mt-2">Learning Management System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm">
              {error}
            </div>
          )}

          {/* Demo Info */}
          <div className="bg-gray-50 border border-gray-200 p-3 rounded text-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#2ac8d2]"></div>
            <div className="pl-3">
              <p className="font-medium text-gray-900 mb-1">Demo Login Credentials:</p>
              <p className="text-gray-700">Email: demo@smartlearn.com</p>
              <p className="text-gray-700 mb-2">Password: demo123</p>
              <p className="text-gray-500 text-xs">Fields are pre-filled for your convenience</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('demo@smartlearn.com');
                setPassword('demo123');
              }}
              className="flex-1 text-xs bg-gray-100 p-2 rounded hover:bg-gray-200"
            >
              Admin (Demo)
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('teacher@smartlearn.com');
                setPassword('teacher123');
              }}
              className="flex-1 text-xs bg-gray-100 p-2 rounded hover:bg-gray-200"
            >
              Teacher (Demo)
            </button>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded p-3 focus:border-gray-900 focus:outline-none transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded p-3 focus:border-gray-900 focus:outline-none transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white p-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#2ac8d2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative">{loading ? 'Logging in...' : 'Login'}</span>
          </button>

          {/* Forgot Password */}
          <div className="text-center pt-2">
            <button type="button" className="text-gray-600 hover:text-gray-900 underline transition-colors text-sm">
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}