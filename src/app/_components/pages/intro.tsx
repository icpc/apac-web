"use client";

import { ICPC_APAC } from "@/lib/constants";
import WideContainer from "@/app/_components/pages/wide-container";
import styles from "@/app/_styles/intro-styles.module.css";
import { useTheme } from "@/app/_components/pages/theme-context";

export function Intro() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <div className="mb-20 md:mb-12">
      <section
        className={`relative h-400px lg:grid lg:h-screen lg:grid-rows-9 items-center px-8 pb-12 ${styles.background}`}
        style={{
          backgroundImage: `linear-gradient(to bottom, 
            var(--intro-gradient-start) 80%, 
            var(--intro-gradient-end) 100%, 
            transparent), 
            url('/assets/nus-soc.jpeg')`,
        }}
      >
        <div className="lg:row-span-2"></div>
        {/* Content */}
        <WideContainer className={`${styles.content} flex flex-col py-36 lg:py-48 lg:py-0 lg:flex-row items-center justify-between lg:row-span-3`}>
          <div className="order-2 lg:order-1">
            <p className={`${styles.title}`}>{ICPC_APAC}</p>
            <p className={styles.subtitle}>
              Hosted by the National University of Singapore
            </p>
            <div className="flex flex-col justify-center items-center lg:inline">
              <img
                src={dark ? "/assets/nus-logo-white.png" : "/assets/nus-logo-black.png"}
                alt="NUS Logo"
                className={styles.logo}
              />
            </div>
          </div>
          <img src={`/assets/icpc-apac-logo/icpc-apac-logo-new-solid-${dark ? "light-blue" : "dark-blue"}-thin.png`} alt="ICPC APAC Logo" className="w-2/3 pb-12 md:w-1/3 order-1 lg:order-2 lg:pb-0" />
        </WideContainer>
        <div className="lg:row-span-1"></div>
        <div className="my-2 lg:row-span-3 ">
        </div>
      </section>
    </div>
  );
}
