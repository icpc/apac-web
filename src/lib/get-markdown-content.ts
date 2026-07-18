import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { processMarkdownFiles } from "@/lib/markdown-utils";

type ParsedFile = {
  data: Record<string, unknown>;
  content: string;
  filename: string;
};

const getDirectoryPath = (slug: string) => path.join(process.cwd(), "public", "pages", slug);

const getSortKey = (slug: string, filename: string) => {
  const homeMatch = filename.match(/(\d{2})_(\d{2})/);
  const datedMatch = filename.match(/(\d{4})(\d{2})(\d{2})/);

  if (slug === "home" && homeMatch) {
    return `${homeMatch[1]}-${homeMatch[2]}`;
  }

  if (datedMatch) {
    return `${datedMatch[1]}-${datedMatch[2]}-${datedMatch[3]}`;
  }

  return null;
};

export async function getMarkdownContent(slug: string) {
  const directoryPath = getDirectoryPath(slug);
  let filenames: string[];

  try {
    filenames = await fs.readdir(directoryPath);
  } catch {
    return [];
  }

  const filesWithSortKey = filenames
    .map((filename) => {
      const sortKey = getSortKey(slug, filename);
      return sortKey ? { filename, sortKey } : null;
    })
    .filter((value): value is { filename: string; sortKey: string } => value !== null);

  const sortedFiles =
    slug === "home"
      ? filesWithSortKey.sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      : filesWithSortKey.sort((a, b) => b.sortKey.localeCompare(a.sortKey));

  const parsedFiles: ParsedFile[] = await Promise.all(
    sortedFiles.map(async ({ filename }) => {
      const filePath = path.join(directoryPath, filename);
      const fileContents = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(fileContents);
      return { data, content, filename };
    })
  );

  return processMarkdownFiles(parsedFiles);
}
