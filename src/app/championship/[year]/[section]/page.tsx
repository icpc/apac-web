import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import Divider from '@/app/_components/Divider';
import { Content } from '@/app/_components/pages/content';
import { AVAILABLE_YEARS } from "@/lib/constants";
import { SidebarNavigation } from './sidebar-navigation';
import modifyHtmlContent from '@/lib/modify-html-content';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

// Types
interface SubSectionContent {
  title: string;
  content: string;
  lastUpdated?: string;
  directoryName?: string;
}

interface Heading {
  text: string;
  slug: string;
  depth: number;
}

// Utility functions
const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '');
};

const extractHeadings = (markdown: string): Heading[] => {
  const tokens = marked.lexer(markdown);
  return tokens
    .filter((token: any) => token.type === 'heading' && (token.depth === 1 || token.depth === 2) && typeof token.text === 'string')
    .map((token: any) => ({
      text: token.text,
      slug: slugify(token.text),
      depth: token.depth
    }));
};

const formatDate = (dateStr: string): string => {
  return `${dateStr.substring(0,4)}-${dateStr.substring(4,6)}-${dateStr.substring(6,8)}`;
};

// File system operations
const getChampionshipSections = async (year: string): Promise<string[]> => {
  const yearPath = path.join(process.cwd(), 'public', 'pages', 'championship', year);
  try {
    const entries = await fs.readdir(yearPath, { withFileTypes: true });
    return entries
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();
  } catch (error) {
    console.error(`Error reading directory: ${yearPath}`, error);
    return [];
  }
};

const getSectionSubfolderContents = async (year: string, section: string): Promise<SubSectionContent[]> => {
  const sectionPath = path.join(process.cwd(), 'public', 'pages', 'championship', year, section);
  const subfolderContents: SubSectionContent[] = [];
  const YYYYMMDD_REGEX = /^\d{8}_.*\.md$/i;

  // Try to read order.json for display_name mapping
  let orderConfig: Record<string, { display_name?: string, order?: number }> = {};
  try {
    const orderJsonPath = path.join(sectionPath, 'order.json');
    const orderJson = await fs.readFile(orderJsonPath, 'utf8');
    orderConfig = JSON.parse(orderJson);
  } catch (e) {
    // order.json not found or invalid, fallback to default
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
          .map(fileName => {
            const match = fileName.match(YYYYMMDD_REGEX);
            return match ? { name: fileName, date: match[0].slice(0,8) } : null;
          })
          .filter((file): file is { name: string; date: string } => file !== null);
        if (markdownFiles.length > 0) {
          markdownFiles.sort((a, b) => b.date.localeCompare(a.date));
          const newestFile = markdownFiles[0];
          const filePath = path.join(subfolderPath, newestFile.name);
          const content = await fs.readFile(filePath, 'utf8');
          // Use display_name from order.json if available, else fallback
          const title = orderConfig[subfolderName]?.display_name ||
            subfolderName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          const dateStr = newestFile.date;
          const isValidDate = dateStr !== '00000000';

          subfolderContents.push({
            title,
            content,
            lastUpdated: isValidDate ? formatDate(dateStr) : undefined,
            directoryName: subfolderName
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

const ContentSection = ({ 
  items, 
  showSubfolderTitles 
}: { 
  items: SubSectionContent[], 
  showSubfolderTitles: boolean 
}) => {
  if (!showSubfolderTitles) {
    const item = items[0];
    let htmlContent = marked.parse(item.content || '') as string;
    
    // Add IDs to headings for anchor navigation
    htmlContent = htmlContent.replace(/<h([12])>(.*?)<\/h\1>/g, (match, level, content) => {
      const slug = slugify(content);
      return `<h${level} id="${slug}" class="scroll-mt-16">${content}</h${level}>`;
    });
    htmlContent = htmlContent.replace(/<h([12]).*?(id=".*?").*?>(.*?)<\/h\1>/g, (match, level, id, content) => {
      const slug = slugify(content);
      return `<h${level} ${id} class="scroll-mt-16">${content}</h${level}>`;
    });
    htmlContent = modifyHtmlContent(htmlContent)
    

    return (
      <section className="mb-12">
        <Content content={htmlContent} />
      </section>
    );
  }

  return (
    <>
      {items.map((item, index) => {
        let htmlContent = marked.parse(item.content || '') as string;
        const slug = slugify(item.title);

        // Add IDs to headings for anchor navigation
        htmlContent = htmlContent.replace(/<h([12]).*>(.*?)<\/h\1>/g, (match, level, content) => {
          const slug = slugify(content);
          return `<h${level} id="${slug}" class="scroll-mt-16">${content}</h${level}>`;
        });
        htmlContent = htmlContent.replace(/<h([12]).*?(id=".*?").*?>(.*?)<\/h\1>/g, (match, level, id, content) => {
          const slug = slugify(content);
          return `<h${level} ${id} class="scroll-mt-16">${content}</h${level}>`;
        });
        htmlContent = modifyHtmlContent(htmlContent)
        
        return (
          <section key={index} id={slug}>
            <div className="mt-8">
              <Divider />
            </div>
            <div className="flex justify-between items-center mb-2">
              <h2>
                {item.title + " "}
                <a href={"#" + slug} className="header-link">
                  🔗
                  <span className="tooltip" style={{top: "-20px"}}>
                      Get url to this section
                  </span>
                </a>
              </h2>
              {item.lastUpdated && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated on {new Date(item.lastUpdated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>
            <Content content={htmlContent} />
          </section>
        );
      })}
    </>
  );
};

// Main page component
export default async function ChampionshipPage({ params }: { params: Promise<{ year: string, section: string }> }) {
  const { year, section } = await params;

  if (!AVAILABLE_YEARS.includes(year)) {
    notFound();
  }

  const subfolderContentsArray = await getSectionSubfolderContents(year, section);
  const sections = await getChampionshipSections(year);

  if (!sections.includes(section) || subfolderContentsArray.length === 0) {
    notFound();
  }

  const pageTopTitle = section.charAt(0).toUpperCase() + section.slice(1);
  const pageTopSlug = slugify(section);
  const showSubfolderTitles = subfolderContentsArray.length > 1;

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <SidebarNavigation items={subfolderContentsArray} year={year} />
        <main className="flex-1">
          <div className="mb-8 mt-10">
            <h1 id={pageTopSlug} className="text-4xl font-bold scroll-mt-16">
              {pageTopTitle}
            </h1>
          </div>
          <ContentSection 
            items={subfolderContentsArray} 
            showSubfolderTitles={showSubfolderTitles} 
          />
        </main>
      </div>
    </div>
  );
}
