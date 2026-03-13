export default function GameFeatures() {
  const features = [
    {
      icon: '⚡',
      title: 'Race Against Time',
      description: 'Think fast. You have limited time to complete the grid. Every second counts towards your final score.',
    },
    {
      icon: '🏆',
      title: 'Compete & Challenge',
      description: 'Climb the daily global leaderboards and settle the debate with your friends.',
    },
    {
      icon: '🧠',
      title: 'Test Your Knowledge',
      description: "From Ballon d'Or winners to one-season wonders. Match players to teams, countries, and stats.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Game Features</h2>
          <p className="text-gray-400 text-sm sm:text-base">The ultimate football trivia challenge for true fans.</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-900/50 to-transparent border border-gray-800 rounded-2xl p-6 hover:border-[#00ff88] transition group"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}