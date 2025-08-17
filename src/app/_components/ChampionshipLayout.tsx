"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Container from "@/app/_components/pages/container";
import { useEffect, useState } from 'react';

import { AVAILABLE_YEARS } from "@/lib/constants";

import SponsorsGrid from "@/app/_components/pages/sponsorsGrid";
import { marked } from 'marked';
import Divider from './Divider';

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
  { label: 'Travel', path: 'travel' },
  { label: 'Committee', path: 'committee' }
];

export default function ChampionshipLayout({ children, year }: ChampionshipLayoutProps) {
  const pathname = usePathname();
  const basePath = `/championship/${year}`;

  const [htmlContent, setHtmlContent] = useState<string>('');
  const [navigationItems, setNavigationItems] = useState(defaultNavigationItems);

  useEffect(() => {
    // Fetch sponsors content
    fetch(`/pages/championship/${year}/sponsors/sponsors.md`)
      .then(response => response.text())
      .then(text => {
        const parsedHtml = marked.parse(text) as string;
        setHtmlContent(parsedHtml);
      })
      .catch(error => {
        console.error('Error loading sponsors:', error);
      });

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

  return (
    <Container>
      <div className="flex flex-col w-full">
        <div className="flex flex-col items-start w-full mb-4">
          <div className="w-full mx-auto">
            <div className="flex flex-row items-center justify-between gap-4 h-32">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold my-auto">The Championship</h1>
                <select 
                  className="px-4 py-2 text-xl bg-background border rounded-md font-bold my-auto text-text-header-secondary"
                  value={year}
                  onChange={(e) => {
                    window.location.href = `/championship/${e.target.value}/${pathname.split('/')[3] || 'information'}`;
                  }}
                >
                  {AVAILABLE_YEARS.sort((a, b) => Number(b) - Number(a)).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <a 
                href={`${basePath}/changelogs`} className="text-gray-400">
                Change Logs
              </a>
            </div>
          </div>
          {/* <div className="markdown" dangerouslySetInnerHTML={{ __html: htmlContent }}></div> */}
          <SponsorsGrid year={year} />
            
          <Divider />

          <div className="w-full mx-auto mt-4 justify-between">
            <div className="flex flex-wrap gap-2 justify-between">
              {navigationItems.map((item) => {
                const isActive = pathname.includes(`/${item.path}`);
                return (
                  <Link
                    key={item.path}
                    href={`${basePath}/${item.path}`}
                    // Button for the sections
                    className={`px-6 py-3 text-lg font-medium rounded-lg transition-colors dark:text-white 
                      ${isActive
                        ? 'bg-primaryAccent dark:bg-primaryAccent-dark dark:text-background'
                        : 'hover:bg-primary/10 dark:hover:bg-primaryAccent-dark/10'
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <Divider />
        
        <div className="w-full">
          {children}
        </div>
      </div>
    </Container>
  );
} 