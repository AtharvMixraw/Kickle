import type { LeagueTier } from "@/lib/league";

export interface CachedLeaderboardEntry {
  id: string;
  name: string;
  image: string | null;
  totalScore: number;
  gamesPlayed: number;
  rank: number;
  league: LeagueTier;
}

interface LeaderboardCacheStore {
  expiresAt: number;
  data: CachedLeaderboardEntry[];
}

const globalForLeaderboardCache = globalThis as unknown as {
  leaderboardCache?: LeaderboardCacheStore;
};

function getTtlMs(): number {
  const raw = Number(process.env.LEADERBOARD_CACHE_TTL_MS ?? "30000");
  return Number.isFinite(raw) && raw > 0 ? raw : 30000;
}

export function getLeaderboardCache(): CachedLeaderboardEntry[] | null {
  const cache = globalForLeaderboardCache.leaderboardCache;

  if (!cache) {
    return null;
  }

  if (Date.now() > cache.expiresAt) {
    globalForLeaderboardCache.leaderboardCache = undefined;
    return null;
  }

  return cache.data;
}

export function setLeaderboardCache(data: CachedLeaderboardEntry[]) {
  globalForLeaderboardCache.leaderboardCache = {
    data,
    expiresAt: Date.now() + getTtlMs(),
  };
}

export function invalidateLeaderboardCache() {
  globalForLeaderboardCache.leaderboardCache = undefined;
}
