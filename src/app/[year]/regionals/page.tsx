import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import Container from "@/components/common/container";
import { ContestFinder } from "@/app/regionals/_components/contest-finder";
import {
  getRegionalsData,
  getCountries,
  getAvailableRegionalsYears,
} from "@/lib/get-regionals-data";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;
  const cycleData = await getRegionalsData(year);

  if (!cycleData) {
    return {
      title: "Page Not Found | ICPC Asia Pacific",
    };
  }

  return {
    title: `Participate in ${year} ICPC Asia Pacific Regionals | ICPC Asia Pacific`,
    description: `Find which ${cycleData.academicYear} ICPC Asia Pacific regional contests your university team is eligible to participate in, and plan your competition schedule based on official rules.`,
  };
}

export default async function RegionalsYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const availableYears = await getAvailableRegionalsYears();

  if (!availableYears.includes(year)) {
    notFound();
  }

  const [cycleData, countries] = await Promise.all([
    getRegionalsData(year),
    getCountries(),
  ]);

  if (!cycleData) {
    notFound();
  }

  return (
    <div className="relative py-6">
      <Container>
        <div className="flex flex-col w-full">
          {/* Title and Subtitle outside the subpage */}
          <div className="ml-6 mb-6 sm:ml-0">
            <h1 className="text-4xl font-bold text-text-header-secondary mb-8">
              Participate in the {year} ICPC Regionals
            </h1>
            <p className="text-lg text-text-body dark:text-text-body-dark leading-relaxed mb-4">
              This guide outlines the regional contest pathways, domestic preliminary requirements, and foreign team participation rules for universities across the Asia Pacific region during the {cycleData.academicYear} cycle.
            </p>
            <p className="text-lg text-text-body dark:text-text-body-dark leading-relaxed">
              The top teams from each regionals will be invited to the 2027 Asia Pacific Championship in Tokyo, Japan.
            </p>
          </div>

          {/* Official Contest Rules banner at the top before the subpage */}
          <div className="p-4 ml-6 rounded border border-border/50 dark:border-border/30 bg-text-header-others-cyanalpha/20 text-base text-text-body dark:text-text-body-dark leading-relaxed mb-8 ml-6 sm:ml-0">
            <strong>Official Contest Rules:</strong> Please refer to the official{" "}
            <Link
              href={cycleData.rulesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-links dark:text-text-links-dark underline font-semibold inline-flex items-center gap-1"
            >
              <span>ICPC Asia Pacific Rules ({cycleData.academicYear})</span>
              <ExternalLink className="w-3.5 h-3.5 inline" />
            </Link>{" "}
            for the complete set of regulations, including detailed formulas for site scores, university quotas, Championship selection, and World Finals qualification.
          </div>

          {/* 2-Column Subpage Layout */}
          <div className="w-full px-6">
            <ContestFinder cycleData={cycleData} countries={countries} />
          </div>
        </div>
      </Container>
    </div>
  );
}

export async function generateStaticParams() {
  const years = await getAvailableRegionalsYears();
  return years.map((year) => ({ year }));
}
