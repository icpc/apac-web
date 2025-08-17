import { redirect } from 'next/navigation';

export default function YearPage({ params }: { params: { year: string } }) {
  redirect(`/championship/${params.year}/information`);
} 