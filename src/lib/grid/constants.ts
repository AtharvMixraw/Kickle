import type { ClubMetadata, CountryMetadata, AwardMetadata, ClubName, CountryName, AwardName } from "@/types/grid";

// Club metadata with colors and icons
export const CLUBS: Record<ClubName, ClubMetadata> = {
  "Barcelona": {
    name: "Barcelona",
    icon: "🔴🔵",
    color: "#A50044"
  },
  "Inter Miami": {
    name: "Inter Miami",
    icon: "👚",
    color: "#F7B5CD"
  },
  "Juventus": {
    name: "Juventus",
    icon: "⚫⚪",
    color: "#000000"
  },
  "Liverpool": {
    name: "Liverpool",
    icon: "🔴",
    color: "#C8102E"
  },
  "Manchester City": {
    name: "Manchester City",
    icon: "🔵",
    color: "#6CABDD"
  },
  "Manchester United": {
    name: "Manchester United",
    icon: "🔴",
    color: "#DA291C"
  },
  "Milan": {
    name: "Milan",
    icon: "🔴⚫",
    color: "#FB090B"
  },
  "Paris Saint-Germain": {
    name: "Paris Saint-Germain",
    icon: "🔵🔴",
    color: "#004170"
  },
  "Real Madrid": {
    name: "Real Madrid",
    icon: "⚪",
    color: "#FFFFFF"
  }
};

// Country metadata with flags
export const COUNTRIES: Record<CountryName, CountryMetadata> = {
  "Brazil": {
    name: "Brazil",
    flag: "🇧🇷"
  },
  "Croatia": {
    name: "Croatia",
    flag: "🇭🇷"
  },
  "Czechia": {
    name: "Czechia",
    flag: "🇨🇿"
  },
  "England": {
    name: "England",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿"
  },
  "France": {
    name: "France",
    flag: "🇫🇷"
  },
  "Italy": {
    name: "Italy",
    flag: "🇮🇹"
  },
  "Portugal": {
    name: "Portugal",
    flag: "🇵🇹"
  },
  "Spain": {
    name: "Spain",
    flag: "🇪🇸"
  },
  "Ukraine": {
    name: "Ukraine",
    flag: "🇺🇦"
  },
  "Argentina": {
    name: "Argentina",
    flag: "🇦🇷"
  }
};

// Award metadata
export const AWARDS: Record<AwardName, AwardMetadata> = {
  "UCL": {
    name: "UCL",
    icon: "🏆",
    description: "UEFA Champions League Winner"
  },
  "Ballon d'Or": {
    name: "Ballon d'Or",
    icon: "🌕",
    description: "Ballon d'Or Winner"
  },
  "Golden Boot": {
    name: "Golden Boot",
    icon: "🦶",
    description: "Golden Boot Winner"
  }
};

// Helper functions
export function getClubMetadata(clubName: ClubName): ClubMetadata {
  return CLUBS[clubName];
}

export function getCountryMetadata(countryName: CountryName): CountryMetadata {
  return COUNTRIES[countryName];
}

export function getAwardMetadata(awardName: AwardName): AwardMetadata {
  return AWARDS[awardName];
}

// Get all available clubs for random selection
export function getAllClubs(): ClubName[] {
  return Object.keys(CLUBS) as ClubName[];
}

// Get all available countries for random selection
export function getAllCountries(): CountryName[] {
  return Object.keys(COUNTRIES) as CountryName[];
}

// Get all available awards
export function getAllAwards(): AwardName[] {
  return Object.keys(AWARDS) as AwardName[];
}