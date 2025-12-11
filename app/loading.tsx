export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl floating-animation"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl floating-animation" style={{animationDelay: '2s'}}></div>
      
      <div className="text-center space-y-8 z-10">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center text-5xl pulse-glow animate-spin">
            🏥
          </div>
        </div>
        
        <h2 className="text-3xl font-bold gradient-text">Loading...</h2>
        <p className="text-gray-400">Please wait while we prepare your experience</p>
        
        {/* Loading Bar */}
        <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

