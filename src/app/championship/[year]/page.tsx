import { redirect } from 'next/navigation';
import { AVAILABLE_YEARS } from '@/lib/constants';

export const dynamic = "force-static";

export default async function YearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  redirect(`/championship/${year}/information`);
}

export function generateStaticParams() {
  return AVAILABLE_YEARS.map((year) => ({ year }));
}
