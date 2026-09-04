import Footer from "@/app/_components/pages/footer";
import { ICPC_APAC } from "@/lib/constants";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import cn from "classnames";
import { ThemeProvider } from "@/components/common/theme-context";
import { getAssetUrl } from "@/lib/base-path";

import "./globals.css";
import Navbar from "./_components/pages/navbar";
// import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const generateMetadata = (): Metadata => {
  const envUrl = process.env.NEXT_PUBLIC_BASE_METADATA_KEY;
  const metadataBase = typeof envUrl === "string" ? new URL(envUrl) : undefined;
  return {
    metadataBase,
    title: `${ICPC_APAC}`,
    description: `The official website for the ${ICPC_APAC}`,
    openGraph: {
      images: [getAssetUrl("/assets/icpc-logo.png")],
    },
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // if (process.env.NODE_ENV === "production") {
  //   redirect("https://apac.icpc.global/");
  // }
//comment
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href={getAssetUrl("/favicon/favicon-96x96.png")} sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href={getAssetUrl("/favicon/favicon.svg")} />
        <link rel="shortcut icon" href={getAssetUrl("/favicon.ico")} />
        <link rel="apple-touch-icon" sizes="180x180" href={getAssetUrl("/favicon/apple-touch-icon.png")} />
        <meta name="apple-mobile-web-app-title" content="APAC'25" />
        <link rel="manifest" href={getAssetUrl("/favicon/site.webmanifest")} />
      </head>
      <body
        className={cn(
          inter.className,
          "bg dark:bg-dark bg-fixed dark:text-slate-300"
        )}
      >
        <ThemeProvider>
          <Navbar />
          <div className="min-h-screen my-10" suppressHydrationWarning>{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
