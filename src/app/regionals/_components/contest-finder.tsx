"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, ChevronRight, X } from "lucide-react";
import Divider from "@/app/_components/divider";
import StyledDropdown from "@/components/ui/styled-dropdown";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CopyTooltip } from "@/components/ui/tooltip";
import styles from "@/app/_styles/sidebar-nav-styles.module.css";
import markdownStyles from "@/app/_styles/markdown-styles.module.css";
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
  // Empty default country selection
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [activeSectionId, setActiveSectionId] = useState<string>("country-selection");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const countryOptions = useMemo(() => {
    return [
      { value: "", label: "Select country of institution..." },
      ...countries.map((c) => ({
        value: c.code,
        label: c.name,
      })),
    ];
  }, [countries]);

  const eligibility = useMemo(() => {
    if (!selectedCountryCode) return null;
    return evaluateEligibility(selectedCountryCode, cycleData, countries);
  }, [selectedCountryCode, cycleData, countries]);

  const isHostCountry = eligibility?.category === "host";

  // Sidebar navigation items based on selected country
  const navSections: NavSection[] = useMemo(() => {
    const base: NavSection[] = [
      { id: "country-selection", label: "Country of Study" },
    ];

    if (!selectedCountryCode) {
      base.push(
        { id: "available-regionals", label: "Available Regional Contests" },
        { id: "contest-rules", label: "Applicable Contest Rules" }
      );
      return base;
    }

    base.push({ id: "guidelines", label: "Participation Guidelines" });

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
  }, [selectedCountryCode, isHostCountry]);

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

  const renderSectionHeader = (title: string, slug: string, showDivider: boolean = true) => (
    <>
      {showDivider && (
        <div className="mt-8">
          <Divider />
        </div>
      )}
      <div className="flex flex-col transition-all duration-200 min-h-12 sm:min-h-16">
        <div className="hidden sm:block">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="m-0 pt-2 text-2xl font-bold text-text-header-secondary dark:text-text-header-secondary-dark">
                {title}{" "}
                <CopyTooltip
                  onCopy={(e) => handleCopyUrl(e, slug)}
                  showCopiedTooltip={copiedSection === slug}
                >
                  🔗
                </CopyTooltip>
              </h2>
            </div>
          </div>
        </div>
        <div className="sm:hidden">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="m-0 text-2xl font-bold text-text-header-secondary dark:text-text-header-secondary-dark">
              {title}{" "}
              <CopyTooltip
                onCopy={(e) => handleCopyUrl(e, slug)}
                showCopiedTooltip={copiedSection === slug}
              >
                🔗
              </CopyTooltip>
            </h2>
          </div>
        </div>
      </div>
    </>
  );

  const renderContestTable = (contests: RegionalContest[]) => (
    <div className="overflow-x-auto">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Date</th>
            <th>Website</th>
          </tr>
        </thead>
        <tbody>
          {contests.map((contest) => (
            <tr key={contest.id}>
              <td>{contest.name}</td>
              <td>{contest.location}</td>
              <td>{contest.date}</td>
              <td>
                <Link
                  href={contest.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium"
                >
                  <span>{contest.websiteLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5 inline flex-shrink-0" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto px-4 overflow-x-clip">
      <div className="flex flex-col md:flex-row">
        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          type="button"
          className="fixed top-24 -left-2 h-10 w-10 flex items-center justify-center rounded-md border border-border-navbar/50 bg-navbar/70 hover:bg-navbar/90 transition-all duration-200 backdrop-blur-lg z-[45] dark:border-border-navbar-dark/50 dark:bg-navbar-dark/70 dark:hover:bg-navbar-dark/90 md:hidden"
          aria-label="Toggle sidebar"
        >
          <ChevronRight
            className={`h-5 w-5 text-text-header-primary dark:text-text-header-primary-dark transition-transform duration-200 ${isSidebarOpen ? "rotate-180" : "rotate-0"
              }`}
          />
        </button>

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
                  <h1 className={`${styles.sidebarTitle} whitespace-nowrap text-xl font-bold flex-1 mt-[20px]`}>
                    The {cycleData.year} Regionals
                  </h1>
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
                            className={`${styles.mainNavTitle} ${isActive
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
              <h1 className={styles.sidebarTitle}>The {cycleData.year} Regionals</h1>
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
                          className={`${styles.mainNavTitle} ${isActive
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
          <section id="country-selection" className="pb-2 scroll-mt-24">
            {renderSectionHeader("Country of Study", "country-selection", false)}

            <div className="mt-6 sm:mt-0">
              <div className={`${markdownStyles.markdown} markdown`}>
                <p>
                  Participation pathways and contest eligibility are determined by the country where your institution is located during the {cycleData.academicYear} academic year.
                </p>

                <div className="my-4">
                  <StyledDropdown
                    value={selectedCountryCode}
                    onValueChange={setSelectedCountryCode}
                    options={countryOptions}
                    placeholder="Select country of institution..."
                    size="default"
                    staticWidth={true}
                    width={320}
                    triggerClassName="text-base font-medium justify-between min-w-[320px]"
                    itemsClassName="text-base"
                  />
                </div>

                {/* Immediate Status */}
                {eligibility && (
                  <p className="font-semibold text-text-header-secondary dark:text-text-header-secondary-dark">
                    {eligibility.statusTitle}
                  </p>
                )}

                {/* Disclaimer for South Pacific and other regions */}
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-3xl">
                  <strong>Note:</strong> This tool focuses on institutions in the Asia Pacific region. Teams from the South Pacific (Australia, New Zealand, etc.) qualify for the World Finals through the South Pacific Independent Regional Contest (SPIRC). Teams from other super-regions qualify through their respective regional contests.
                </p>
              </div>
            </div>
          </section>

          {/* When no country is selected yet: list all available contests without domestic/foreign distinction */}
          {!selectedCountryCode ? (
            <section id="available-regionals" className="pb-2 mt-10 scroll-mt-24">
              {renderSectionHeader("Available Regional Contests", "available-regionals", true)}

              <div className="mt-6 sm:mt-0">
                <div className={`${markdownStyles.markdown} markdown`}>
                  <p>
                    The following {cycleData.contests.length} regional contests are scheduled for the {cycleData.academicYear} Asia Pacific cycle:
                  </p>

                  {renderContestTable(cycleData.contests)}
                </div>
              </div>
            </section>
          ) : (
            <>
              {/* Section 2: Participation Guidelines */}
              {eligibility && (
                <section id="guidelines" className="pb-2 mt-10 scroll-mt-24">
                  {renderSectionHeader("Participation Guidelines", "guidelines", true)}

                  <div className="mt-6 sm:mt-0">
                    <div className={`${markdownStyles.markdown} markdown`}>
                      <ul>
                        {eligibility.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              )}

              {/* Section 3 & 4: Regional Contests Breakdown */}
              {isHostCountry && eligibility ? (
                <>
                  {/* Primary Domestic Regional */}
                  {eligibility.domesticRegional && (
                    <section id="primary-regional" className="pb-2 mt-10 scroll-mt-24">
                      {renderSectionHeader("Primary Regional Contest (Domestic)", "primary-regional", true)}

                      <div className="mt-6 sm:mt-0">
                        <div className={`${markdownStyles.markdown} markdown`}>
                          <p>
                            Teams studying in {eligibility.country.name} must participate in this regional through its domestic preliminary contests (Rule A3).
                          </p>

                          {renderContestTable([eligibility.domesticRegional])}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Optional Foreign Regional */}
                  <section id="optional-regional" className="pb-2 mt-10 scroll-mt-24">
                    {renderSectionHeader("Optional Second Regional (Foreign)", "optional-regional", true)}

                    <div className="mt-6 sm:mt-0">
                      <div className={`${markdownStyles.markdown} markdown`}>
                        <p>
                          Under Rule A6, teams from a country hosting a regional cannot compete in two foreign regionals. If your team wishes to participate in a second regional, you may choose at most <strong>one</strong> of the following foreign regionals:
                        </p>

                        {renderContestTable(eligibility.availableForeignRegionals)}
                      </div>
                    </div>
                  </section>
                </>
              ) : (
                /* Single section for non-host countries */
                eligibility && (
                  <section id="available-regionals" className="pb-2 mt-10 scroll-mt-24">
                    {renderSectionHeader("Available Regional Contests", "available-regionals", true)}

                    <div className="mt-6 sm:mt-0">
                      <div className={`${markdownStyles.markdown} markdown`}>
                        <p>
                          Since your university is in {eligibility.country.name} (which does not host a regional contest), your team may apply to participate in up to <strong>two</strong> of the following regional contests (Rule A1 & Rule A4):
                        </p>

                        {renderContestTable(cycleData.contests)}
                      </div>
                    </div>
                  </section>
                )
              )}
            </>
          )}

          {/* Section: Applicable Contest Rules */}
          <section id="contest-rules" className="pb-2 mt-10 scroll-mt-24">
            {renderSectionHeader("Applicable Contest Rules", "contest-rules", true)}

            <div className="mt-6 sm:mt-0">
              <div className={`${markdownStyles.markdown} markdown`}>
                <ul>
                  {(eligibility ? eligibility.importantRules : cycleData.rules.apac_non_host.importantRules).map((rule, idx) => (
                    <li key={idx}>
                      <strong>{rule.ruleCode}:</strong> {rule.summary}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
