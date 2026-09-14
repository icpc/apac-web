export const EXAMPLE_PATH = "blog-starter";
export const CMS_NAME = "Markdown";
export const HOME_OG_IMAGE_URL =
  "https://og-image.vercel.app/Next.js%20Blog%20Starter%20Example.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg";

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
