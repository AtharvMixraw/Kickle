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
    <section id="how-it-works" className="py-24 border-t-2 border-surface-container-highest bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-0 border-2 border-white">
          <div className="lg:col-span-4 p-12 border-b-2 lg:border-b-0 lg:border-r-2 border-white bg-primary text-black">
            <h2 className="text-5xl font-extrabold tracking-tighter mb-6">How It <br /> Works</h2>
            <p className="font-bold text-sm uppercase tracking-wider mb-8">Master the grid in four simple steps</p>
            <a className="inline-flex items-center gap-2 font-extrabold text-sm border-b-2 border-black pb-1 hover:gap-4 transition-all" href="#">
              View Full Rules <span aria-hidden>→</span>
            </a>
          </div>

          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-0">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`p-10 border-surface-container-highest ${
                  index === 0 ? "border-b-2 sm:border-r-2 bg-surface-container" : ""
                } ${index === 1 ? "border-b-2 bg-background" : ""} ${index === 2 ? "sm:border-r-2 bg-background" : ""} ${index === 3 ? "bg-surface-container" : ""}`}
              >
                <span className={`text-5xl font-extrabold mb-4 block ${index === 0 ? "text-primary" : "text-white"}`}>
                  {step.number}
                </span>
                <h3 className="text-xl font-extrabold mb-2">{step.title}</h3>
                <p className="text-sm text-on-background/60 font-medium uppercase">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}