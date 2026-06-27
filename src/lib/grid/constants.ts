import type { ClubMetadata, CountryMetadata, AwardMetadata, ClubName, CountryName, AwardName } from "@/types/grid";

// Club metadata with colors and icons
export const CLUBS: Record<ClubName, ClubMetadata> = {
  "Arsenal": {
    name: "Arsenal",
    icon: "🔴",
    color: "#EF0107"
  },
  "Atletico Madrid": {
    name: "Atletico Madrid",
    icon: "🔴⚪",
    color: "#C8102E"
  },
  "Bayern Munich": {
    name: "Bayern Munich",
    icon: "🔴",
    color: "#DC052D"
  },
  "Barcelona": {
    name: "Barcelona",
    icon: "🔴🔵",
    color: "#A50044"
  },
  "Borussia Dortmund": {
    name: "Borussia Dortmund",
    icon: "🟡",
    color: "#FDE100"
  },
  "Chelsea": {
    name: "Chelsea",
    icon: "🔵",
    color: "#034694"
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
  "Napoli": {
    name: "Napoli",
    icon: "🔵",
    color: "#008CCE"
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
  },
  "Tottenham Hotspur": {
    name: "Tottenham Hotspur",
    icon: "⚪",
    color: "#132257"
  }
};

// Country metadata with flags
export const COUNTRIES: Record<CountryName, CountryMetadata> = {
  "Argentina": {
    name: "Argentina",
    flag: "🇦🇷"
  },
  "Belgium": {
    name: "Belgium",
    flag: "🇧🇪"
  },
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
  "Germany": {
    name: "Germany",
    flag: "🇩🇪"
  },
  "Italy": {
    name: "Italy",
    flag: "🇮🇹"
  },
  "Netherlands": {
    name: "Netherlands",
    flag: "🇳🇱"
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
  "Uruguay": {
    name: "Uruguay",
    flag: "🇺🇾"
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
  },
  "FIFA World Cup": {
    name: "FIFA World Cup",
    icon: "🌍",
    description: "FIFA World Cup Winner"
  },
  "Premier League": {
    name: "Premier League",
    icon: "🏅",
    description: "Premier League Winner"
  },
  "La Liga": {
    name: "La Liga",
    icon: "🏅",
    description: "La Liga Winner"
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