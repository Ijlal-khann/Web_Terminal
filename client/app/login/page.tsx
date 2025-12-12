'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.auth.login(email, password);
      toast.success('✨ Login successful!');
      
      // Redirect based on role
      if (response.user.role === 'doctor') {
        router.push('/dashboard/doctor');
      } else {
        router.push('/dashboard/patient');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl floating-animation"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl floating-animation" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl floating-animation" style={{animationDelay: '4s'}}></div>
      
      <div className="w-full max-w-6xl flex gap-8 items-center z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-1 flex-col space-y-8">
          <div className="space-y-4">
            <h1 className="text-7xl font-bold gradient-text leading-tight">
              MediCare<br />Portal
            </h1>
            <p className="text-xl text-gray-300 max-w-md">
              Next-generation healthcare management system with real-time notifications and seamless appointment booking.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl pulse-glow">
                🏥
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Smart Scheduling</h3>
                <p className="text-sm text-gray-400">AI-powered appointment management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-2xl pulse-glow">
                🔔
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Real-time Updates</h3>
                <p className="text-sm text-gray-400">Instant notifications via Kafka</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-2xl pulse-glow">
                🔒
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Secure & Private</h3>
                <p className="text-sm text-gray-400">Enterprise-grade security</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 max-w-md w-full">
          <div className="glass-card rounded-3xl p-8 pulse-glow">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                  🔐
                </div>
                <h2 className="text-4xl font-bold gradient-text">Sign In</h2>
              </div>
              <p className="text-gray-400">Access your healthcare dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="email" className="block text-sm font-semibold text-purple-300">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="doctor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 input-glow"
                  required
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="password" className="block text-sm font-semibold text-purple-300">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 input-glow"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 gradient-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In →'
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-400">New to MediCare?</span>
                </div>
              </div>

              <Link href="/register">
                <button
                  type="button"
                  className="w-full py-4 rounded-2xl border-2 border-purple-500/50 text-purple-300 font-semibold hover:bg-purple-500/10 transition-all duration-300 hover:border-pink-500/50 hover:text-pink-300"
                >
                  Create Account
                </button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

