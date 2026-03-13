export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'New Grid Daily',
      description: 'A fresh puzzle drops every day. Set your reminders.',
    },
    {
      number: '02',
      title: 'Fill The Cells',
      description: "Select a cell and type a player's name that fits the criteria.",
    },
    {
      number: '03',
      title: 'Match Criteria',
      description: 'The player must satisfy both the row and column requirements.',
    },
    {
      number: '04',
      title: 'Rank Up',
      description: 'Submit your grid and see where you rank globally.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-transparent to-gray-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">How It Works</h2>
          <p className="text-gray-400 text-sm sm:text-base">Master the grid in four simple steps</p>
        </div>

        {/* Mobile: vertical list. md+: horizontal grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector — desktop only */}
              {index < 3 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-gradient-to-r from-[#00ff88] to-gray-800 z-0" />
              )}

              <div className="relative z-10">
                <div className="text-[#00ff88] text-4xl sm:text-5xl font-bold mb-3">{step.number}</div>
                <h3 className="text-white font-bold text-base sm:text-lg mb-2">{step.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}