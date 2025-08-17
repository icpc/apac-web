import { redirect } from 'next/navigation';
import { AVAILABLE_YEARS } from '@/lib/constants';

// Redirects any `/championship/latest/*` path to the newest available year.
// If no extra path segments are provided, we assume `information` by default.
export default async function ChampionshipLatestPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = await params;
  const newestYear = Math.max(...AVAILABLE_YEARS.map(Number));
  const slugPath = resolvedParams.slug && resolvedParams.slug.length > 0 ? resolvedParams.slug.join('/') : 'information';
  redirect(`/championship/${newestYear}/${slugPath}`);
}
