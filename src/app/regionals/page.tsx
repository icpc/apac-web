import type { Metadata } from "next";
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
    <main className="py-6">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Participate in the 2026 ICPC Regionals
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
            Select the country where you are studying during the {cycleData.academicYear} academic year
            to see contest eligibility, domestic qualification paths, foreign team options, and official participation rules.
          </p>
        </div>

        <ContestFinder cycleData={cycleData} countries={countries} />
      </Container>
    </main>
  );
}
