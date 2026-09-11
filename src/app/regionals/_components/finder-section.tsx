import React from "react";
import Divider from "@/app/_components/divider";
import { CopyTooltip } from "@/components/ui/tooltip";
import markdownStyles from "@/app/_styles/markdown-styles.module.css";

interface FinderSectionProps {
  id: string;
  title: string;
  showDivider?: boolean;
  onCopyUrl: (e: React.MouseEvent, slug: string) => void;
  isCopied: boolean;
  children: React.ReactNode;
}

export function FinderSection({
  id,
  title,
  showDivider = true,
  onCopyUrl,
  isCopied,
  children,
}: FinderSectionProps) {
  return (
    <section id={id} className={`pb-2 ${showDivider ? "mt-10" : ""} scroll-mt-24`}>
      {showDivider && (
        <div className="mt-8">
          <Divider />
        </div>
      )}
      <div className="flex flex-col transition-all duration-200 min-h-12 sm:min-h-16">
        <div className="hidden sm:block">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="m-0 pt-2 text-2xl font-bold text-text-header-secondary dark:text-text-header-secondary-dark">
                {title}{" "}
                <CopyTooltip
                  onCopy={(e) => onCopyUrl(e, id)}
                  showCopiedTooltip={isCopied}
                >
                  🔗
                </CopyTooltip>
              </h2>
            </div>
          </div>
        </div>
        <div className="sm:hidden">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="m-0 text-2xl font-bold text-text-header-secondary dark:text-text-header-secondary-dark">
              {title}{" "}
              <CopyTooltip
                onCopy={(e) => onCopyUrl(e, id)}
                showCopiedTooltip={isCopied}
              >
                🔗
              </CopyTooltip>
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-0">
        <div className={`${markdownStyles.markdown} markdown`}>
          {children}
        </div>
      </div>
    </section>
  );
}
