'use client';

import { useState } from 'react';
import { Content } from '@/app/_components/pages/content';
import { marked } from 'marked';
import Divider from '@/app/_components/Divider';
import diff from 'html-diff-ts';
import matter from 'gray-matter';
import modifyHtmlContent from '@/lib/modify-html-content';

interface SubSectionContent {
  title: string;
  content: string;
  lastUpdated?: string;
  directoryName?: string;
  previousVersions?: Array<{
    date: string;
    content: string;
  }>;
}

interface DiffState {
  isDiffMode: boolean;
  selectedVersion: string | null;
}

interface SubfolderContentProps {
  item: SubSectionContent;
  showTitle: boolean;
}

const SubfolderContent = ({ item, showTitle }: SubfolderContentProps) => {
  // Individual diff state for this subfolder only
  const [diffState, setDiffState] = useState<DiffState>({
    isDiffMode: false,
    selectedVersion: null
  });

  // Available versions for this specific subfolder
  const availableVersions = item.previousVersions?.map(v => ({
    date: v.date,
    title: item.title,
    directoryName: item.directoryName,
    content: v.content
  })) || [];

  // Render normal content
  const renderNormalContent = () => {
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
    const slug = slugify(item.title);

    // Check if there's only one version (no previous versions)
    const hasOnlyOneVersion = !item.previousVersions || item.previousVersions.length === 0;

    return (
      <section id={slug} className="mb-12">
        {showTitle && (
          <>
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
               <div className="flex flex-col items-end gap-2">
                 <div className="flex items-center gap-3">
                   {item.lastUpdated && (
                     <p className="text-sm text-gray-500 dark:text-gray-400">
                       Last updated on {new Date(item.lastUpdated).toLocaleDateString('en-US', {
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric'
                       })}
                     </p>
                   )}
                   <div className="flex items-center gap-2">
                     <button
                       onClick={() => !hasOnlyOneVersion && setDiffState(prev => ({
                         ...prev,
                         isDiffMode: !prev.isDiffMode,
                         selectedVersion: prev.isDiffMode ? null : prev.selectedVersion
                       }))}
                       disabled={hasOnlyOneVersion}
                       title={hasOnlyOneVersion ? "This content has only one version available" : undefined}
                       className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                         hasOnlyOneVersion
                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                           : diffState.isDiffMode
                             ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800'
                             : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800'
                       }`}
                     >
                       {diffState.isDiffMode ? '✖' : '!'}
                     </button>
                   </div>
                 </div>
                 {/* Version dropdown below the diff button and last updated text */}
                 {diffState.isDiffMode && availableVersions.length > 0 && (
                   <div className="flex items-center gap-2">
                     <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                       Version:
                     </label>
                     <select
                       value={diffState.selectedVersion || ''}
                       onChange={(e) => setDiffState(prev => ({ ...prev, selectedVersion: e.target.value }))}
                       className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                     >
                       <option value="">Choose version...</option>
                       {availableVersions.map(version => (
                         <option key={version.date} value={version.date}>
                            {version.date}
                         </option>
                       ))}
                     </select>
                   </div>
                 )}
               </div>
             </div>
          </>
        )}
        <Content content={htmlContent} />
      </section>
    );
  };

  // Render diff content
  const renderDiffContent = () => {
    if (!diffState.selectedVersion) return null;

    const selectedVersionData = availableVersions.find(v => v.date === diffState.selectedVersion);
    if (!selectedVersionData) return null;

    const parseMatter = (markdownContent: string) => {
      const { data, content } = matter(markdownContent)
      return { data, content };
    }

    const parsedSelectedContent = parseMatter(selectedVersionData.content)
    const latestSelectedContent = parseMatter(item.content)

    const diffHtml = diff(
      marked.parse(parsedSelectedContent.content) as string,
      marked.parse(latestSelectedContent.content) as string
    );

    // Check if there's only one version (no previous versions)
    const hasOnlyOneVersion = !item.previousVersions || item.previousVersions.length === 0;

    return (
      <section className="mb-12">
        {showTitle && (
          <>
            <div className="mt-8">
              <Divider />
            </div>
             <div className="flex justify-between items-center mb-2">
               <h2>{item.title}</h2>
               <div className="flex flex-col items-end gap-2">
                 <div className="flex items-center gap-3">
                   {item.lastUpdated && (
                     <p className="text-sm text-gray-500 dark:text-gray-400">
                       Last updated on {new Date(item.lastUpdated).toLocaleDateString('en-US', {
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric'
                       })}
                     </p>
                   )}
                   <div className="flex items-center gap-2">
                     <button
                       onClick={() => !hasOnlyOneVersion && setDiffState(prev => ({
                         ...prev,
                         isDiffMode: !prev.isDiffMode,
                         selectedVersion: prev.isDiffMode ? null : prev.selectedVersion
                       }))}
                       disabled={hasOnlyOneVersion}
                       title={hasOnlyOneVersion ? "This content has only one version available" : undefined}
                       className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                         hasOnlyOneVersion
                           ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                           : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800'
                       }`}
                     >
                       ✖
                     </button>
                   </div>
                 </div>
                 {/* Version dropdown below the diff button and last updated text */}
                 {availableVersions.length > 0 && (
                   <div className="flex items-center gap-2">
                     <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                       Version:
                     </label>
                     <select
                       value={diffState.selectedVersion || ''}
                       onChange={(e) => setDiffState(prev => ({ ...prev, selectedVersion: e.target.value }))}
                       className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                     >
                       <option value="">Choose version...</option>
                       {availableVersions.map(version => (
                         <option key={version.date} value={version.date}>
                            {version.date}
                         </option>
                       ))}
                     </select>
                   </div>
                 )}
               </div>
             </div>
          </>
        )}

        <div className="diff-container">
          <Content content={diffHtml} />
        </div>
      </section>
    );
  };

  return (
    <div className="subfolder-container">
      {/* Conditional rendering: diff or normal content */}
      {diffState.isDiffMode && diffState.selectedVersion ? renderDiffContent() : renderNormalContent()}
    </div>
  );
};

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '');
};

export default SubfolderContent;
