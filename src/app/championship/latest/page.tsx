import { redirect } from "next/navigation";
import { AVAILABLE_YEARS } from "@/lib/constants";

export const dynamic = "force-static";

export default function ChampionshipLatestRoot() {
  const newestYear = Math.max(...AVAILABLE_YEARS.map(Number));
  redirect(`/championship/${newestYear}/information`);
}
