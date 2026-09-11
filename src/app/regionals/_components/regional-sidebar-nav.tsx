import React from "react";
import { Button } from "@/components/ui/button";
import styles from "@/app/_styles/sidebar-nav-styles.module.css";

export interface NavSection {
  id: string;
  label: string;
}

interface RegionalSidebarNavProps {
  navSections: NavSection[];
  activeSectionId: string;
  onSelectSection: (id: string) => void;
}

export function RegionalSidebarNav({
  navSections,
  activeSectionId,
  onSelectSection,
}: RegionalSidebarNavProps) {
  return (
    <div className={styles.sidebarContent}>
      {navSections.map((section) => {
        const isActive = activeSectionId === section.id;
        return (
          <div key={section.id} className={styles.sidebarSection}>
            <Button
              variant="ghost"
              className={`${styles.mainNavButton} focus-visible:ring-0 focus-visible:ring-offset-0`}
              onClick={() => onSelectSection(section.id)}
            >
              <span
                className={`${styles.mainNavTitle} ${
                  isActive
                    ? "text-text-header-secondary dark:text-text-header-secondary-dark"
                    : ""
                }`}
              >
                {section.label}
              </span>
            </Button>
          </div>
        );
      })}
    </div>
  );
}
