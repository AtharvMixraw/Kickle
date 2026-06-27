export default function GameFeatures() {
  const features = [
    {
      icon: "⏱",
      title: "Race Against Time",
      description: "Think fast. You have limited time to complete the grid. Every second counts towards your final rarity score.",
      tile: "bg-surface-container hover:bg-surface-container-high",
      iconTile: "bg-primary text-black",
    },
    {
      icon: "🏆",
      title: "Compete & Challenge",
      description: "Climb the daily global leaderboards or create private leagues to settle the debate with your friends.",
      tile: "bg-background hover:bg-surface-container",
      iconTile: "bg-white text-black",
    },
    {
      icon: "🧠",
      title: "Test Knowledge",
      description: "From Ballon d'Or winners to one-season wonders. Match players to teams, countries, and stats.",
      tile: "bg-surface-container hover:bg-surface-container-high",
      iconTile: "bg-primary text-black",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-l-4 border-primary pl-6">
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tighter">Game<br />Features</h2>
          <p className="text-on-background/60 max-w-xs font-medium text-sm mt-4 md:mt-0 uppercase tracking-wider">
            The ultimate football trivia challenge for true fans.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-0 border-2 border-surface-container-highest">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-10 border-surface-container-highest transition-colors group ${feature.tile} ${index < 2 ? "border-b-2 md:border-b-0 md:border-r-2" : ""}`}
            >
              <div className={`w-12 h-12 ${feature.iconTile} flex items-center justify-center mb-8 text-2xl`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-extrabold mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-on-background/60 font-medium leading-tight text-sm uppercase">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}