export default function GameFeatures() {
    const features = [
      {
        icon: '🍎',
        title: 'Race Against Time',
        description: 'Think fast. You have limited time to complete the grid. Every second counts towards your final rarity score.',
        bgColor: 'from-green-900/20'
      },
      {
        icon: '🏆',
        title: 'Compete & Challenge',
        description: 'Climb the daily global leaderboards or create private leagues to settle the debate with your friends.',
        bgColor: 'from-yellow-900/20'
      },
      {
        icon: '🧠',
        title: 'Test Your Knowledge',
        description: "From Ballon d'Or winners to one-season wonders. Match players to teams, countries, and stats.",
        bgColor: 'from-blue-900/20'
      }
    ];
  
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Game Features</h2>
            <p className="text-gray-400">Experience the ultimate football trivia challenge designed for true fans.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-gray-900/50 to-transparent border border-gray-800 rounded-2xl p-8 hover:border-[#00ff88] transition group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#00ff88]/20 to-transparent rounded-xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="text-white font-bold text-xl mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  