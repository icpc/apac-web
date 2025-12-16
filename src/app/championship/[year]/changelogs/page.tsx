import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { AVAILABLE_YEARS } from "@/lib/constants";
import Divider from '@/app/_components/Divider';
import { SidebarNavigation } from '../[section]/sidebar-navigation';


// Types
interface ChangelogEntry {
  date: string;
  fileName: string;
  section: string;
  subsection: string;
  filePath: string;
  formattedDate: string;
}

// Utility functions
const formatDate = (dateStr: string): string => {
  if (dateStr === '00000000') {
    return 'n/a';
  }
  return `${dateStr.substring(0,4)}-${dateStr.substring(4,6)}-${dateStr.substring(6,8)}`;
};

const getAllChangelogFiles = async (year: string): Promise<ChangelogEntry[]> => {
  const yearPath = path.join(process.cwd(), 'public', 'pages', 'championship', year);
  const changelogEntries: ChangelogEntry[] = [];
  const YYYYMMDD_REGEX = /^(\d{8})_.*\.md$/i;

  try {
    const sections = await fs.readdir(yearPath, { withFileTypes: true });
    
    for (const sectionDirent of sections) {
      if (!sectionDirent.isDirectory()) continue;
      
      const sectionName = sectionDirent.name;
      const sectionPath = path.join(yearPath, sectionName);

      try {
        const subsections = await fs.readdir(sectionPath, { withFileTypes: true });
        
        for (const subsectionDirent of subsections) {
          if (!subsectionDirent.isDirectory()) continue;
          
          const subsectionName = subsectionDirent.name;
          const subsectionPath = path.join(sectionPath, subsectionName);

          try {
            const files = await fs.readdir(subsectionPath);
            const markdownFiles = files
              .map(fileName => {
                const match = fileName.match(YYYYMMDD_REGEX);
                return match ? { name: fileName, date: match[1] } : null;
              })
              .filter((file): file is { name: string; date: string } => file !== null);

            for (const file of markdownFiles) {
              changelogEntries.push({
                date: file.date,
                fileName: file.name,
                section: sectionName,
                subsection: subsectionName,
                filePath: path.join(subsectionPath, file.name),
                formattedDate: formatDate(file.date)
              });
            }
          } catch (err) {
            console.warn(`Error processing subsection ${year}/${sectionName}/${subsectionName}:`, err);
          }
        }
      } catch (err) {
        console.warn(`Error processing section ${year}/${sectionName}:`, err);
      }
    }

    return changelogEntries.sort((a, b) => b.date.localeCompare(a.date));
  } catch (error) {
    console.error(`Error reading year directory: ${yearPath}`, error);
    return [];
  }
};

// Components
const ChangelogPage = ({ entries, year }: { entries: ChangelogEntry[], year: string }) => (
  <div className="container mx-auto px-4 overflow-x-clip">
    {/* Main Content */}
    <div className="flex flex-col md:flex-row">
      <SidebarNavigation
        items={[]}
        year={year}
        hideDesktopSidebar={true}
      />
      <main className="flex-1 md:ml-8">
        <div className="max-w-4xl">
          <div className="mb-8 mt-10">
            <h1 className="text-4xl font-bold scroll-mt-16">Change Logs</h1>
            <p className="text-gray-600 dark:text-gray-200 text-lg">
              A chronological list of all updates and changes made to the championship content for the {year} championship.
            </p>
          </div>
          <div className="space-y-4 markdown">
            {entries.length === 0 ? (
              <p className="text-gray-500 italic">No changelog entries found.</p>
            ) : (
              <table className="w-full text-left">
                <tbody>
                  {entries.map((entry, index) => (
                    <tr key={index} className="border-y border-gray-300 dark:border-gray-600">
                      <td className="py-2 text-center min-w-[100px]">{entry.formattedDate}</td>
                      <td className="py-2">
                        <a 
                          href={`/championship/${year}/${entry.section}${entry.section !== entry.subsection ? `#${entry.subsection}` : ''}`}
                          className="capitalize text-text-links dark:text-text-links-dark"
                        >
                          {entry.section} {entry.section !== entry.subsection ? ` / ${entry.subsection}` : ''}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  </div>
);

// Main page component
export default async function ChangelogsPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;

  if (!AVAILABLE_YEARS.includes(year)) {
    notFound();
  }

  const changelogEntries = await getAllChangelogFiles(year);
  return <ChangelogPage entries={changelogEntries} year={year} />;
} 