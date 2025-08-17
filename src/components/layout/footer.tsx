"use client";

import { ICPC_APAC } from "@/lib/constants";
import WideContainer from "@/app/_components/pages/wide-container";
import styles from "@/app/_styles/footer-styles.module.css";
import { Card, CardContent } from "@/components/ui/card";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <WideContainer>
        <div className={`${styles.footerContainer}`} style={{ maxWidth: '1600px' }}>

          {/* Left Section */}
          <Card className={`${styles.footerDescription}`}>
            <CardContent className="p-6">
            <img
              src="/assets/icpc-apac-logo/icpc-apac-logo-new.png"
              alt={`${ICPC_APAC} Logo`}
              className={styles.footerLogo}
            />
            <p className={styles.footerTitle}>
              {ICPC_APAC}
            </p>
            {/* <p className={styles.footerText}>
              27 February - 02 March 2025
            </p> */}
            {/* <p className={styles.footerText}>
              Hosted by the{" "}
              <strong>
                <a
                  href="https://www.comp.nus.edu.sg/"
                  className={styles.footerLink}
                >
                  National University of Singapore, School of Computing
                </a>
              </strong>
            </p> */}
            {/*
            <p className={styles.footerText}>
              Organized by{" "}
              <strong>
                <a
                  href="https://cence.comp.nus.edu.sg/cence/"
                  className={styles.footerLink}
                >
                  NUS Centre for Nurturing Computing Excellence (CeNCE)
                </a>
              </strong>
            </p> */}
            <div>
              <p>Stay Informed, follow us on
                <br></br>
                <a
                  href="https://instagram.com/icpcapac"
                  className={styles.footerLink}
                >
                  <img
                    src="/favicon/instagram-logo.png"
                    alt="Instagram Logo"
                    className="inline-block w-5 h-5 mr-1"
                  />
                  &nbsp;Instagram
                </a>
              </p>
            </div>
            </CardContent>
          </Card>

          {/* <div className={styles.footerSponsors}>
            <div className={styles.footerSponsorsGlobal}>
            </div>

            <div className={styles.footerSponsorsTools}>
              <Sponsors type="tools" />
            </div>

          </div> */}
        </div>

        {/* Copyright */}
        <div className={styles.footerCopyright}>
          <p>©{ICPC_APAC}</p>
        </div>
      </WideContainer>
    </footer>
  );
}

export default Footer;
