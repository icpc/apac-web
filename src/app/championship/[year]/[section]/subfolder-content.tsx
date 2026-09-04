'use client';

import { useState, useEffect } from 'react';
import { Content } from '@/app/_components/pages/content';
import { marked } from 'marked';
import Divider from '@/app/_components/divider';
import diff from 'html-diff-ts';
import matter from 'gray-matter';
import modifyHtmlContent from '@/lib/modify-html-content';
import VersionControls from '@/app/_components/VersionControls';
import { InfoIcon, XIcon } from 'lucide-react';
import { CopyTooltip, InfoTooltip } from '@/components/ui/tooltip';

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
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);

  // Individual diff state for this subfolder only
  const [diffState, setDiffState] = useState<DiffState>({
    isDiffMode: false,
    selectedVersion: null,
    showVersionDropdown: false
  });

  // Helper function to render version controls
  const renderVersionControls = (isDiffMode: boolean = false) => {
    const hasOnlyOneVersion = !item.previousVersions || item.previousVersions.length === 0;
    const slug = slugify(item.title);

    const handleToggleDropdown = () => {
      if (!hasOnlyOneVersion) {
        setDiffState(prev => ({
          ...prev,
          showVersionDropdown: !prev.showVersionDropdown,
          isDiffMode: !prev.showVersionDropdown,
          selectedVersion: !prev.showVersionDropdown ? prev.selectedVersion : null
        }));
      }
    };

    const handleCopyUrl = async (e: React.MouseEvent) => {
      e.preventDefault();
      const url = `${window.location.origin}${window.location.pathname}#${slug}`;
      try {
        await navigator.clipboard.writeText(url);
        setShowCopiedTooltip(true);
        setTimeout(() => setShowCopiedTooltip(false), 2000);
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    };

    const renderTitle = () => (
      <h2 className="m-0 pt-2">
        {item.title + " "}
        <CopyTooltip
          onCopy={handleCopyUrl}
          showCopiedTooltip={showCopiedTooltip}
        >
          🔗
        </CopyTooltip>
      </h2>
    );

    const renderToggleButton = () => {
      const tooltipText = hasOnlyOneVersion 
        ? "No previous versions available" 
        : "See content changes history";
      
      return (
        <InfoTooltip
          text={tooltipText}
          alignment="right"
          forceShow={diffState.showVersionDropdown && !hasOnlyOneVersion}
        >
          <button
            onClick={handleToggleDropdown}
            disabled={hasOnlyOneVersion}
            className={`p-1.5 rounded-md text-sm font-medium transition-all duration-200 relative opacity-50 hover:opacity-100 hover:bg-text-links-highlight hover:text-text-links-hover ${
              hasOnlyOneVersion
                ? 'text-gray-400 cursor-not-allowed'
                : diffState.showVersionDropdown
                  ? 'text-red-600 dark:text-red-400 opacity-100'
                  : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {diffState.showVersionDropdown ? (
              <XIcon className="size-4" />
            ) : (
              <InfoIcon className="size-4" />
            )}
          </button>
        </InfoTooltip>
      );
    };

    const renderVersionDropdown = () => (
      <VersionControls
        showVersionDropdown={diffState.showVersionDropdown}
        selectedVersion={diffState.selectedVersion}
        onChangeVersion={(value) => setDiffState(prev => ({ ...prev, selectedVersion: value }))}
        availableVersions={availableVersions}
        compareLabel={isDiffMode ? "Comparing with:" : undefined}
      />
    );

    return (
      <>
        {/* Desktop layout */}
        <div className="hidden sm:block">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {renderTitle()}
            </div>
            <div className={`flex items-center gap-2 ${diffState.showVersionDropdown ? '-mt-6' : 'mt-3'}`}>
              <LastUpdatedText date={item.lastUpdated} />
              {renderToggleButton()}
            </div>
          </div>
          {diffState.showVersionDropdown && (
            <div className="flex justify-end -mt-5">
              <div className="relative -top-1">
                {renderVersionDropdown()}
              </div>
            </div>
          )}
        </div>

        {/* Mobile layout */}
        <div className="sm:hidden">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="m-0">
              {item.title + " "}
              <CopyTooltip
                onCopy={handleCopyUrl}
                showCopiedTooltip={showCopiedTooltip}
                alignment="center"
              >
                🔗
              </CopyTooltip>
            </h2>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <LastUpdatedText date={item.lastUpdated} />
            {renderToggleButton()}
          </div>
          <div className="block sm:hidden -mt-2">
            {renderVersionDropdown()}
            <Divider/>
          </div>
        </div>
      </>
    );
  };

  // Ensure we're on client side before parsing markdown
  useEffect(() => {
    setIsClient(true);
    let htmlContent = marked.parse(item.content || '') as string;
    // Add IDs to headings for anchor navigation
    htmlContent = htmlContent.replace(/<h([12])>(.*?)<\/h\1>/g, (_, level, content) => {
      const slug = slugify(content);
      return `<h${level} id="${slug}" class="scroll-mt-16">${content}</h${level}>`;
    });
    htmlContent = htmlContent.replace(/<h([12]).*?(id=".*?").*?>(.*?)<\/h\1>/g, (_, level, id, content) => {
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
      <section className="pb-2 mt-10">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </section>
      );
    }

    const slug = slugify(item.title);

    return (
      <section id={slug} className="pb-2 mt-10 ">
        {showTitle && (
          <>
            <div className="mt-8">
              <Divider />
            </div>
            <div className={`flex flex-col transition-all duration-200 min-h-12 sm:min-h-16`}>
              {renderVersionControls(false)}
            </div>
          </>
        )}
        <div className="mt-6 sm:mt-0">
          <Content content={parsedContent} />
        </div>
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

    return (
      <section className="pb-2 mt-10 ">
        {showTitle && (
          <>
            <div className="mt-8">
              <Divider />
            </div>
            <div className={`flex flex-col transition-all duration-200 min-h-12 sm:min-h-16`}>
              {renderVersionControls(true)}
            </div>
          </>
        )}
        <div className="mt-6 sm:mt-0">
          <Content content={modifyHtmlContent(diffHtml)} />
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
