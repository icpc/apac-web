import { redirect } from 'next/navigation';
import { AVAILABLE_YEARS } from '@/lib/constants';

export default function ChampionshipInfoRoot() {
  const newestYear = Math.max(...AVAILABLE_YEARS.map(Number));
  redirect(`/championship/${newestYear}/information`);
}
