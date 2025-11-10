'use client';

import { SidebarNavigation } from './sidebar-navigation';
import SubfolderContent from './SubfolderContent';
import { useEffect } from 'react';

// Types
interface SubSectionContent {
  title: string;
  content: string; // Always refers to the latest version
  lastUpdated?: string;
  directoryName?: string;
  previousVersions?: Array<{
    date: string;
    content: string;
  }>;
}

const ContentSection = ({
  items,
  showSubfolderTitles
}: {
  items: SubSectionContent[],
  showSubfolderTitles: boolean
}) => {
  if (!showSubfolderTitles) {
    // Single item case - still use SubfolderContent but without title
    return <SubfolderContent item={items[0]} showTitle={false} />;
  }

  return (
    <>
      {items.map((item, index) => (
        <SubfolderContent
          key={index}
          item={item}
          showTitle={true}
        />
      ))}
    </>
  );
};

export default function ChampionshipClient({
  subfolderContentsArray,
  year,
  pageTopTitle,
  pageTopSlug,
  showSubfolderTitles
}: {
  subfolderContentsArray: SubSectionContent[];
  year: string;
  pageTopTitle: string;
  pageTopSlug: string;
  showSubfolderTitles: boolean;
}) {

  // Add smooth scrolling behavior
  useEffect(() => {
    // Enable smooth scrolling for the entire document
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      // Clean up
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div className="container mx-auto px-4">
      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8">
        <SidebarNavigation
          items={subfolderContentsArray}
          year={year}
        />
        <main className="flex-1">
          <div className="mb-8 mt-10">
            <h1 id={pageTopSlug} className="text-4xl font-bold scroll-mt-16">{pageTopTitle}</h1>
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
