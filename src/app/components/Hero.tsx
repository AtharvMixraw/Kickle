import Navbar from './Navbar';
import GridPreview from './GridPreview';

export default function Hero() {
  return (
    <section className="relative min-h-screen pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-green-900/30 border border-green-500/30 px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse"></span>
              <span className="text-[#00ff88] text-sm font-medium">LIVE CHALLENGE #142</span>
            </div>
            
            <h1 className="text-6xl font-bold mb-4">
              <span className="text-white">Test Your Football</span>
              <br />
              <span className="text-[#00ff88]">Knowledge Daily</span>
            </h1>
            
            <p className="text-gray-400 text-lg mb-8 max-w-lg">
              Solve the 3×3 grid. Beat the clock. Top the leaderboard. 
              Join thousands of fans in the ultimate daily trivia game.
            </p>
            
            <div className="flex items-center gap-4">
              <button className="bg-[#00ff88] hover:bg-[#00dd77] text-black font-bold px-8 py-4 rounded-full flex items-center gap-2 transition transform hover:scale-105">
                <span>▶</span>
                <span>Play Today&apos;s Grid</span>
              </button>
              <span className="text-gray-500">New challenge in <span className="text-[#00ff88]">04:23:12</span></span>
            </div>
          </div>
          
          {/* Right Grid Preview */}
          <GridPreview />
        </div>
      </div>
    </section>
  );
}
