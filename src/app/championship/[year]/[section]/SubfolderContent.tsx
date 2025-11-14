'use client';

import { useState, useEffect } from 'react';
import { Content } from '@/app/_components/pages/content';
import { marked } from 'marked';
import Divider from '@/app/_components/Divider';
import diff from 'html-diff-ts';
import matter from 'gray-matter';
import modifyHtmlContent from '@/lib/modify-html-content';
import VersionControls from '@/app/_components/VersionControls';
import { InfoIcon, XIcon } from 'lucide-react';

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
  showVersionDropdown: boolean;
}

interface SubfolderContentProps {
  item: SubSectionContent;
  showTitle: boolean;
}

// Local component for consistent "Last updated" display
const LastUpdatedText = ({ date }: { date?: string }) => {
  if (!date) return null;
  return (
    <p className="text-sm text-gray-500 dark:text-gray-400">
      {`Last updated on ${new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`}
    </p>
  );
};

const SubfolderContent = ({ item, showTitle }: SubfolderContentProps) => {
  // State for parsed HTML to prevent hydration mismatch
  const [parsedContent, setParsedContent] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  // Individual diff state for this subfolder only
  const [diffState, setDiffState] = useState<DiffState>({
    isDiffMode: false,
    selectedVersion: null,
    showVersionDropdown: false
  });

  // Ensure we're on client side before parsing markdown
  useEffect(() => {
    setIsClient(true);
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
    htmlContent = modifyHtmlContent(htmlContent);
    setParsedContent(htmlContent);
  }, [item.content]);

  // Available versions for this specific subfolder
  const availableVersions = item.previousVersions?.map(v => ({
    date: v.date,
    title: item.title,
    directoryName: item.directoryName,
    content: v.content,
    label: new Date(v.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  })) || [];

  // Render normal content
  const renderNormalContent = () => {
    // Show loading state during hydration
    if (!isClient || !parsedContent) {
      return (
        <section className="mb-12">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </section>
      );
    }

    const slug = slugify(item.title);
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
                  <span className="relative group">
                    <a href={"#" + slug} className="header-link">
                      🔗
                    </a>
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      Get url to this section
                    </span>
                  </span>
                </h2>
               <div className="flex flex-col items-end gap-0">
                 <div className="flex items-center gap-3">
                  <LastUpdatedText date={item.lastUpdated} />
                  <div className="relative group">
                     <button
                       onClick={() => !hasOnlyOneVersion && setDiffState(prev => ({
                         ...prev,
                         showVersionDropdown: !prev.showVersionDropdown,
                         isDiffMode: !prev.showVersionDropdown,
                         selectedVersion: !prev.showVersionDropdown ? prev.selectedVersion : null
                       }))}
                       disabled={hasOnlyOneVersion}
                       className={`p-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                         hasOnlyOneVersion
                           ? 'text-gray-400 cursor-not-allowed'
                           : diffState.showVersionDropdown
                             ? 'text-red-600 dark:text-red-400'
                             : 'text-gray-600 dark:text-gray-400 hover:text-text-primaryAccent'
                       }`}
                     >
                       {diffState.showVersionDropdown ? (
                         <XIcon className="size-4" />
                       ) : (
                         <InfoIcon className="size-4" />
                       )}
                     </button>
                     {hasOnlyOneVersion ? (
                       <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                         No previous versions available
                       </span>
                     ) : (
                       <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                         See content changes history
                       </span>
                     )}
                   </div>
                 </div>
                 <VersionControls
                   showVersionDropdown={diffState.showVersionDropdown}
                   selectedVersion={diffState.selectedVersion}
                   onChangeVersion={(value) => setDiffState(prev => ({ ...prev, selectedVersion: value }))}
                   availableVersions={availableVersions}
                 />
               </div>
              </div>
          </>
        )}
        <Content content={parsedContent} />
      </section>
    );
  };

  // Render diff content
  const renderDiffContent = () => {
    if (!diffState.selectedVersion || !isClient) return null;

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
                  <LastUpdatedText date={item.lastUpdated} />
                  <div className="relative group">
                    <button
                      onClick={() => !hasOnlyOneVersion && setDiffState(prev => ({
                        ...prev,
                        showVersionDropdown: !prev.showVersionDropdown,
                        isDiffMode: !prev.showVersionDropdown,
                        selectedVersion: !prev.showVersionDropdown ? prev.selectedVersion : null
                      }))}
                      disabled={hasOnlyOneVersion}
                      className={`p-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                        hasOnlyOneVersion
                          ? 'text-gray-400 cursor-not-allowed'
                          : diffState.showVersionDropdown
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-600 dark:text-gray-400 hover:text-text-primaryAccent'
                      }`}
                    >
                      {diffState.showVersionDropdown ? (
                        <XIcon className="size-4" />
                      ) : (
                        <InfoIcon className="size-4" />
                      )}
                    </button>
                    {hasOnlyOneVersion ? (
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        No previous versions available
                      </span>
                    ) : (
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        See content changes history
                      </span>
                    )}
                  </div>
                </div>
                <VersionControls
                  showVersionDropdown={diffState.showVersionDropdown}
                  selectedVersion={diffState.selectedVersion}
                  onChangeVersion={(value) => setDiffState(prev => ({ ...prev, selectedVersion: value }))}
                  availableVersions={availableVersions}
                  compareLabel="Comparing with:"
                />
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
