"use client";

import Link from 'next/link';
import React from 'react';
import { marked } from 'marked';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import styles from '@/app/_styles/sidebar-nav-styles.module.css';
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

export const SidebarNavigation = ({ 
  items, 
  year 
}: { 
  items: SubSectionContent[], 
  year: string 
}) => {
  const [openSections, setOpenSections] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const observers = new Map<string, IntersectionObserver>();
    
    items.forEach((item) => {
      const slug = slugify(item.title);
      const targetElement = document.getElementById(slug);
      
      if (targetElement) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setOpenSections((prev) => new Set([...prev, slug]));
              } else {
                setOpenSections((prev) => {
                  const next = new Set(prev);
                  next.delete(slug);
                  return next;
                });
              }
            });
          },
          {
            rootMargin: '-100px 0px -100px 0px',
            threshold: 0.1
          }
        );
        
        observer.observe(targetElement);
        observers.set(slug, observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [items]);

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

  return (
    <aside className={styles.sidebarAside}>
      <div className={styles.sidebarContainer}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.sidebarTitle}>The {year} Championship</h1>
        </div>        
        <ScrollArea className={styles.scrollArea}>
          <div className={styles.sidebarContent}>
            {items.map((item, idx) => {
              const slug = slugify(item.title);
              const headings = extractHeadings(item.content || '');
              const h1s = headings.filter(h => h.depth === 1);
              const h2s = headings.filter(h => h.depth === 2);
              
              return (
                <div key={slug} className={styles.sidebarSection}>
                  <Collapsible 
                    defaultOpen={true} 
                    open={openSections.has(slug)}
                    onOpenChange={(isOpen) => handleToggle(slug, isOpen)}
                  >
                    {item.title && (
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className={styles.mainNavButton}>
                          <Link href={`#${slug}`} className="flex-1 text-left">{item.title}</Link>
                          {(h1s.length > 0 || h2s.length > 0) && <ChevronDown className={styles.chevronIcon} />}
                        </Button>
                      </CollapsibleTrigger>
                    )}
                    <CollapsibleContent className={styles.collapsibleContent}>
                      <div className={styles.subsectionContainer}>
                        {h1s.map((h1) => (
                          <Button key={h1.slug} variant="ghost" size="sm" className={styles.subsectionButton} asChild>
                            <Link href={`#${h1.slug}`}>
                              <span className={styles.subsectionBullet}>—</span>
                              {h1.text}
                            </Link>
                          </Button>
                        ))}
                        {h2s.map((h2) => (
                          <Button key={h2.slug} variant="ghost" size="sm" className={styles.subsectionButton} asChild>
                            <Link href={`#${h2.slug}`}>
                              <span className={styles.subsectionBullet}>—</span>
                              {h2.text}
                            </Link>
                          </Button>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}; 