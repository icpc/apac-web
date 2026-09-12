import { promises as fs } from "fs";
import path from "path";
import { RegionalsCycleData, CountryInfo } from "@/lib/regionals";

export async function getAvailableRegionalsYears(): Promise<string[]> {
  const dirPath = path.join(process.cwd(), "public", "pages", "regionals");
  try {
    const files = await fs.readdir(dirPath);
    return files
      .filter((file) => /^\d{4}\.json$/.test(file))
      .map((file) => file.replace(".json", ""))
      .sort((a, b) => Number(b) - Number(a));
  } catch {
    return [];
  }
}

export async function getLatestRegionalsYear(): Promise<string> {
  const years = await getAvailableRegionalsYears();
  if (years.length === 0) {
    throw new Error("No regional contest data files found in public/pages/regionals");
  }
  return years[0];
}

export async function getRegionalsData(year: string): Promise<RegionalsCycleData | null> {
  const filePath = path.join(process.cwd(), "public", "pages", "regionals", `${year}.json`);
  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContents) as RegionalsCycleData;
  } catch {
    return null;
  }
}

export async function getCountries(): Promise<CountryInfo[]> {
  const filePath = path.join(process.cwd(), "public", "pages", "regionals", "countries.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  return JSON.parse(fileContents) as CountryInfo[];
}

