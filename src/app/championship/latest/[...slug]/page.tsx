import { redirect } from 'next/navigation';
import { AVAILABLE_YEARS } from '@/lib/constants';
import { getChampionshipSections } from '@/lib/championship-data';

export const dynamic = "force-static";

// Redirects any `/championship/latest/*` path to the newest available year.
// If no extra path segments are provided, we assume `information` by default.
export default async function ChampionshipLatestPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = await params;
  const newestYear = AVAILABLE_YEARS[0];
  const slugPath = resolvedParams.slug && resolvedParams.slug.length > 0 ? resolvedParams.slug.join('/') : 'information';
  redirect(`/championship/${newestYear}/${slugPath}`);
}

export async function generateStaticParams() {
  const newestYear = AVAILABLE_YEARS[0];
  const sections = await getChampionshipSections(newestYear);
  return sections.map((section) => ({ slug: [section] as string[] }));
}
