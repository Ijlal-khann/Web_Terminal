'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl floating-animation"></div>
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl floating-animation" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl floating-animation" style={{animationDelay: '2s'}}></div>
      
      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-8 max-w-5xl mx-auto">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center text-5xl pulse-glow floating-animation">
              🏥
            </div>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-7xl lg:text-8xl font-bold gradient-text leading-tight">
            MediCare Portal
          </h1>
          
          <p className="text-2xl lg:text-3xl text-gray-300 max-w-3xl mx-auto">
            Next-generation healthcare management system with real-time notifications and seamless appointment booking
          </p>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap mt-12">
            <Link href="/login">
              <button className="px-10 py-5 gradient-button text-xl">
                Sign In →
              </button>
            </Link>
            <Link href="/register">
              <button className="px-10 py-5 text-xl rounded-2xl border-2 border-purple-500/50 text-purple-300 font-semibold hover:bg-purple-500/10 transition-all duration-300 hover:border-pink-500/50 hover:text-pink-300">
                Get Started
              </button>
            </Link>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
            <div className="glass-card-hover rounded-3xl p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl mx-auto">
                ⚡
              </div>
              <h3 className="text-2xl font-bold text-white">Real-time Updates</h3>
              <p className="text-gray-400">
                Get instant notifications powered by Apache Kafka for all your appointment updates
              </p>
            </div>
            
            <div className="glass-card-hover rounded-3xl p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-3xl mx-auto">
                📅
              </div>
              <h3 className="text-2xl font-bold text-white">Smart Scheduling</h3>
              <p className="text-gray-400">
                Book appointments with ease and manage your healthcare schedule efficiently
              </p>
            </div>
            
            <div className="glass-card-hover rounded-3xl p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-3xl mx-auto">
                🔒
              </div>
              <h3 className="text-2xl font-bold text-white">Secure & Private</h3>
              <p className="text-gray-400">
                Enterprise-grade security with encrypted data and secure authentication
              </p>
            </div>
          </div>
          
          {/* Tech Stack */}
          <div className="mt-20">
            <p className="text-sm text-gray-500 mb-6">Powered by modern technologies</p>
            <div className="flex gap-6 justify-center flex-wrap text-gray-400">
              <div className="glass-card rounded-xl px-6 py-3 text-sm font-semibold">Next.js</div>
              <div className="glass-card rounded-xl px-6 py-3 text-sm font-semibold">Apache Kafka</div>
              <div className="glass-card rounded-xl px-6 py-3 text-sm font-semibold">Redis</div>
              <div className="glass-card rounded-xl px-6 py-3 text-sm font-semibold">MongoDB</div>
              <div className="glass-card rounded-xl px-6 py-3 text-sm font-semibold">Node.js</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
