"use client";

import { ICPC_APAC } from "@/lib/constants";
import WideContainer from "@/components/common/wide-container";
import styles from "@/app/_styles/intro-styles.module.css";
import { useTheme } from "@/components/common/theme-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SponsorsCarousel } from "./sponsors-carousel";
import { getAssetUrl } from "@/lib/base-path";

export function Intro() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <div className="mb-20 md:mb-12">
      <section
        className={`relative h-400px lg:grid lg:h-screen lg:grid-rows-9 items-center pb-12 ${styles.background}`}
        style={{
          backgroundImage: `linear-gradient(to bottom, 
            var(--intro-gradient-start) 20%, 
            var(--intro-gradient-end) 100%, 
            transparent), 
            url('${getAssetUrl("/assets/home/banner.jpg")}')`,
        }}
      >
        <div className="lg:row-span-2"></div>
        {/* Content */}
        <WideContainer className={`${styles.content} flex flex-col py-36 lg:py-48 lg:py-0 lg:flex-row items-center justify-between lg:row-span-3`}>
          <div className="order-2 lg:order-1">
            <p className={`${styles.title}`}>{ICPC_APAC}</p>
            <p className={`${styles.subtitle} mt-4 max-w-2xl`}>
              The premier programming competition for students in the Asia-Pacific region, a gateway to the ICPC World Finals.
            </p>
            {/* <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button asChild variant="ghost" className="px-6 py-3 text-lg font-medium rounded-lg transition-colors dark:text-white dark:text-primaryAccent-dark text-text-header-secondary border border-text-header-secondary dark:border-primaryAccent-dark bg-primaryAccent/10 dark:bg-primaryAccent-dark/10 hover:bg-primaryAccent/20 dark:hover:bg-primaryAccent-dark/20">
                <Link href="/championship/latest/information">
                  Get Ready for the Asia Pacific Championship
                </Link>
              </Button>
            </div> */}
          </div>
          <img src={getAssetUrl(`/assets/icpc-apac-logo/icpc-apac-logo-new-solid-${dark ? "white" : "blue"}.png`)} alt="ICPC APAC Logo" className="w-2/3 max-w-[300px] pb-12 md:w-1/3 order-1 lg:order-2 lg:pb-0" />
        </WideContainer>
        <div className="lg:row-span-1"></div>
        <div className="my-2 lg:row-span-3 w-full px-4 lg:px-8">
          <SponsorsCarousel dataPath="/pages/championship/current-global-sponsors.json" sizeMultiplier={1.8} scrollSpeed={1} />
        </div>
        {/* <div className="my-2 lg:row-span-3 w-full px-4 lg:px-8">
          <SponsorsCarousel dataPath="/pages/championship/all-sponsors.json" sizeMultiplier={1} scrollSpeed={2} />
        </div> */}
      </section>
    </div>
  );
}
