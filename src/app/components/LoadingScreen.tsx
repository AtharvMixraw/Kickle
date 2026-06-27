"use client";

import { useEffect, useState } from "react";

const FACTS = [
  "The first World Cup was held in 1930 and won by Uruguay.",
  "Football is the most popular sport in the world with over 3.5 billion fans.",
  "The fastest goal in professional football history was scored in just 2.1 seconds.",
  "Greenland cannot join FIFA because the climate makes it impossible to grow regulation grass pitches.",
  "The highest score ever recorded in a match was 149–0 in Madagascar in 2002.",
  "Lionel Messi has won the Ballon d'Or a record 8 times.",
  "The original footballs were made from inflated pig bladders.",
  "Cristiano Ronaldo is the first player to score at 5 different World Cups.",
  "The Premier League is watched in over 188 countries around the world.",
  "Brazil is the only nation to have played in every single FIFA World Cup.",
  "Pelé scored over 1,000 career goals — a feat no other player has matched.",
  "The UEFA Champions League anthem was composed by Tony Britten in 1992.",
];

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "Checking your answers..." }: LoadingScreenProps) {
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * FACTS.length));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setVisible(false);
      setTimeout(() => {
        setFactIndex((prev) => (prev + 1) % FACTS.length);
        setVisible(true);
      }, 400);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-between py-16 px-6 overflow-hidden">
      <div className="w-full max-w-3xl border-2 border-surface-container-highest p-4 flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em]">
        <span className="text-primary">Kickle System</span>
        <span className="text-on-background/60">Validating Grid</span>
      </div>

      <div className="flex flex-col items-center gap-8 w-full max-w-3xl">
        <div className="relative border-2 border-white p-6 bg-surface-container">
          <svg
            className="w-24 h-24 text-white animate-[spin_6s_linear_infinite]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M4.93 4.93l2.83 2.83" />
            <path d="M16.24 16.24l2.83 2.83" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <path d="M4.93 19.07l2.83-2.83" />
            <path d="M16.24 7.76l2.83-2.83" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 7l-2.5 2.5 1 3.5 3 0 1-3.5z" />
          </svg>
        </div>

        <div className="w-full h-3 bg-surface-container border-2 border-surface-container-highest overflow-hidden">
          <div
            className="h-full bg-primary"
            style={{ animation: "progressLoad 3s ease-in-out infinite" }}
          />
        </div>

        <div className="text-center space-y-4 border-2 border-white p-6 bg-surface-container w-full">
          <p className="text-primary uppercase tracking-[0.2em] text-xs font-extrabold">
            Did you know?
          </p>
          <p
            className="text-white text-xl md:text-2xl font-extrabold leading-snug transition-all duration-400 uppercase"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            {FACTS[factIndex]}
          </p>
        </div>
      </div>

      <p className="text-on-background/50 text-xs font-bold tracking-[0.2em] uppercase animate-pulse">
        {message}
      </p>

      <style>{`
        @keyframes progressLoad {
          0%   { width: 0%; }
          60%  { width: 85%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}