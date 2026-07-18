import { notFound } from 'next/navigation';
import { AVAILABLE_YEARS } from "@/lib/constants";
import ChampionshipClient from './championship-client';
import { getChampionshipSections, getSectionSubfolderContents } from "@/lib/championship-data";

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '');
};

export const dynamic = "force-static";

// Main page component
export default async function ChampionshipPage({ params }: { params: Promise<{ year: string, section: string }> }) {
  const { year, section } = await params;

  if (!AVAILABLE_YEARS.includes(year)) {
    notFound();
  }

  const subfolderContentsArray = await getSectionSubfolderContents(year, section);
  const sections = await getChampionshipSections(year);

  if (!sections.includes(section) || subfolderContentsArray.length === 0) {
    notFound();
  }

  const pageTopTitle = section.charAt(0).toUpperCase() + section.slice(1);
  const pageTopSlug = slugify(section);
  const showSubfolderTitles = subfolderContentsArray.length > 1;

  return (
    <ChampionshipClient 
      subfolderContentsArray={subfolderContentsArray}
      year={year}
      pageTopTitle={pageTopTitle}
      pageTopSlug={pageTopSlug}
      showSubfolderTitles={showSubfolderTitles}
    />
  );
}

export async function generateStaticParams() {
  const params: { year: string; section: string }[] = [];
  for (const year of AVAILABLE_YEARS) {
    const sections = await getChampionshipSections(year);
    params.push(...sections.map((section) => ({ year, section })));
  }
  return params;
}
