"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ChevronRight, ExternalLink, X } from "lucide-react";
import StyledDropdown from "@/components/ui/styled-dropdown";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import styles from "@/app/_styles/sidebar-nav-styles.module.css";
import {
  RegionalsCycleData,
  CountryInfo,
  evaluateEligibility,
} from "@/lib/regionals";
import { ContestTable } from "./contest-table";
import { FinderSection } from "./finder-section";
import { RegionalSidebarNav, NavSection } from "./regional-sidebar-nav";

interface ContestFinderProps {
  cycleData: RegionalsCycleData;
  countries: CountryInfo[];
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
  const isSouthPacific = eligibility?.category === "south_pacific";

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
    } else if (isSouthPacific) {
      base.push({ id: "south-pacific-regional", label: "South Pacific Regional Contest" });
    } else {
      base.push({ id: "available-regionals", label: "Available Regional Contests" });
    }

    base.push({ id: "contest-rules", label: "Applicable Contest Rules" });
    return base;
  }, [selectedCountryCode, isHostCountry, isSouthPacific]);

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

  const findCountryCode = React.useCallback(
    (param: string | null): string => {
      if (!param) return "";
      const cleanParam = param.trim().toLowerCase();
      const match = countries.find(
        (c) =>
          c.code.toLowerCase() === cleanParam ||
          c.name.toLowerCase() === cleanParam ||
          c.name.toLowerCase().replace(/\s+/g, "-") === cleanParam
      );
      return match ? match.code : "";
    },
    [countries]
  );

  // Sync country selection from URL query param on initial mount and handle initial anchor scroll
  useEffect(() => {
    const url = new URL(window.location.href);
    const countryParam = url.searchParams.get("country");
    if (countryParam) {
      const matched = findCountryCode(countryParam);
      if (matched) {
        setSelectedCountryCode(matched);
      }
    }

    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const timer = setTimeout(() => {
        const el = document.getElementById(hash);
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
          setActiveSectionId(hash);
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [findCountryCode]);

  // Keep state in sync with browser back / forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const url = new URL(window.location.href);
      const countryParam = url.searchParams.get("country");
      setSelectedCountryCode(findCountryCode(countryParam));

      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setActiveSectionId(hash);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [findCountryCode]);

  const handleCountryChange = (code: string) => {
    setSelectedCountryCode(code);
    const url = new URL(window.location.href);
    if (code) {
      url.searchParams.set("country", code);
    } else {
      url.searchParams.delete("country");
    }
    window.history.replaceState(null, "", url.toString());
  };

  const scrollToSection = (id: string) => {
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
      const url = new URL(window.location.href);
      url.hash = id;
      window.history.replaceState(null, "", url.toString());
      setActiveSectionId(id);
    }
  };

  const handleCopyUrl = async (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    if (selectedCountryCode) {
      url.searchParams.set("country", selectedCountryCode);
    } else {
      url.searchParams.delete("country");
    }
    url.hash = slug;
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopiedSection(slug);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <div className="w-full overflow-x-clip">
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
                <RegionalSidebarNav
                  navSections={navSections}
                  activeSectionId={activeSectionId}
                  onSelectSection={(id) => {
                    scrollToSection(id);
                    setIsSidebarOpen(false);
                  }}
                />
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
              <RegionalSidebarNav
                navSections={navSections}
                activeSectionId={activeSectionId}
                onSelectSection={scrollToSection}
              />
            </ScrollArea>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <main className="flex-1 md:ml-8 min-w-0">
          {/* Section 1: Country of Study */}
          <FinderSection
            id="country-selection"
            title="Country of Study"
            showDivider={false}
            onCopyUrl={handleCopyUrl}
            isCopied={copiedSection === "country-selection"}
          >
            <p>
              Participation pathways and contest eligibility are determined by the country where your institution is located during the {cycleData.academicYear} academic year.
            </p>

            <div className="my-4">
              <StyledDropdown
                value={selectedCountryCode}
                onValueChange={handleCountryChange}
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
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Note:</strong> This tool focuses on institutions in the Asia Pacific region. Teams from the South Pacific (Australia, New Zealand, etc.) qualify for the World Finals through the South Pacific Independent Regional Contest (SPIRC). Teams from other super-regions qualify through their respective regional contests.
            </p>
          </FinderSection>

          {/* Section 2: Participation Guidelines (Host and Non-Host) */}
          {eligibility && (
            <FinderSection
              id="guidelines"
              title="Participation Guidelines"
              showDivider={true}
              onCopyUrl={handleCopyUrl}
              isCopied={copiedSection === "guidelines"}
            >
              <ul>
                {eligibility.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </FinderSection>
          )}

          {/* Host Countries: Breakdown of Domestic vs Foreign Contests */}
          {isHostCountry && eligibility && (
            <>
              {eligibility.domesticRegional && (
                <FinderSection
                  id="primary-regional"
                  title="Primary Regional Contest (Domestic)"
                  showDivider={true}
                  onCopyUrl={handleCopyUrl}
                  isCopied={copiedSection === "primary-regional"}
                >
                  <p>
                    Teams studying in {eligibility.country.name} must participate in this regional through its domestic preliminary contests (Rule A3).
                  </p>
                  <ContestTable contests={[eligibility.domesticRegional]} />
                </FinderSection>
              )}

              <FinderSection
                id="optional-regional"
                title="Optional Second Regional (Foreign)"
                showDivider={true}
                onCopyUrl={handleCopyUrl}
                isCopied={copiedSection === "optional-regional"}
              >
                <p>
                  Under Rule A6, teams from a country hosting a regional cannot compete in two foreign regionals. If your team wishes to participate in a second regional, you may choose at most <strong>one</strong> of the following foreign regionals:
                </p>
                <ContestTable contests={eligibility.availableForeignRegionals} />
              </FinderSection>
            </>
          )}

          {/* South Pacific Regional Contest Referral */}
          {isSouthPacific && eligibility && (
            <FinderSection
              id="south-pacific-regional"
              title="South Pacific Regional Contest"
              showDivider={true}
              onCopyUrl={handleCopyUrl}
              isCopied={copiedSection === "south-pacific-regional"}
            >
              <p>
                Universities in {eligibility.country.name} participate in the South Pacific regional contests rather than the Asia Pacific regional contests.
              </p>
              <p className="mt-2">
                For complete details on contest schedules, preliminary rounds, and registration, please refer to the official South Pacific website:
              </p>
              <p className="mt-4">
                <a
                  href="https://sppcontests.org/icpc-2026/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-text-link hover:underline dark:text-text-link-dark"
                >
                  <span>ICPC South Pacific 2026 (sppcontests.org)</span>
                  <ExternalLink className="w-4 h-4 inline flex-shrink-0" />
                </a>
              </p>
            </FinderSection>
          )}

          {/* Available Regional Contests (Shown when no country is selected or for non-host APAC countries) */}
          {(!selectedCountryCode || (!isHostCountry && !isSouthPacific && eligibility)) && (
            <FinderSection
              id="available-regionals"
              title="Available Regional Contests"
              showDivider={true}
              onCopyUrl={handleCopyUrl}
              isCopied={copiedSection === "available-regionals"}
            >
              <p>
                {!selectedCountryCode
                  ? `The following ${cycleData.contests.length} regional contests are scheduled for the ${cycleData.academicYear} Asia Pacific cycle:`
                  : `Since your university is in ${eligibility?.country.name} (which does not host a regional contest), your team may apply to participate in up to two of the following regional contests (Rule A1 & Rule A4):`}
              </p>
              <ContestTable contests={cycleData.contests} />
            </FinderSection>
          )}

          {/* Applicable Contest Rules */}
          <FinderSection
            id="contest-rules"
            title="Applicable Contest Rules"
            showDivider={true}
            onCopyUrl={handleCopyUrl}
            isCopied={copiedSection === "contest-rules"}
          >
            <ul>
              {(eligibility ? eligibility.importantRules : cycleData.rules.apac_non_host.importantRules).map((rule, idx) => (
                <li key={idx}>
                  <strong>{rule.ruleCode}:</strong> {rule.summary}
                </li>
              ))}
            </ul>
          </FinderSection>
        </main>
      </div>
    </div>
  );
}
