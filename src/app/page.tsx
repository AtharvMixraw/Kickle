"use client";

import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import GameFeatures from './components/GameFeatures';
import HowItWorks from './components/HowItWorks';
import Prizes from '@/app/components/Prizes';
import CTA from './components/CTA';
import WelcomeModal from './components/WelcomeModal';

export default function Home() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    // Check if user is a first-time visitor
    const hasVisited = localStorage.getItem('kickle_visited');
    if (!hasVisited) {
      // Show modal after a short delay for better UX
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
        localStorage.setItem('kickle_visited', 'true');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseModal = () => {
    setShowWelcomeModal(false);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-on-background">
      <WelcomeModal isOpen={showWelcomeModal} onClose={handleCloseModal} />
      <Hero />
      <GameFeatures />
      <HowItWorks />
      <Prizes />
      <CTA />
    </main>
  );
}
