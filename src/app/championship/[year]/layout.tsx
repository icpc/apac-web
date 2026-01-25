import ChampionshipLayout from '@/app/_components/championship-layout';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ year: string }>; 
}) {
  const { year } = await params;

  return (
    <ChampionshipLayout year={year}>
      {children}
    </ChampionshipLayout>
  );
} 