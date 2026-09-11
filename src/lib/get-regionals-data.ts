import { promises as fs } from "fs";
import path from "path";
import { RegionalsCycleData, CountryInfo } from "@/lib/regionals";

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
