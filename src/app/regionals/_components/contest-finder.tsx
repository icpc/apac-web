"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, Menu, X } from "lucide-react";
import Divider from "@/app/_components/divider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CopyTooltip } from "@/components/ui/tooltip";
import styles from "@/app/_styles/sidebar-nav-styles.module.css";
import {
  RegionalsCycleData,
  CountryInfo,
  evaluateEligibility,
  RegionalContest,
} from "@/lib/regionals";

interface ContestFinderProps {
  cycleData: RegionalsCycleData;
  countries: CountryInfo[];
}

interface NavSection {
  id: string;
  label: string;
}

export function ContestFinder({ cycleData, countries }: ContestFinderProps) {
  // Default to Japan (first host country)
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("JP");
  const [activeSectionId, setActiveSectionId] = useState<string>("country-selection");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const eligibility = useMemo(() => {
    return evaluateEligibility(selectedCountryCode, cycleData, countries);
  }, [selectedCountryCode, cycleData, countries]);

  const hostCountries = useMemo(() => {
    return countries.filter((c) => c.category === "host");
  }, [countries]);

  const nonHostCountries = useMemo(() => {
    return countries.filter((c) => c.category === "apac_non_host");
  }, [countries]);

  const isHostCountry = eligibility.category === "host";

  // Sidebar navigation items based on selected country
  const navSections: NavSection[] = useMemo(() => {
    const base: NavSection[] = [
      { id: "country-selection", label: "Country of Study" },
      { id: "guidelines", label: "Participation Guidelines" },
    ];

    if (isHostCountry) {
      base.push(
        { id: "primary-regional", label: "Primary Regional (Domestic)" },
        { id: "optional-regional", label: "Optional Second Regional (Foreign)" }
      );
    } else {
      base.push({ id: "available-regionals", label: "Available Regional Contests" });
    }

    base.push({ id: "contest-rules", label: "Applicable Contest Rules" });
    return base;
  }, [isHostCountry]);

  // Scrollspy observer to highlight active section in sidebar
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        }
      },
      {
        rootMargin: "-90px 0px -60% 0px",
        threshold: 0.1,
      }
    );

    navSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [navSections]);

  const scrollToSection = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      window.history.replaceState(null, "", `#${id}`);
      setActiveSectionId(id);
    }
  };

  const handleCopyUrl = async (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSection(slug);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const renderContestTable = (contests: RegionalContest[]) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse border border-border/60 dark:border-border/40 text-sm">
        <thead>
          <tr className="bg-text-header-others-cyanalpha">
            <th className="border border-border/60 dark:border-border/40 px-4 py-2.5 text-left font-bold text-text-header-secondary dark:text-text-header-secondary-dark">
              Name
            </th>
            <th className="border border-border/60 dark:border-border/40 px-4 py-2.5 text-left font-bold text-text-header-secondary dark:text-text-header-secondary-dark whitespace-nowrap">
              Location
            </th>
            <th className="border border-border/60 dark:border-border/40 px-4 py-2.5 text-left font-bold text-text-header-secondary dark:text-text-header-secondary-dark whitespace-nowrap">
              Date
            </th>
            <th className="border border-border/60 dark:border-border/40 px-4 py-2.5 text-left font-bold text-text-header-secondary dark:text-text-header-secondary-dark">
              Website / Contest Link
            </th>
          </tr>
        </thead>
        <tbody>
          {contests.map((contest) => (
            <tr
              key={contest.id}
              className="hover:bg-text-header-others-cyanalpha/30 transition-colors"
            >
              <td className="border border-border/40 dark:border-border/30 px-4 py-2.5 font-medium text-text-body dark:text-text-body-dark">
                {contest.name}
              </td>
              <td className="border border-border/40 dark:border-border/30 px-4 py-2.5 text-text-body dark:text-text-body-dark whitespace-nowrap">
                {contest.location}
              </td>
              <td className="border border-border/40 dark:border-border/30 px-4 py-2.5 text-text-body dark:text-text-body-dark whitespace-nowrap">
                {contest.date}
              </td>
              <td className="border border-border/40 dark:border-border/30 px-4 py-2.5">
                <Link
                  href={contest.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-links dark:text-text-links-dark hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <span>{contest.websiteLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row">
      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className={styles.mobileToggleButton}
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open Navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Drawer Modal */}
      {isSidebarOpen && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div className={`${styles.sidebarModal} ${isSidebarOpen ? styles.sidebarModalOpen : ""}`}>
        <aside className={styles.sidebarModalContent}>
          <div className={styles.sidebarContainer}>
            <div className={styles.sidebarHeader}>
              <div className="flex items-center justify-between w-full">
                <h2 className={`${styles.sidebarTitle} whitespace-nowrap text-xl font-bold flex-1 mt-[20px]`}>
                  The {cycleData.year} Regionals
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(false)}
                  aria-label="Close Navigation"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <ScrollArea className={styles.scrollArea}>
              <div className={styles.sidebarContent}>
                {navSections.map((section) => {
                  const isActive = activeSectionId === section.id;
                  return (
                    <div key={section.id} className={styles.sidebarSection}>
                      <Button
                        variant="ghost"
                        className={`${styles.mainNavButton} focus-visible:ring-0 focus-visible:ring-offset-0`}
                        onClick={(e) => {
                          scrollToSection(e, section.id);
                          setIsSidebarOpen(false);
                        }}
                      >
                        <span
                          className={`${styles.mainNavTitle} ${
                            isActive
                              ? "text-text-header-secondary dark:text-text-header-secondary-dark"
                              : ""
                          }`}
                        >
                          {section.label}
                        </span>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </aside>
      </div>

      {/* Desktop Sidebar - Always visible on desktop */}
      <aside className={styles.sidebarAside}>
        <div className={styles.sidebarContainer}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>The {cycleData.year} Regionals</h2>
          </div>
          <ScrollArea className={styles.scrollArea}>
            <div className={styles.sidebarContent}>
              {navSections.map((section) => {
                const isActive = activeSectionId === section.id;
                return (
                  <div key={section.id} className={styles.sidebarSection}>
                    <Button
                      variant="ghost"
                      className={`${styles.mainNavButton} focus-visible:ring-0 focus-visible:ring-offset-0`}
                      onClick={(e) => scrollToSection(e, section.id)}
                    >
                      <span
                        className={`${styles.mainNavTitle} ${
                          isActive
                            ? "text-text-header-secondary dark:text-text-header-secondary-dark"
                            : ""
                        }`}
                      >
                        {section.label}
                      </span>
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </aside>

      {/* Right Main Content Area */}
      <main className="flex-1 md:ml-8 min-w-0">
        {/* Section 1: Country of Study */}
        <div id="country-selection" className={styles.contentSection}>
          <div className={styles.contentSectionHeader}>
            <h2 className={styles.contentSectionTitle}>
              Country of Study{" "}
              <CopyTooltip
                onCopy={(e) => handleCopyUrl(e, "country-selection")}
                showCopiedTooltip={copiedSection === "country-selection"}
              >
                🔗
              </CopyTooltip>
            </h2>
          </div>
          <Divider className={styles.contentSectionDivider} />

          <p className="text-base text-text-body dark:text-text-body-dark mb-4 leading-relaxed">
            Participation pathways and contest eligibility are determined by the country where your institution is located during the {cycleData.academicYear} academic year.
          </p>

          <div className="max-w-md my-4">
            <label
              htmlFor="country-select"
              className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5"
            >
              Country of Institution
            </label>
            <select
              id="country-select"
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
              className="w-full rounded border border-border/70 dark:border-border/40 bg-white dark:bg-[#1f2937] px-3 py-2 text-sm text-text-body dark:text-text-body-dark focus:outline-none focus:ring-1 focus:ring-text-header-secondary"
            >
              <optgroup label="Regional Host Countries">
                {hostCountries.map((c) => (
                  <option key={c.code} value={c.code} className="dark:bg-[#1f2937]">
                    {c.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Other Asia Pacific Countries">
                {nonHostCountries.map((c) => (
                  <option key={c.code} value={c.code} className="dark:bg-[#1f2937]">
                    {c.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Immediate Status */}
          <p className="mt-2 text-base font-semibold text-text-header-secondary dark:text-text-header-secondary-dark">
            {eligibility.statusTitle}
          </p>

          {/* Disclaimer for South Pacific and other regions */}
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl">
            <strong>Note:</strong> This tool focuses on institutions in the Asia Pacific region. Teams from the South Pacific (Australia, New Zealand, etc.) qualify for the World Finals through the South Pacific Independent Regional Contest (SPIRC). Teams from other super-regions qualify through their respective regional contests.
          </p>
        </div>

        {/* Section 2: Participation Guidelines */}
        <div id="guidelines" className={styles.contentSection}>
          <div className={styles.contentSectionHeader}>
            <h2 className={styles.contentSectionTitle}>
              Participation Guidelines{" "}
              <CopyTooltip
                onCopy={(e) => handleCopyUrl(e, "guidelines")}
                showCopiedTooltip={copiedSection === "guidelines"}
              >
                🔗
              </CopyTooltip>
            </h2>
          </div>
          <Divider className={styles.contentSectionDivider} />

          <ul className="list-disc pl-5 space-y-2 text-base text-text-body dark:text-text-body-dark leading-relaxed">
            {eligibility.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>

        {/* Section 3 & 4: Regional Contests Breakdown */}
        {isHostCountry ? (
          <>
            {/* Primary Domestic Regional */}
            {eligibility.domesticRegional && (
              <div id="primary-regional" className={styles.contentSection}>
                <div className={styles.contentSectionHeader}>
                  <h2 className={styles.contentSectionTitle}>
                    Primary Regional Contest (Domestic){" "}
                    <CopyTooltip
                      onCopy={(e) => handleCopyUrl(e, "primary-regional")}
                      showCopiedTooltip={copiedSection === "primary-regional"}
                    >
                      🔗
                    </CopyTooltip>
                  </h2>
                </div>
                <Divider className={styles.contentSectionDivider} />

                <p className="text-base text-text-body dark:text-text-body-dark leading-relaxed">
                  Teams studying in {eligibility.country.name} must participate in this regional through its domestic preliminary contests (Rule A3).
                </p>

                {renderContestTable([eligibility.domesticRegional])}
              </div>
            )}

            {/* Optional Foreign Regional */}
            <div id="optional-regional" className={styles.contentSection}>
              <div className={styles.contentSectionHeader}>
                <h2 className={styles.contentSectionTitle}>
                  Optional Second Regional (Foreign){" "}
                  <CopyTooltip
                    onCopy={(e) => handleCopyUrl(e, "optional-regional")}
                    showCopiedTooltip={copiedSection === "optional-regional"}
                  >
                    🔗
                  </CopyTooltip>
                </h2>
              </div>
              <Divider className={styles.contentSectionDivider} />

              <p className="text-base text-text-body dark:text-text-body-dark leading-relaxed">
                Under Rule A6, teams from a country hosting a regional cannot compete in two foreign regionals. If your team wishes to participate in a second regional, you may choose at most <strong>one</strong> of the following foreign regionals:
              </p>

              {renderContestTable(eligibility.availableForeignRegionals)}
            </div>
          </>
        ) : (
          /* Single section for non-host countries */
          <div id="available-regionals" className={styles.contentSection}>
            <div className={styles.contentSectionHeader}>
              <h2 className={styles.contentSectionTitle}>
                Available Regional Contests{" "}
                <CopyTooltip
                  onCopy={(e) => handleCopyUrl(e, "available-regionals")}
                  showCopiedTooltip={copiedSection === "available-regionals"}
                >
                  🔗
                </CopyTooltip>
              </h2>
            </div>
            <Divider className={styles.contentSectionDivider} />

            <p className="text-base text-text-body dark:text-text-body-dark leading-relaxed">
              Since your university is in {eligibility.country.name} (which does not host a regional contest), your team may apply to participate in up to <strong>two</strong> of the following regional contests (Rule A1 & Rule A4):
            </p>

            {renderContestTable(cycleData.contests)}
          </div>
        )}

        {/* Section 5: Applicable Contest Rules */}
        <div id="contest-rules" className={styles.contentSection}>
          <div className={styles.contentSectionHeader}>
            <h2 className={styles.contentSectionTitle}>
              Applicable Contest Rules{" "}
              <CopyTooltip
                onCopy={(e) => handleCopyUrl(e, "contest-rules")}
                showCopiedTooltip={copiedSection === "contest-rules"}
              >
                🔗
              </CopyTooltip>
            </h2>
          </div>
          <Divider className={styles.contentSectionDivider} />

          <ul className="list-disc pl-5 space-y-2 text-base text-text-body dark:text-text-body-dark leading-relaxed">
            {eligibility.importantRules.map((rule, idx) => (
              <li key={idx}>
                <strong>{rule.ruleCode}:</strong> {rule.summary}
              </li>
            ))}
          </ul>

          {/* Official Contest Rules Disclaimer */}
          <div className="mt-6 p-4 rounded border border-border/50 dark:border-border/30 bg-text-header-others-cyanalpha/20 text-sm text-text-body dark:text-text-body-dark leading-relaxed">
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
        </div>
        </main>
      </div>
  );
}
