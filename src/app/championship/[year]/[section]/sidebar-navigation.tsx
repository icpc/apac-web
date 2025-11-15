"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { marked } from 'marked';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, Menu, X, Pin } from "lucide-react";
import styles from '@/app/_styles/sidebar-nav-styles.module.css';

interface SubSectionContent {
  title: string;
  content: string;
  lastUpdated?: string;
}

interface Heading {
  text: string;
  slug: string;
  depth: number;
}

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

export const SidebarNavigation = ({
   items,
   year
 }: {
    items: SubSectionContent[],
    year: string
  }) => {
    const router = useRouter();
    const [openSections, setOpenSections] = React.useState<Set<string>>(new Set());
    const [pinnedSections, setPinnedSections] = React.useState<Set<string>>(new Set());
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const lastVisibleRef = React.useRef<Map<string, number>>(new Map());
    const HYSTERESIS_MS = 400;

    const elementIds = items.map(item => slugify(item.title));
    const visibleElements = useIntersectionObserver(elementIds, {
      rootMargin: '-80px 0px -80px 0px',
      threshold: 0.1,
      delay: 100
    });

    React.useEffect(() => {
      const now = Date.now();
      visibleElements.forEach((slug) => {
        lastVisibleRef.current.set(slug, now);
      });

      setOpenSections((prev) => {
        const next = new Set<string>();
        visibleElements.forEach((slug) => next.add(slug));
        pinnedSections.forEach((slug) => next.add(slug));
        prev.forEach((slug) => {
          if (!next.has(slug)) {
            const ts = lastVisibleRef.current.get(slug) ?? 0;
            if (now - ts < HYSTERESIS_MS) {
              next.add(slug);
            }
          }
        });

        return next;
      });
    }, [visibleElements, pinnedSections]);

    const handleToggle = (slug: string, isOpen: boolean) => {
      setOpenSections(prev => {
        const next = new Set(prev);
        if (isOpen) {
          next.add(slug);
        } else {
          next.delete(slug);
        }
        return next;
      });
    };

    const handlePinToggle = (e: React.MouseEvent, slug: string) => {
      e.stopPropagation();
      e.preventDefault();
      setPinnedSections(prev => {
        const next = new Set(prev);
        if (next.has(slug)) {
          next.delete(slug);
        } else {
          next.add(slug);
        }
        return next;
      });
    };

   const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, slug: string) => {
     e.preventDefault();
     const element = document.getElementById(slug);
     if (element) {
       const offset = 80;
       const elementPosition = element.getBoundingClientRect().top;
       const offsetPosition = elementPosition + window.scrollY - offset;
       
       window.scrollTo({
         top: offsetPosition,
         behavior: 'smooth'
       });
       
       router.replace(`#${slug}`, { scroll: false });
     }
   };

   const toggleSidebar = () => {
     setIsSidebarOpen(!isSidebarOpen);
   };

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className={styles.mobileToggleButton}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar Modal Overlay */}
      {isSidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={toggleSidebar} />
      )}

      {/* Sidebar Modal */}
      <div className={`${styles.sidebarModal} ${isSidebarOpen ? styles.sidebarModalOpen : ''}`}>
        <aside className={styles.sidebarModalContent}>
          <div className={styles.sidebarContainer}>
            <div className={styles.sidebarHeader}>
              <h1 className={styles.sidebarTitle}>The {year} Championship</h1>
            </div>
            <ScrollArea className={styles.scrollArea}>
              <div className={styles.sidebarContent}>
                {items.map((item) => {
                  const slug = slugify(item.title);
                  const headings = extractHeadings(item.content || '');
                  const h1s = headings.filter(h => h.depth === 1);
                  const h2s = headings.filter(h => h.depth === 2);
                  const hasChildren = (h1s.length > 0 || h2s.length > 0);

                  return (
                    <div key={slug} className={styles.sidebarSection}>
                      {hasChildren ? (
                        <Collapsible
                          defaultOpen={true}
                          open={openSections.has(slug)}
                          onOpenChange={(isOpen) => handleToggle(slug, isOpen)}
                        >
                          {item.title && (
                           <Button
                             variant="ghost"
                             className={`${styles.mainNavButton} focus-visible:ring-0 focus-visible:ring-offset-0`}
                             onClick={(e) => {
                               handleAnchorClick(e, slug);
                               handlePinToggle(e, slug);
                             }}
                             aria-label={pinnedSections.has(slug) ? 'Unpin section' : `Pin section ${item.title}`}
                           >
                              <span className={`${styles.mainNavTitle} ${openSections.has(slug) ? 'text-text-header-secondary dark:text-text-header-secondary-dark' : ''}`}>{item.title}</span>
                              <div className="flex items-center gap-1">
                                {/* Pin slot (fixed width) */}
                                <span className="inline-flex h-4 w-4 items-center justify-center">
                                  <Pin className={`h-3 w-3 ${pinnedSections.has(slug) ? 'text-text-header-secondary dark:text-text-header-secondary-dark opacity-100' : 'opacity-0'}`} />
                                </span>
                                {/* Chevron slot (fixed width) */}
                                <span className="inline-flex h-4 w-4 items-center justify-center">
                                  <ChevronDown className={`${styles.chevronIcon} ${openSections.has(slug) ? 'rotate-180' : ''} ${pinnedSections.has(slug) ? 'text-text-header-secondary dark:text-text-header-secondary-dark' : ''}`} />
                                </span>
                              </div>
                            </Button>
                          )}
                          <CollapsibleContent className={styles.collapsibleContent}>
                            <div className={styles.subsectionContainer}>
                              {h1s.map((h1) => (
                                <Button key={h1.slug} variant="ghost" size="sm" className={styles.subsectionButton} asChild>
                                  <Link href={`#${h1.slug}`} scroll={false} onClick={(e) => { handleAnchorClick(e, h1.slug); toggleSidebar(); }}>
                                    <span className={styles.subsectionBullet}>—</span>
                                    {h1.text}
                                  </Link>
                                </Button>
                              ))}
                              {h2s.map((h2) => (
                                <Button key={h2.slug} variant="ghost" size="sm" className={styles.subsectionButton} asChild>
                                  <Link href={`#${h2.slug}`} scroll={false} onClick={(e) => { handleAnchorClick(e, h2.slug); toggleSidebar(); }}>
                                    <span className={styles.subsectionBullet}>—</span>
                                    {h2.text}
                                  </Link>
                                </Button>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        item.title && (
                          <Button
                            variant="ghost"
                            className={`${styles.mainNavButton} focus-visible:ring-0 focus-visible:ring-offset-0`}
                            onClick={(e) => handleAnchorClick(e, slug)}
                          >
                            <span className={`${styles.mainNavTitle} ${openSections.has(slug) ? 'text-text-header-secondary dark:text-text-header-secondary-dark' : ''}`}>{item.title}</span>
                            <div className="flex items-center gap-1">
                              {/* Chevron slot placeholder to align with items that have children */}
                              <span className="inline-flex h-4 w-4 items-center justify-center">
                                <ChevronDown className={`${styles.chevronIcon} opacity-0`} />
                              </span>
                            </div>
                          </Button>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </aside>
      </div>

      {/* Desktop Sidebar - Always visible on desktop */}
      <aside className={styles.sidebarAside}>
        <div className={styles.sidebarContainer}>
          <div className={styles.sidebarHeader}>
            <h1 className={styles.sidebarTitle}>The {year} Championship</h1>
          </div>
          <ScrollArea className={styles.scrollArea}>
            <div className={styles.sidebarContent}>
              {items.map((item) => {
                const slug = slugify(item.title);
                const headings = extractHeadings(item.content || '');
                const h1s = headings.filter(h => h.depth === 1);
                const h2s = headings.filter(h => h.depth === 2);
                const hasChildren = (h1s.length > 0 || h2s.length > 0);

                return (
                  <div key={slug} className={styles.sidebarSection}>
                    {hasChildren ? (
                      <Collapsible
                        defaultOpen={true}
                        open={openSections.has(slug)}
                        onOpenChange={(isOpen) => handleToggle(slug, isOpen)}
                      >
                        {item.title && (
                           <Button
                             variant="ghost"
                             className={`${styles.mainNavButton} focus-visible:ring-0 focus-visible:ring-offset-0`}
                             onClick={(e) => {
                               handleAnchorClick(e, slug);
                               handlePinToggle(e, slug);
                             }}
                             aria-label={pinnedSections.has(slug) ? 'Unpin section' : `Pin section ${item.title}`}
                           >
                            <span className={`${styles.mainNavTitle} ${openSections.has(slug) ? 'text-text-header-secondary dark:text-text-header-secondary-dark' : ''}`}>{item.title}</span>
                            <div className="flex items-center gap-1">
                              {/* Pin slot (fixed width) */}
                              <span className="inline-flex h-4 w-4 items-center justify-center">
                                <Pin className={`h-3 w-3 ${pinnedSections.has(slug) ? 'text-text-header-secondary dark:text-text-header-secondary-dark opacity-100' : 'opacity-0'}`} />
                              </span>
                              {/* Chevron slot (fixed width) */}
                              <span className="inline-flex h-4 w-4 items-center justify-center">
                                <ChevronDown className={`${styles.chevronIcon} ${openSections.has(slug) ? 'rotate-180' : ''} ${pinnedSections.has(slug) ? 'text-text-header-secondary dark:text-text-header-secondary-dark' : ''}`} />
                              </span>
                            </div>
                          </Button>
                        )}
                        <CollapsibleContent className={styles.collapsibleContent}>
                          <div className={styles.subsectionContainer}>
                            {h1s.map((h1) => (
                              <Button key={h1.slug} variant="ghost" size="sm" className={styles.subsectionButton} asChild>
                                <Link href={`#${h1.slug}`} scroll={false} onClick={(e) => handleAnchorClick(e, h1.slug)}>
                                  <span className={styles.subsectionBullet}>—</span>
                                  {h1.text}
                                </Link>
                              </Button>
                            ))}
                            {h2s.map((h2) => (
                              <Button key={h2.slug} variant="ghost" size="sm" className={styles.subsectionButton} asChild>
                                <Link href={`#${h2.slug}`} scroll={false} onClick={(e) => handleAnchorClick(e, h2.slug)}>
                                  <span className={styles.subsectionBullet}>—</span>
                                  {h2.text}
                                </Link>
                              </Button>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                     ) : (
                       item.title && (
                         <Button
                           variant="ghost"
                           className={`${styles.mainNavButton} focus-visible:ring-0 focus-visible:ring-offset-0`}
                           onClick={(e) => handleAnchorClick(e, slug)}
                         >
                           <span className={`${styles.mainNavTitle} ${openSections.has(slug) ? 'text-text-header-secondary dark:text-text-header-secondary-dark' : ''}`}>{item.title}</span>
                           <div className="flex items-center gap-1">
                             {/* Chevron slot placeholder to align with items that have children */}
                             <span className="inline-flex h-4 w-4 items-center justify-center">
                               <ChevronDown className={`${styles.chevronIcon} opacity-0`} />
                             </span>
                           </div>
                         </Button>
                       )
                     )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
};
