"use client";

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronRightIcon } from 'lucide-react';
import Container from "@/components/common/container";

import { AVAILABLE_YEARS } from "@/lib/constants";

import SponsorsGrid from "@/app/_components/pages/sponsors-grid";
import Divider from './divider';
import StyledDropdown from '@/components/ui/styled-dropdown';

interface ChampionshipLayoutProps {
  children: React.ReactNode;
  year: string;
}

interface OrderConfig {
  [key: string]: {
    order: number;
    "directory_name": string;
    "display_name": string;
  }
}

const defaultNavigationItems = [
  { label: 'Information', path: 'information' },
  { label: 'Competition', path: 'competition' },
  { label: 'Resources', path: 'resources' },
  { label: 'Teams', path: 'teams' },
  { label: 'Schedule', path: 'schedule' },
  { label: 'Venue', path: 'venue' },
  { label: 'Travel', path: 'travel' },
  { label: 'Committee', path: 'committee' }
];

export default function ChampionshipLayout({ children, year }: ChampionshipLayoutProps) {
  const pathname = usePathname();
  const basePath = `/championship/${year}`;

  const [navigationItems, setNavigationItems] = useState(defaultNavigationItems);
  const [isScrollable, setIsScrollable] = useState(false);

  const currentSection = pathname.split('/').pop() || '';
  const currentSectionLabel = navigationItems.find(item => item.path === currentSection)?.label || currentSection;

  useEffect(() => {

    // Fetch and process order.json
    fetch(`/pages/championship/${year}/order.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Order file not found');
        }
        return response.json();
      })
      .then((orderConfig: OrderConfig) => {
        // Create map for display names only
        const displayNameMap = new Map<string, string>();
        
        Object.values(orderConfig).forEach(item => {
          displayNameMap.set(item["directory_name"], item["display_name"]);
        });

        // Only update labels while maintaining original order
        const updatedItems = defaultNavigationItems.map(item => ({
          ...item,
          label: displayNameMap.get(item.path) || item.label
        }));

        setNavigationItems(updatedItems);
      })
      .catch(() => {
        // If order.json doesn't exist or there's an error, keep original items
        setNavigationItems(defaultNavigationItems);
      });
  }, [year]);

  // Scroll for sections
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check if the navigation is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setIsScrollable(scrollWidth > clientWidth);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, [navigationItems]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const router = useRouter();

  // Sync with sidebar state
  React.useEffect(() => {
    const handleSidebarToggle = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (typeof customEvent.detail === 'boolean') {
        setIsSidebarOpen(customEvent.detail);
      }
    };

    document.addEventListener('toggleSidebar', handleSidebarToggle as EventListener);
    return () => {
      document.removeEventListener('toggleSidebar', handleSidebarToggle as EventListener);
    };
  }, []);

  // Handle year change
  const handleYearChange = (newYear: string) => {
    const path = pathname.replace(/\/\d{4}\//, `/${newYear}/`);
    router.push(path);
  };

  // Handle sidebar toggle
  const handleToggleSidebar = React.useCallback((newState?: boolean) => {
    const nextState = typeof newState === 'boolean' ? newState : !isSidebarOpen;
    setIsSidebarOpen(nextState);
    document.dispatchEvent(new CustomEvent('toggleSidebar', { detail: nextState }));
  }, [isSidebarOpen]);

  return (
    <div className="relative">
      <Container>
        <div className="flex flex-col w-full">
          {/* Header Section */}
          <div className="flex items-center justify-between w-full mb-6 mt-8">
            <div className="flex items-center gap-2">
              
              {/* Title */}
              <div className="hidden sm:block">
                <h1 className="text-4xl font-bold">The Championship</h1>
              </div>
              <div className="block sm:hidden ml-6 mb-0">
                {/* Mobile Sidebar Toggle */}
                <button
                  onClick={() => handleToggleSidebar()}
                  type="button"
                  className="fixed top-24 -left-2 h-10 w-10 flex items-center justify-center rounded-md border border-border-navbar/50 bg-navbar/70 hover:bg-navbar/90 transition-all duration-200 backdrop-blur-lg z-[45] dark:border-border-navbar-dark/50 dark:bg-navbar-dark/70 dark:hover:bg-navbar-dark/90"
                  aria-label="Toggle sidebar"
                >
                  <ChevronRightIcon className={`h-5 w-5 text-text-header-primary dark:text-text-header-primary-dark transition-transform duration-200 ${isSidebarOpen ? 'rotate-180' : 'rotate-0'}`} />
                </button>
                <h1 className="text-3xl font-bold">The {year} Championship</h1>
                <h2 className="text-3xl font-bold">{currentSectionLabel === 'changelogs' ? 'Change Logs' : currentSectionLabel}</h2>
              </div>
              
              {/* Year Dropdown - Desktop Only */}
              <div className="hidden sm:block mt-4">
                <StyledDropdown
                  value={year}
                  onValueChange={handleYearChange}
                  options={AVAILABLE_YEARS.sort((a, b) => Number(b) - Number(a)).map(y => ({ value: y, label: y }))}
                  placeholder={year}
                  triggerClassName="text-2xl sm:text-2xl font-bold bg-white"
                  itemsClassName="text-lg font-medium"
                  className="text-black"
                  staticWidth={true}
                  width={120}
                />
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <a 
                href={`${basePath}/changelogs`} 
                className="text-gray-400 text-sm sm:text-base whitespace-nowrap hover:text-gray-600 transition-colors"
              >
                Change Logs
              </a>
            </div>
          </div>

          {/* Sponsors */}
          <SponsorsGrid year={year} />
          
          <div className="hidden sm:block">
            <Divider />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:block relative w-full h-fit mt-4">
            {isScrollable && (
              <>
                <button 
                  onClick={scrollLeft} 
                  className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-[1em] px-2 py-4 rounded-lg bg-secondaryAccent/10 backdrop-blur-lg text-lg font-medium dark:text-white"
                >
                  {"<"}
                </button>
                <button 
                  onClick={scrollRight} 
                  className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-[1em] px-2 py-4 rounded-lg bg-secondaryAccent/10 backdrop-blur-lg text-lg font-medium transition-colors dark:text-white"
                >
                  {">"}
                </button>
              </>
            )}
            <div className="w-full mx-auto justify-between overflow-x-auto" ref={scrollContainerRef}>
              <div className="flex gap-2 justify-between min-w-fit">
                {navigationItems.map((item) => {
                  const isActive = pathname.includes(`/${item.path}`);
                  return (
                    <Link
                      key={item.path}
                      href={`${basePath}/${item.path}`}
                      className={`px-6 py-3 text-lg font-medium rounded-lg transition-colors dark:text-white 
                        ${isActive
                          ? 'dark:text-primaryAccent-dark text-text-header-secondary border border-text-header-secondary dark:border-primaryAccent-dark bg-primaryAccent/10 dark:bg-primaryAccent-dark/10'
                          : 'border border-transparent hover:border-gray-300 hover:bg-transparent dark:hover:border-white dark:hover:bg-transparent'
                        }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="hidden sm:block mt-4">
            <Divider />
          </div>
          
          {/* Page Content */}
          <div className="w-full pl-2">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
}
