"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Info,
  Sparkles,
  Plane,
  Building,
  Check,
  Search,
  Globe,
} from "lucide-react";
import {
  RegionalsCycleData,
  CountryInfo,
  evaluateEligibility,
} from "@/lib/regionals";

interface ContestFinderProps {
  cycleData: RegionalsCycleData;
  countries: CountryInfo[];
}

export function ContestFinder({ cycleData, countries }: ContestFinderProps) {
  // Default to Indonesia or first host country
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("JP");
  const [selectedContestIds, setSelectedContestIds] = useState<string[]>([
    "tokyo",
  ]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const eligibility = useMemo(() => {
    return evaluateEligibility(selectedCountryCode, cycleData, countries);
  }, [selectedCountryCode, cycleData, countries]);

  // Host countries for quick pill selection
  const hostCountries = useMemo(() => {
    return countries.filter((c) => c.category === "host");
  }, [countries]);

  const popularNonHostCountries = useMemo(() => {
    const codes = ["SG", "MY", "TH", "PH", "AU"];
    return countries.filter((c) => codes.includes(c.code));
  }, [countries]);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countries;
    const q = searchQuery.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.regionName.toLowerCase().includes(q)
    );
  }, [countries, searchQuery]);

  const toggleContestSelection = (contestId: string) => {
    if (selectedContestIds.includes(contestId)) {
      setSelectedContestIds((prev) => prev.filter((id) => id !== contestId));
    } else {
      if (selectedContestIds.length >= 2) {
        // Replace the second one or shift
        setSelectedContestIds([selectedContestIds[1], contestId]);
      } else {
        setSelectedContestIds((prev) => [...prev, contestId]);
      }
    }
  };

  // Rule validations for the 2-contest plan
  const planValidation = useMemo(() => {
    const selectedContests = cycleData.contests.filter((c) =>
      selectedContestIds.includes(c.id)
    );

    const hasDomestic =
      eligibility.domesticRegional &&
      selectedContestIds.includes(eligibility.domesticRegional.id);

    const foreignCount = selectedContests.filter(
      (c) => c.hostCountryCode !== eligibility.country.code
    ).length;

    let error: string | null = null;
    let warning: string | null = null;
    let success: string | null = null;

    if (eligibility.category === "host") {
      if (foreignCount > 1) {
        error = `Rule A6 Restriction: Teams studying in ${eligibility.country.name} cannot compete in two foreign regionals. If you participate in two regionals, one must be your domestic regional (${eligibility.domesticRegional?.shortName}).`;
      }
    }

    // Schedule proximity notice for Danang and Yunlin
    const hasDanang = selectedContestIds.includes("danang");
    const hasYunlin = selectedContestIds.includes("yunlin");
    if (hasDanang && hasYunlin) {
      warning =
        "Tight Schedule Notice: Danang Regional (10–11 Dec) and Yunlin Regional (12–14 Dec) are consecutive. Please account for international travel, visa processing, and transit time.";
    }

    if (!error && selectedContestIds.length === 2) {
      success =
        "Your 2-contest combination complies with regional rules! Ensure your team uses the exact same team name and 3 team members in both contests (Rule A1 & A2).";
    }

    return {
      selectedContests,
      hasDomestic,
      foreignCount,
      error,
      warning,
      success,
    };
  }, [selectedContestIds, eligibility, cycleData.contests]);

  const handleCountryChange = (code: string) => {
    setSelectedCountryCode(code);
    const newEligibility = evaluateEligibility(code, cycleData, countries);
    // If new country has a domestic regional, pre-select it
    if (newEligibility.domesticRegional) {
      setSelectedContestIds([newEligibility.domesticRegional.id]);
    } else {
      setSelectedContestIds([]);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Official Rules Reference Banner */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/70 dark:bg-blue-950/30 p-5 transition-all shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shrink-0 mt-0.5 sm:mt-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                  Official Asia Pacific Rules ({cycleData.academicYear})
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-medium">
                  Official Reference
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Full guidelines on site scores, university quotas, Championship
                selection, and World Finals qualification are available on the
                official rules page.
              </p>
            </div>
          </div>
          <Link
            href={cycleData.rulesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm shrink-0"
          >
            <span>Read Official Rules</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Step 1: Country Selector Section */}
      <section className="bg-white dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-2">
            <Globe className="w-4 h-4" />
            Step 1: Your University Location
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Where are you studying this {cycleData.academicYear} academic year?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1.5">
            ICPC participation eligibility is based on the country where your
            institution is located. Select your country to view contest pathways
            and rules that apply to your team.
          </p>
        </div>

        {/* Quick selection pills */}
        <div className="mt-6">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2.5">
            Host Countries & Quick Select
          </label>
          <div className="flex flex-wrap gap-2">
            {hostCountries.map((c) => {
              const isSelected = selectedCountryCode === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleCountryChange(c.code)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${isSelected
                    ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/30"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700"
                    }`}
                >
                  <span className="text-base">{c.flag}</span>
                  <span>{c.name}</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${isSelected
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                      }`}
                  >
                    Host
                  </span>
                </button>
              );
            })}
            {popularNonHostCountries.map((c) => {
              const isSelected = selectedCountryCode === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleCountryChange(c.code)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${isSelected
                    ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/30"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700"
                    }`}
                >
                  <span className="text-base">{c.flag}</span>
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dropdown Selector with search */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800/80 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="w-full sm:w-80 relative">
            <label
              htmlFor="country-select"
              className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5"
            >
              Or pick any country:
            </label>
            <select
              id="country-select"
              value={selectedCountryCode}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <optgroup label="Regional Host Countries">
                {hostCountries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} (Host)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Asia Pacific (Non-Host)">
                {countries
                  .filter((c) => c.category === "apac_non_host")
                  .map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="South Pacific">
                {countries
                  .filter((c) => c.category === "south_pacific")
                  .map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Other Regions">
                {countries
                  .filter((c) => c.category === "other_region")
                  .map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          <div className="flex-1 text-xs text-gray-500 dark:text-gray-400 sm:pt-5">
            Currently selected:{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {eligibility.country.flag} {eligibility.country.name}
            </span>{" "}
            ({eligibility.country.regionName})
          </div>
        </div>
      </section>

      {/* Step 2: Eligibility & Recommendations Card */}
      <section className="bg-white dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              {eligibility.statusBadge}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {eligibility.statusTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Max Regionals Limit
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {eligibility.maxTotalRegionals} Regionals Total
              </div>
            </div>
          </div>
        </div>

        {/* Guidance Bullet Points */}
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Participation Guidance & Guidelines
          </h3>
          <ul className="space-y-2.5">
            {eligibility.recommendations.map((rec, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-200 leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Important Rules Cards */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            Key Rules from the Official Regulation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {eligibility.importantRules.map((rule, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-800/40 p-4"
              >
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {rule.ruleCode}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {rule.summary}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wildcard announcement for non-host APAC */}
        {eligibility.wildcardEligible && (
          <div className="mt-6 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold">
                Guaranteed Championship Wild-Card Pathway (Rule D4(3)):
              </span>{" "}
              At least one team from {eligibility.country.name} will qualify for
              the Asia Pacific Championship! As long as your team is the highest
              ranked from your country across the regionals and solves at least
              one problem, you earn a spot at the Championship.
            </div>
          </div>
        )}
      </section>

      {/* Step 3: Five Regional Contests Grid */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-1">
              Step 2: Explore Available Contests
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              The Five 2026 Asia Pacific Regional Contests
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Click &ldquo;Add to Team Plan&rdquo; to test your 2-contest schedule
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {cycleData.contests.map((contest) => {
            const isDomestic =
              eligibility.domesticRegional?.id === contest.id;
            const isSelected = selectedContestIds.includes(contest.id);

            return (
              <div
                key={contest.id}
                className={`rounded-2xl border transition-all p-6 flex flex-col justify-between ${isSelected
                  ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/30 dark:bg-blue-950/20"
                  : isDomestic
                    ? "border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/10"
                    : "border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/70"
                  } shadow-sm hover:shadow-md`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {isDomestic ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 flex items-center gap-1">
                          <Building className="w-3.5 h-3.5" />
                          Your Domestic Regional (Primary)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 flex items-center gap-1">
                          <Plane className="w-3.5 h-3.5" />
                          Foreign Regional
                        </span>
                      )}
                      {contest.id === "danang" && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200">
                          Thu–Fri Contest
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleContestSelection(contest.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${isSelected
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200"
                        }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Selected
                        </>
                      ) : (
                        "+ Add to Plan"
                      )}
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {contest.name}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{contest.location}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {contest.date}
                      </span>
                    </div>
                    {contest.notes && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 pt-1 italic">
                        {contest.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Host: {contest.hostCountryName}
                  </span>
                  <Link
                    href={contest.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
                  >
                    <span>{contest.websiteLabel}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Step 4: Interactive 2-Contest Planner Card */}
      <section className="bg-white dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-1">
              Step 3: Team Participation Planner
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Your Team Contest Combination (Rule A1: Max 2 Contests)
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-xs font-semibold text-gray-700 dark:text-gray-300">
            Selected: {selectedContestIds.length} / 2 Regionals
          </div>
        </div>

        {/* Selected Contests List */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[0, 1].map((slotIndex) => {
            const contest = planValidation.selectedContests[slotIndex];
            if (!contest) {
              return (
                <div
                  key={slotIndex}
                  className="rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-800 p-5 flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500 min-h-[110px]"
                >
                  <p className="text-xs font-medium">Slot #{slotIndex + 1} Empty</p>
                  <p className="text-[11px] mt-1 text-gray-400">
                    Click &ldquo;+ Add to Plan&rdquo; on any regional above
                  </p>
                </div>
              );
            }

            const isDomestic =
              eligibility.domesticRegional?.id === contest.id;

            return (
              <div
                key={contest.id}
                className="rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/40 p-4 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      Slot #{slotIndex + 1}
                    </span>
                    {isDomestic ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-medium">
                        Domestic
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 font-medium">
                        Foreign
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {contest.shortName}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {contest.date} • {contest.location}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleContestSelection(contest.id)}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline px-2 py-1"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        {/* Validation Feedback Messages */}
        <div className="mt-5 space-y-3">
          {planValidation.error && (
            <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm leading-relaxed">
                {planValidation.error}
              </div>
            </div>
          )}

          {planValidation.warning && (
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm leading-relaxed">
                {planValidation.warning}
              </div>
            </div>
          )}

          {planValidation.success && (
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm leading-relaxed">
                {planValidation.success}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
