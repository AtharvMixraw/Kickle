export interface LeagueTier {
  key: string;
  name: string;
  emoji: string;
  minPoints: number;
  maxPoints: number | null;
  accentClass: string;
  borderClass: string;
  bgClass: string;
}

export const LEAGUE_TIERS: LeagueTier[] = [
  {
    key: "academy-rookie",
    name: "Academy Rookie",
    emoji: "🍼",
    minPoints: 0,
    maxPoints: 9,
    accentClass: "text-slate-300",
    borderClass: "border-slate-400/30",
    bgClass: "bg-slate-400/10",
  },
  {
    key: "bench-warmer",
    name: "Bench Warmer",
    emoji: "🪑",
    minPoints: 10,
    maxPoints: 24,
    accentClass: "text-amber-300",
    borderClass: "border-amber-400/30",
    bgClass: "bg-amber-400/10",
  },
  {
    key: "starting-xi",
    name: "Starting XI",
    emoji: "⚽",
    minPoints: 25,
    maxPoints: 49,
    accentClass: "text-emerald-300",
    borderClass: "border-emerald-400/30",
    bgClass: "bg-emerald-400/10",
  },
  {
    key: "club-captain",
    name: "Club Captain",
    emoji: "🎖️",
    minPoints: 50,
    maxPoints: 79,
    accentClass: "text-sky-300",
    borderClass: "border-sky-400/30",
    bgClass: "bg-sky-400/10",
  },
  {
    key: "continental-star",
    name: "Continental Star",
    emoji: "🌍",
    minPoints: 80,
    maxPoints: 119,
    accentClass: "text-violet-300",
    borderClass: "border-violet-400/30",
    bgClass: "bg-violet-400/10",
  },
  {
    key: "champions-elite",
    name: "Champions Elite",
    emoji: "🏆",
    minPoints: 120,
    maxPoints: 179,
    accentClass: "text-yellow-300",
    borderClass: "border-yellow-400/30",
    bgClass: "bg-yellow-400/10",
  },
  {
    key: "ballon-dor-legend",
    name: "Ballon d'Or Legend",
    emoji: "👑",
    minPoints: 180,
    maxPoints: null,
    accentClass: "text-orange-300",
    borderClass: "border-orange-400/30",
    bgClass: "bg-orange-400/10",
  },
];

export function getLeagueTier(totalPoints: number): LeagueTier {
  return (
    LEAGUE_TIERS.find((tier) => {
      const withinLowerBound = totalPoints >= tier.minPoints;
      const withinUpperBound = tier.maxPoints == null || totalPoints <= tier.maxPoints;
      return withinLowerBound && withinUpperBound;
    }) ?? LEAGUE_TIERS[0]
  );
}
