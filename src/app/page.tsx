import Hero from './components/Hero';
import GameFeatures from './components/GameFeatures';
import HowItWorks from './components/HowItWorks';
import CTA from './components/CTA';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0a1e1a] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#0f3d31_0%,#0a1e1a_45%,#071713_100%)]" />
      <Hero />
      <GameFeatures />
      <HowItWorks />
      <CTA />
    </main>
  );
}
