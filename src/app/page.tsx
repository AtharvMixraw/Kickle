import Hero from './components/Hero';
import GameFeatures from './components/GameFeatures';
import HowItWorks from './components/HowItWorks';
import CTA from './components/CTA';

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-on-background">
      <Hero />
      <GameFeatures />
      <HowItWorks />
      <CTA />
    </main>
  );
}
