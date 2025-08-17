import { join } from "path";

export function getLatestChampionshipYear() {
  if (typeof window === "undefined") {
    const fs = require("fs");
    const championshipDirectory = join(process.cwd(), "public/pages/championship");
    const years = fs
      .readdirSync(championshipDirectory, { withFileTypes: true })
      .filter((dirent: any) => dirent.isDirectory() && /\d{4}/.test(dirent.name))
      .map((dirent: any) => parseInt(dirent.name, 10));

    if (years.length === 0) {
      return null;
    }

    return Math.max(...years).toString();
  }
  return null;
}
