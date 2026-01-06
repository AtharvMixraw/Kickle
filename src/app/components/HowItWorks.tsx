export default function HowItWorks() {
    const steps = [
      {
        number: '01',
        title: 'New Grid Daily',
        description: 'A fresh puzzle drops every 12 hours. Set your reminders.'
      },
      {
        number: '02',
        title: 'Fill The Cells',
        description: "Select a cell and type a player's name that fits the criteria."
      },
      {
        number: '03',
        title: 'Match Criteria',
        description: 'The player must satisfy both the row and column requirements.'
      },
      {
        number: '04',
        title: 'Rank Up',
        description: 'Submit your grid, check your rarity score, and see your rank.'
      }
    ];
  
    return (
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">How It Works</h2>
              <p className="text-gray-400">Master the grid in four simple steps</p>
            </div>
            {/* <a href="#" className="text-[#00ff88] hover:text-[#00dd77] font-medium flex items-center gap-2">
              View full rules <span>→</span>
            </a> */}
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-gradient-to-r from-[#00ff88] to-gray-800"></div>
                )}
                
                <div className="relative z-10">
                  <div className="text-[#00ff88] text-5xl font-bold mb-4">{step.number}</div>
                  <h3 className="text-white font-bold text-xl mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  