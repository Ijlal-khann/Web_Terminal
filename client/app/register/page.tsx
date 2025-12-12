'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.auth.register(formData);
      toast.success('🎉 Registration successful! Please login.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-10 right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl floating-animation"></div>
      <div className="absolute bottom-32 left-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl floating-animation" style={{animationDelay: '3s'}}></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl floating-animation" style={{animationDelay: '1s'}}></div>
      
      <div className="w-full max-w-6xl flex gap-8 items-center z-10 flex-row-reverse">
        {/* Right Side - Branding */}
        <div className="hidden lg:flex flex-1 flex-col space-y-8">
          <div className="space-y-4">
            <h1 className="text-7xl font-bold gradient-text leading-tight">
              Join<br />MediCare
            </h1>
            <p className="text-xl text-gray-300 max-w-md">
              Start your journey with us. Whether you're a patient or doctor, we've got you covered.
            </p>
          </div>
          
          {/* Benefits Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-5 space-y-2">
              <div className="text-3xl">⚡</div>
              <h3 className="text-white font-semibold">Instant Access</h3>
              <p className="text-sm text-gray-400">Get started immediately</p>
            </div>
            <div className="glass-card rounded-2xl p-5 space-y-2">
              <div className="text-3xl">🌐</div>
              <h3 className="text-white font-semibold">24/7 Available</h3>
              <p className="text-sm text-gray-400">Access anytime, anywhere</p>
            </div>
            <div className="glass-card rounded-2xl p-5 space-y-2">
              <div className="text-3xl">💼</div>
              <h3 className="text-white font-semibold">Professional</h3>
              <p className="text-sm text-gray-400">Verified doctors only</p>
            </div>
            <div className="glass-card rounded-2xl p-5 space-y-2">
              <div className="text-3xl">📊</div>
              <h3 className="text-white font-semibold">Analytics</h3>
              <p className="text-sm text-gray-400">Track your health</p>
            </div>
          </div>
        </div>

        {/* Left Side - Register Form */}
        <div className="flex-1 max-w-md w-full">
          <div className="glass-card rounded-3xl p-8 pulse-glow">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-2xl">
                  ✨
                </div>
                <h2 className="text-4xl font-bold gradient-text">Sign Up</h2>
              </div>
              <p className="text-gray-400">Create your account in seconds</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <label htmlFor="name" className="block text-sm font-semibold text-cyan-300">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-4 input-glow"
                  required
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="email" className="block text-sm font-semibold text-cyan-300">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-4 input-glow"
                  required
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="password" className="block text-sm font-semibold text-cyan-300">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-4 input-glow"
                  required
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="role" className="block text-sm font-semibold text-cyan-300">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'patient' })}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      formData.role === 'patient'
                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-cyan-500/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">🙋</div>
                    <div className="font-semibold">Patient</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'doctor' })}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      formData.role === 'doctor'
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-purple-500/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">👨‍⚕️</div>
                    <div className="font-semibold">Doctor</div>
                  </button>
                </div>
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
                    Creating account...
                  </span>
                ) : (
                  'Create Account →'
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-400">Already registered?</span>
                </div>
              </div>

              <Link href="/login">
                <button
                  type="button"
                  className="w-full py-4 rounded-2xl border-2 border-cyan-500/50 text-cyan-300 font-semibold hover:bg-cyan-500/10 transition-all duration-300 hover:border-purple-500/50 hover:text-purple-300"
                >
                  Sign In
                </button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

