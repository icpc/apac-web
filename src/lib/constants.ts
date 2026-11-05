export const ICPC_APAC = "The ICPC Asia Pacific Championship";

export const CURRENT_ACADEMIC_YEAR = "2026–2027";

export const HERO_SUBTITLE =
  "The premier programming competition for students in the Asia-Pacific region, a gateway to the ICPC World Finals.";

export const SITE_DESCRIPTION = `${HERO_SUBTITLE} ${CURRENT_ACADEMIC_YEAR} season.`;

export interface ChampionshipEdition {
  year: string;
  location: string;
}

export const CHAMPIONSHIPS: ChampionshipEdition[] = [
  { year: "2026", location: "Taoyuan, Taiwan" },
  { year: "2025", location: "Singapore" },
  { year: "2024", location: "Hanoi, Vietnam" },
];

export const AVAILABLE_YEARS = CHAMPIONSHIPS.map((c) => c.year);
