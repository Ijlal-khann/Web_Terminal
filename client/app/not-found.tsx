import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl floating-animation"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl floating-animation" style={{animationDelay: '2s'}}></div>
      
      <div className="text-center space-y-8 z-10">
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center text-6xl pulse-glow floating-animation">
            🔍
          </div>
        </div>
        
        <h1 className="text-9xl font-bold gradient-text">404</h1>
        <h2 className="text-4xl font-bold text-white">Page Not Found</h2>
        <p className="text-xl text-gray-400 max-w-md mx-auto">
          Oops! The page you're looking for seems to have wandered off into the digital void.
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap mt-12">
          <Link href="/">
            <button className="px-8 py-4 gradient-button text-lg">
              Go Home →
            </button>
          </Link>
          <Link href="/login">
            <button className="px-8 py-4 text-lg rounded-2xl border-2 border-purple-500/50 text-purple-300 font-semibold hover:bg-purple-500/10 transition-all duration-300">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}


