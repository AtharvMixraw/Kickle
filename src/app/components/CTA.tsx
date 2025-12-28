export default function CTA() {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* CTA Section */}
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-8">
              Ready to prove your ball<br />knowledge?
            </h2>
            <div className="flex justify-center gap-4">
              <button className="bg-[#00ff88] hover:bg-[#00dd77] text-black font-bold px-8 py-4 rounded-full transition transform hover:scale-105">
                Play Now - It&apos;s Free
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-8 py-4 rounded-full transition">
                View Leaderboard
              </button>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="border-t border-gray-800 pt-12">
            <div className="grid md:grid-cols-3 gap-12 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[#00ff88] rounded-full flex items-center justify-center">
                    <span className="text-black font-bold">⚽</span>
                  </div>
                  <span className="text-white font-bold">Football Grid Challenge</span>
                </div>
                <p className="text-gray-400 text-sm">
                  The daily trivia game for the ultimate football enthusiasts. 
                  Test your knowledge, challenge friends, and dominate the grid.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-4">Game</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition">Play Daily Grid</a></li>
                  <li><a href="#" className="hover:text-white transition">Leaderboard</a></li>
                  <li><a href="#" className="hover:text-white transition">Archive</a></li>
                  <li><a href="#" className="hover:text-white transition">How to Play</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 flex justify-between items-center">
              <p className="text-gray-500 text-sm">© 2024 Football Grid Challenge. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="text-gray-400 hover:text-white transition">Twitter/X</a>
                <a href="#" className="text-gray-400 hover:text-white transition">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-white transition">Discord</a>
              </div>
            </div>
          </footer>
        </div>
      </section>
    );
  }
  