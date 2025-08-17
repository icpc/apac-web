import { redirect } from 'next/navigation';
import { AVAILABLE_YEARS } from '@/lib/constants';

// Redirects any `/championship/latest/*` path to the newest available year.
// If no extra path segments are provided, we assume `information` by default.
export default function ChampionshipLatestPage({ params }: { params: { slug?: string[] } }) {
  const newestYear = Math.max(...AVAILABLE_YEARS.map(Number));
  const slugPath = params.slug && params.slug.length > 0 ? params.slug.join('/') : 'information';
  redirect(`/championship/${newestYear}/${slugPath}`);
}
