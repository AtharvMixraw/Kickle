import Hero from './components/Hero';
import GameFeatures from './components/GameFeatures';
import HowItWorks from './components/HowItWorks';
import CTA from './components/CTA';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a1e1a]">
      <Hero />
      <GameFeatures />
      <HowItWorks />
      <CTA />
    </main>
  );
}
