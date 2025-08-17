import { Page } from "@/interfaces/page";
import matter from "gray-matter";
import { join } from "path";

const pagesDirectory = join(process.cwd(), "public/pages");

export function getPageSlugs() {
  if (typeof window === "undefined") {
    const fs = require("fs");
    return fs.readdirSync(pagesDirectory);
  }
  return [];
}

export function getPageBySlug(slug: string) {
  if (typeof window === "undefined") {
    const fs = require("fs");
    const realSlug = slug.replace(/\.md$/, "");
    const fullPath = join(pagesDirectory, `${realSlug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return { ...data, slug: realSlug, content } as Page;
  }
  return null;
}
