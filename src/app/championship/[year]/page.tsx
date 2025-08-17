import { redirect } from 'next/navigation';

export default async function YearPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  redirect(`/championship/${year}/information`);
} 