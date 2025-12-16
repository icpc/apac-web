"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import React from 'react';
import { marked } from 'marked';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Menu, X, Pin } from "lucide-react";
import styles from '@/app/_styles/sidebar-nav-styles.module.css';
import { navItems } from '@/app/navConfig';
import { AVAILABLE_YEARS } from "@/lib/constants";
import StyledDropdown from '@/components/ui/styled-dropdown';
import Divider from '@/app/_components/Divider';

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

// Get Championship navigation items
const getChampionshipNavItems = () => {
  const championshipItem = navItems.find(item => item.label === "Championship");
  return championshipItem?.children || [];
};

export const SidebarNavigation = ({
   items,
   year,
   hideDesktopSidebar = false
 }: {
    items: SubSectionContent[],
    year: string,
    hideDesktopSidebar?: boolean
  }) => {
    const router = useRouter();
    const pathname = usePathname();
     const [openSections, setOpenSections] = React.useState<Set<string>>(new Set());
     const [pinnedSections, setPinnedSections] = React.useState<Set<string>>(new Set());
     const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
     const [scrollPosition, setScrollPosition] = React.useState(0);
     const [pendingScrollTarget, setPendingScrollTarget] = React.useState<string | null>(null);
     const [snapshotSection, setSnapshotSection] = React.useState<string | null>(null);
     const lastVisibleRef = React.useRef<Map<string, number>>(new Map());
     const HYSTERESIS_MS = 400;

     const elementIds = items.map(item => slugify(item.title));
     const visibleElements = useIntersectionObserver(elementIds, {
       rootMargin: '-80px 0px -80px 0px',
       threshold: 0.1,
       delay: 100
     });

    React.useEffect(() => {
      // Only auto-manage sections when sidebar is closed
      if (isSidebarOpen) return;
      
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
    }, [visibleElements, pinnedSections, isSidebarOpen]);

     React.useEffect(() => {
      if (isSidebarOpen) {
        // Store current scroll position
        const currentScrollY = window.scrollY;
        setScrollPosition(currentScrollY);
        
        // Simple scroll prevention - just hide scrollbar
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      } else {
        // Restore scroll
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        
        // Handle pending scroll after sidebar closes
        if (pendingScrollTarget) {
          setTimeout(() => {
            const element = document.getElementById(pendingScrollTarget);
            if (element) {
              const offset = 80;
              const elementPosition = element.getBoundingClientRect().top;
              const currentScrollY = window.scrollY;
              const targetScrollY = elementPosition + currentScrollY - offset;
              
              window.scrollTo({
                top: targetScrollY,
                behavior: 'smooth'
              });
            }
            setPendingScrollTarget(null);
          }, 100);
        }
         
         // Close ALL accordions when sidebar exits
         setSnapshotSection(null);
         setOpenSections(new Set());
      }

      // Sync caret state with ChampionshipLayout
      document.dispatchEvent(new CustomEvent('toggleSidebar', { detail: isSidebarOpen }));

     return () => {
       document.documentElement.style.overflow = '';
       document.body.style.overflow = '';
     };
    }, [isSidebarOpen, pendingScrollTarget]);

    React.useEffect(() => {
      if (isSidebarOpen && !snapshotSection) {
        // Use scroll position to find current section directly
        const currentScrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const viewportMiddle = currentScrollY + viewportHeight / 2;

        // Find which section is currently in view
        let currentSectionSlug: string | null = null;
        let minDistance = Infinity;

        items.forEach(item => {
          const slug = slugify(item.title);
            const element = document.getElementById(slug);
            if (element) {
              const rect = element.getBoundingClientRect();
              const elementTop = rect.top + currentScrollY;
              const elementBottom = elementTop + rect.height;
              const elementMiddle = (elementTop + elementBottom) / 2;
              
              // Find section closest to viewport middle
              const distance = Math.abs(elementMiddle - viewportMiddle);
              if (distance < minDistance) {
                minDistance = distance;
                currentSectionSlug = slug;
              }
            }
        });

        if (currentSectionSlug && minDistance < 300) { // 300px tolerance
          setSnapshotSection(currentSectionSlug);
          // Small delay to ensure state is set before Collapsible renders
          setTimeout(() => {
            setOpenSections(new Set([currentSectionSlug!]));
          }, 50);
        }
      }
    }, [isSidebarOpen, snapshotSection, items]);

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

   const toggleSidebar = (newState?: boolean) => {
     const nextState = typeof newState === 'boolean' ? newState : !isSidebarOpen;
     
     // Dispatch the event first to ensure ChampionshipLayout gets the update
     document.dispatchEvent(new CustomEvent('toggleSidebar', { 
       detail: nextState,
       bubbles: true,
       cancelable: true
     }));
     
     // Then update our local state
     setIsSidebarOpen(nextState);
   };

   // Add event listener for the custom toggle event
   React.useEffect(() => {
     const handleToggle = (e: Event) => {
       const customEvent = e as CustomEvent;
       if (typeof customEvent.detail === 'boolean') {
         setIsSidebarOpen(customEvent.detail);
       } else {
         setIsSidebarOpen(prev => !prev);
       }
     };
     document.addEventListener('toggleSidebar', handleToggle as EventListener);
     return () => document.removeEventListener('toggleSidebar', handleToggle as EventListener);
   }, []);

  return (
    <>

      {/* Sidebar Modal Overlay */}
      {isSidebarOpen && (
        <div 
          className={styles.sidebarOverlay} 
          onClick={() => toggleSidebar(false)} 
        />
      )}

      {/* Sidebar Modal */}
      <div className={`${styles.sidebarModal} ${isSidebarOpen ? styles.sidebarModalOpen : ''}`}>
        <aside className={styles.sidebarModalContent}>
          <div className={`${styles.sidebarContainer}`}>
            <div className={styles.sidebarHeader}>
              <div className="flex items-center w-full">
                <h1 className={`${styles.sidebarTitle} whitespace-nowrap text-xl font-bold flex-1 mt-[20px]`}>The Championship</h1>
                <div className={`${styles.yearDropdownContainer} md:hidden ml-2`}>
                  <StyledDropdown
                    value={year}
                    onValueChange={(y) => {
                      // Extract current section from pathname - same logic as ChampionshipLayout
                      const pathSegments = pathname.split('/');
                      const currentSection = pathSegments[pathSegments.length - 1] || 'information';
                      router.push(`/championship/${y}/${currentSection}`);
                    }}
                    options={AVAILABLE_YEARS.sort((a, b) => Number(b) - Number(a)).map((y) => ({ value: y, label: y }))}
                    placeholder={year}
                    triggerClassName="text-sm font-medium"
                    itemsClassName="text-sm"
                    staticWidth={true}
                    width={80}
                  />
                </div>
                <Link
                  href={`/championship/${year}/changelogs`}
                  className="text-xs"
                >
                  Change Logs
                </Link>
              </div>
            </div>
            <ScrollArea className={`${styles.scrollArea}`}>
              <div className={styles.sidebarContent}>
                 {/* Championship Navigation - Mobile Only */}
                <div className={`${styles.navigationSection} ${styles.fullWidthSection}`}>
                  <Divider/>
                  <div className={styles.championshipButtonsGrid}>
                    {getChampionshipNavItems().map((item) => {
                      if (item.url) {
                        const itemPath = item.url.split('/').pop(); // Get the last part (e.g., 'information' from '/championship/latest/information')
                        const isActive = pathname.includes(`/${itemPath}`);
                        // Use current year instead of hardcoded 'latest'
                        const correctedUrl = `/championship/${year}/${itemPath}`;
                        return (
                          <Link
                            key={item.label}
                            href={correctedUrl}
                            onClick={(e) => {
                              e.preventDefault();
                              toggleSidebar(false);
                              router.push(correctedUrl);
                            }}
                            className={`${styles.championshipButton} 
                              ${isActive
                              ? 'dark:text-primaryAccent-dark text-text-header-secondary border border-green-600 dark:border-primaryAccent-dark bg-primaryAccent/10 dark:bg-primaryAccent-dark/10 '
                                : 'border border-transparent hover:border-gray-300 hover:bg-transparent dark:hover:border-white dark:hover:bg-transparent'
                              }`}
                          >
                            {item.label}
                          </Link>
                        );
                      }
                      return null;
                    })}
                  </div>
                  <Divider />
                </div>
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
                          defaultOpen={false}
                          open={openSections.has(slug)}
                          onOpenChange={(isOpen) => {
                            if (isSidebarOpen) {
                              // Allow manual toggle only when popup is open
                              handleToggle(slug, isOpen);
                            }
                          }}
                        >
                           {item.title && (
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                className={`${styles.mainNavButton} focus-visible:ring-0 focus-visible:ring-offset-0`}
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
                            </CollapsibleTrigger>
                           )}
                          <CollapsibleContent className={styles.collapsibleContent}>
                            <div className={styles.subsectionContainer}>
                               {h1s.map((h1) => (
                                 <Button key={h1.slug} variant="ghost" size="sm" className={styles.subsectionButton} asChild>
                                    <Link href={`#${h1.slug}`} scroll={false} onClick={(e) => { 
                                      e.preventDefault(); 
                                      router.replace(`#${h1.slug}`, { scroll: false });
                                      setPendingScrollTarget(h1.slug);
                                      toggleSidebar(); 
                                    }}>
                                     <span className={styles.subsectionBullet}>—</span>
                                     {h1.text}
                                   </Link>
                                 </Button>
                               ))}
                               {h2s.map((h2) => (
                                 <Button key={h2.slug} variant="ghost" size="sm" className={styles.subsectionButton} asChild>
                                    <Link href={`#${h2.slug}`} scroll={false} onClick={(e) => { 
                                      e.preventDefault(); 
                                      router.replace(`#${h2.slug}`, { scroll: false });
                                      setPendingScrollTarget(h2.slug);
                                      toggleSidebar(); 
                                    }}>
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
                             onClick={(e) => { 
                               e.preventDefault(); 
                               router.replace(`#${slug}`, { scroll: false });
                               setPendingScrollTarget(slug);
                               toggleSidebar(false);
                             }}
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
      <aside className={hideDesktopSidebar ? "hidden" : styles.sidebarAside}>
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
                               e.preventDefault();
                               handleAnchorClick(e, slug);
                               handlePinToggle(e, slug);
                               toggleSidebar(false);
                             }}
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
                                 <Link href={`#${h1.slug}`} scroll={false} onClick={(e) => {
                                   e.preventDefault();
                                   handleAnchorClick(e, h1.slug);
                                   toggleSidebar(false);
                                 }}>
                                   <span className={styles.subsectionBullet}>—</span>
                                   {h1.text}
                                 </Link>
                               </Button>
                             ))}
                             {h2s.map((h2) => (
                               <Button key={h2.slug} variant="ghost" size="sm" className={styles.subsectionButton} asChild>
                                 <Link href={`#${h2.slug}`} scroll={false} onClick={(e) => {
                                   e.preventDefault();
                                   handleAnchorClick(e, h2.slug);
                                   toggleSidebar(false);
                                 }}>
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
                             onClick={(e) => {
                                e.preventDefault();
                                handleAnchorClick(e, slug);
                                toggleSidebar(false);
                              }}
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
