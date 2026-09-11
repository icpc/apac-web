import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import Container from "@/components/common/container";
import { ContestFinder } from "./_components/contest-finder";
import { getRegionalsData, getCountries } from "@/lib/get-regionals-data";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Participate in 2026 ICPC Asia Pacific Regionals | ICPC Asia Pacific",
  description:
    "Find which 2026/2027 ICPC Asia Pacific regional contests your university team is eligible to participate in, and plan your competition schedule based on official rules.",
};

export default async function RegionalsPage() {
  const [cycleData, countries] = await Promise.all([
    getRegionalsData("2026"),
    getCountries(),
  ]);

  return (
    <div className="relative py-6">
      <Container>
        <div className="flex flex-col w-full">
          {/* Title and Subtitle outside the subpage */}
          <div className="mb-6 ml-6 sm:ml-0">
            <h1 className="text-4xl font-bold text-text-header-secondary mb-8">
              Participate in the 2026 ICPC Regionals
            </h1>
            <p className="text-base text-text-body dark:text-text-body-dark max-w-3xl leading-relaxed">
              This guide outlines the regional contest pathways, domestic preliminary requirements, and foreign team participation rules for universities across the Asia Pacific region during the {cycleData.academicYear} cycle.
            </p>
          </div>

          {/* Official Contest Rules banner at the top before the subpage */}
          <div className="p-4 rounded border border-border/50 dark:border-border/30 bg-text-header-others-cyanalpha/20 text-sm text-text-body dark:text-text-body-dark leading-relaxed mb-8 ml-6 sm:ml-0">
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
          <div className="w-full">
            <ContestFinder cycleData={cycleData} countries={countries} />
          </div>
        </div>
      </Container>
    </div>
  );
}
