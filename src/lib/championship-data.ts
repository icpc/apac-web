import { promises as fs } from "fs";
import path from "path";

export interface SubSectionContent {
  title: string;
  content: string;
  lastUpdated?: string;
  directoryName?: string;
  previousVersions?: Array<{
    date: string;
    content: string;
  }>;
}

const formatDate = (dateStr: string): string => {
  return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
};

export const getChampionshipSections = async (year: string): Promise<string[]> => {
  const yearPath = path.join(process.cwd(), "public", "pages", "championship", year);
  try {
    const entries = await fs.readdir(yearPath, { withFileTypes: true });
    return entries
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .sort();
  } catch (error) {
    console.error(`Error reading directory: ${yearPath}`, error);
    return [];
  }
};

export const getSectionSubfolderContents = async (
  year: string,
  section: string
): Promise<SubSectionContent[]> => {
  const sectionPath = path.resolve(process.cwd(), "public", path.join("pages", "championship", year, section));
  const subfolderContents: SubSectionContent[] = [];
  const YYYYMMDD_REGEX = /^\d{8}_.*\.md$/i;

  let orderConfig: Record<string, { display_name?: string; order?: number }> = {};
  try {
    const orderJsonPath = path.join(sectionPath, "order.json");
    const orderJson = await fs.readFile(orderJsonPath, "utf8");
    orderConfig = JSON.parse(orderJson);
  } catch {
    orderConfig = {};
  }

  try {
    const subfolders = await fs.readdir(sectionPath, { withFileTypes: true });
    for (const dirent of subfolders) {
      if (!dirent.isDirectory()) continue;
      const subfolderName = dirent.name;
      const subfolderPath = path.join(sectionPath, subfolderName);
      try {
        const filesInSubfolder = await fs.readdir(subfolderPath);
        const markdownFiles = filesInSubfolder
          .map((fileName) => {
            const match = fileName.match(YYYYMMDD_REGEX);
            return match ? { name: fileName, date: match[0].slice(0, 8) } : null;
          })
          .filter((file): file is { name: string; date: string } => file !== null);
        if (markdownFiles.length > 0) {
          markdownFiles.sort((a, b) => b.date.localeCompare(a.date));
          const newestFile = markdownFiles[0];
          const filePath = path.join(subfolderPath, newestFile.name);
          const content = await fs.readFile(filePath, "utf8");

          const previousVersions = await Promise.all(
            markdownFiles.slice(1).map(async (prevFile) => ({
              date: formatDate(prevFile.date),
              content: await fs.readFile(path.join(subfolderPath, prevFile.name), "utf8"),
            }))
          );

          const title =
            orderConfig[subfolderName]?.display_name ||
            subfolderName
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          const dateStr = newestFile.date;
          const isValidDate = dateStr !== "00000000";

          subfolderContents.push({
            title,
            content,
            lastUpdated: isValidDate ? formatDate(dateStr) : undefined,
            directoryName: subfolderName,
            previousVersions: previousVersions.length > 0 && isValidDate ? previousVersions : undefined,
          });
        }
      } catch (err) {
        console.warn(`Error processing subfolder ${year}/${section}/${subfolderName}:`, err);
      }
    }
    return subfolderContents.sort((a, b) => {
      const orderA = orderConfig[a.directoryName!]?.order ?? 999;
      const orderB = orderConfig[b.directoryName!]?.order ?? 999;
      return orderA - orderB;
    });
  } catch (error) {
    console.error(`Error reading section directory: ${sectionPath}`, error);
    return [];
  }
};
