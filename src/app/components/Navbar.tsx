export default function Navbar() {
    return (
      <nav className="fixed top-0 w-full bg-[#0a1e1a] border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00ff88] rounded-full flex items-center justify-center">
              <span className="text-black font-bold">⚽</span>
            </div>
            <span className="text-white font-bold text-lg">Football Grid Challenge</span>
          </div>
          
          <div className="flex items-center gap-8">
            <a href="#how-to-play" className="text-gray-300 hover:text-white transition">
              How to Play
            </a>
            <a href="#leaderboard" className="text-gray-300 hover:text-white transition">
              Leaderboard
            </a>
            <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition">
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>
      </nav>
    );
  }
  