export const ICPC_APAC = "The ICPC Asia Pacific Championship"

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
