import { redirect } from 'next/navigation';
import { AVAILABLE_YEARS } from "@/lib/constants";

export const dynamic = "force-static";

export default function ChampionshipPage() {
  const newest_year = Math.max(...AVAILABLE_YEARS.map(Number));
  redirect(`/championship/${newest_year}/information`);
} 
