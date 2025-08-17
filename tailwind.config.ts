import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Palette
        primary: {
          DEFAULT: "rgba(37, 61, 91, 1)", // Dark Blue
          dark: "rgba(26, 43, 60, 1)",    // Darker Blue
        },
        primaryAccent: {
          DEFAULT: "rgba(110, 231, 183, 1)", // Light Green
          dark: "rgba(16, 185, 129, 1)",    // Dark Green
        },
        // Secondary Palette
        secondary: {
          DEFAULT: "rgba(204, 204, 204, 1)", // Light Gray
          dark: "rgba(153, 153, 153, 1)",    // Medium Gray
        },
        secondaryAccent: {
          DEFAULT: "rgba(178, 255, 229, 1)", // Pale Cyan
          dark: "rgba(26, 105, 76, 1)",      // Dark Teal
        },
        // Neutral Palette
        background: {
          DEFAULT: "rgba(249, 250, 252, 1)", // Off White
          dark: "rgba(31, 41, 55, 1)",       // Dark Blue Gray
        },
        navbar: {
          DEFAULT: "rgba(240, 240, 240, 0.7)", // Light Gray with Transparency
          dark: "rgba(20, 28, 40, 0.7)"        // Dark Blue Gray with Transparency
        },
        scrollbar:{
          DEFAULT: "rgba(220, 220, 220, 1)", // Light Gray
          dark: "rgba(51, 61, 75, 1)",       // Lighter Dark Blue Gray
        },
        // Other
        border: {
          DEFAULT: "rgba(165, 165, 165, 1)", // Medium Gray
        },
        text: {
          body: {
            DEFAULT: "theme('colors.background.dark')",       // Dark Blue Gray
            dark: "theme('colors.background.DEFAULT')",        // Off White
          },
          header: {
            primary: {
              DEFAULT: "theme('colors.background.dark')",       // Dark Blue Gray
              dark: "theme('colors.background.DEFAULT')",        // Off White
            },
            secondary: {
              DEFAULT: "rgba(16, 115, 94, 1)",       // Dark Green
              dark: "rgba(188, 237, 221, 1)",        // Light Cyan
            },
            ternary: {
              DEFAULT: "rgba(19, 141, 115, 1)", // Medium Green
              dark: "rgba(160, 211, 208, 1)",  // Light Cyan
            },
            others: {
              cyanalpha: "rgba(52, 211, 153, 0.1)", // Light Green with Transparency
            }
          },
          links: {
            DEFAULT: "rgba(22, 166, 126, 1)", // Green
            dark: "rgba(110, 231, 183, 1)",   // Light Green
            hover: {
              DEFAULT: "rgba(11, 91, 91, 1)", // Dark Teal
              dark: "rgba(179, 244, 204, 1)"   // Light Green
            },
            highlight: {
              DEFAULT: "rgba(110, 231, 183, 0.1)", // Light Green with Transparency
              dark: "rgba(65, 187, 153, 0.1)"      // Dark Green with Transparency
            },
          }
        },
      },
      textColor: {
        "link-hover": "theme('colors.link.hover')", // Correct reference
      },
      lineColor: {
        DEFAULT: "#0A183D",
        dark: "#0A183D"
      },
      spacing: {
        28: "7rem",
      },
      letterSpacing: {
        tighter: "-.04em",
      },
      fontSize: {
        "5xl": "2.5rem",
        "6xl": "2.75rem",
        "7xl": "4.5rem",
        "8xl": "6.25rem",
      },
      boxShadow: {
        sm: "0 5px 10px rgba(0, 0, 0, 0.12)",
        md: "0 8px 30px rgba(0, 0, 0, 0.12)",
      },
      backgroundImage: {
        DEFAULT: 'linear-gradient(to bottom right, theme("colors.background.DEFAULT") 80%, theme("colors.secondaryAccent.DEFAULT"))',
        dark: 'linear-gradient(to bottom right, theme("colors.background.dark") 60%, theme("colors.secondaryAccent.dark"))'
      },
    },
  },
  plugins: [],
};

export default config;
