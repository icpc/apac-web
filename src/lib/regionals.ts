import { promises as fs } from "fs";
import path from "path";

export interface RegionalContest {
  id: string;
  name: string;
  shortName: string;
  location: string;
  hostCountryCode: string;
  hostCountryName: string;
  date: string;
  startDate: string;
  endDate: string;
  websiteUrl: string;
  websiteLabel: string;
  notes?: string;
}

export interface RuleDefinition {
  statusBadge: string;
  statusTitle: string;
  maxTotalRegionals: number;
  maxForeignRegionals: number;
  wildcardEligible: boolean;
  recommendations: string[];
  importantRules: {
    ruleCode: string;
    summary: string;
  }[];
}

export interface RegionalsCycleData {
  year: string;
  academicYear: string;
  rulesUrl: string;
  hostCountryCodes: string[];
  contests: RegionalContest[];
  rules: {
    host: RuleDefinition;
    apac_non_host: RuleDefinition;
    south_pacific: RuleDefinition;
    other_region: RuleDefinition;
  };
}

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  category: "host" | "apac_non_host" | "south_pacific" | "other_region";
  regionName: string;
}

export interface EligibilityResult {
  country: CountryInfo;
  category: "host" | "apac_non_host" | "south_pacific" | "other_region";
  domesticRegional?: RegionalContest;
  availableForeignRegionals: RegionalContest[];
  maxTotalRegionals: number;
  maxForeignRegionals: number;
  statusTitle: string;
  statusBadge: string;
  recommendations: string[];
  importantRules: {
    ruleCode: string;
    summary: string;
  }[];
  wildcardEligible: boolean;
  rulesUrl: string;
}

export async function getRegionalsData(year = "2026"): Promise<RegionalsCycleData> {
  const filePath = path.join(process.cwd(), "public", "pages", "regionals", `${year}.json`);
  const fileContents = await fs.readFile(filePath, "utf8");
  return JSON.parse(fileContents) as RegionalsCycleData;
}

export async function getCountries(): Promise<CountryInfo[]> {
  const filePath = path.join(process.cwd(), "public", "pages", "regionals", "countries.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  return JSON.parse(fileContents) as CountryInfo[];
}

export function evaluateEligibility(
  countryCode: string,
  cycleData: RegionalsCycleData,
  countries: CountryInfo[]
): EligibilityResult {
  const country = countries.find((c) => c.code === countryCode) || {
    code: "OTHER",
    name: "Other Super-Region",
    flag: "🌐",
    category: "other_region" as const,
    regionName: "Other Super-Region",
  };

  const domesticRegional = cycleData.contests.find((r) => r.hostCountryCode === country.code);
  const foreignRegionals = cycleData.contests.filter((r) => r.hostCountryCode !== country.code);

  const ruleConfig = cycleData.rules[country.category] || cycleData.rules.other_region;

  const replacePlaceholders = (text: string) =>
    text
      .replace(/\{countryName\}/g, country.name)
      .replace(/\{domesticRegionalName\}/g, domesticRegional?.name || "your domestic regional")
      .replace(/\{year\}/g, cycleData.year)
      .replace(/\{academicYear\}/g, cycleData.academicYear);

  return {
    country,
    category: country.category,
    domesticRegional,
    availableForeignRegionals: country.category === "host" ? foreignRegionals : cycleData.contests,
    maxTotalRegionals: ruleConfig.maxTotalRegionals,
    maxForeignRegionals: ruleConfig.maxForeignRegionals,
    statusTitle: replacePlaceholders(ruleConfig.statusTitle),
    statusBadge: ruleConfig.statusBadge,
    recommendations: ruleConfig.recommendations.map(replacePlaceholders),
    importantRules: ruleConfig.importantRules.map((rule) => ({
      ruleCode: rule.ruleCode,
      summary: replacePlaceholders(rule.summary),
    })),
    wildcardEligible: ruleConfig.wildcardEligible,
    rulesUrl: cycleData.rulesUrl,
  };
}
