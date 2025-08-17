# ICPC Asia Pacific Championship Website

A modern, responsive website built with Next.js for the ICPC Asia Pacific Championship. This website features a dynamic theme system, responsive design, and a modular architecture.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Styling System](#styling-system)
- [Theme System](#theme-system)
- [Components](#components)
- [Assets Management](#assets-management)
- [Deployment](#deployment)

## Prerequisites

- Node.js 20.0.0 or later
- npm or yarn package manager

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/Si-plus-plus/icpc-apac
```

2. Navigate to the project directory    

```bash
cd icpc-apac
```

3. Install dependencies

```bash
npm install
```

4. Run the development server

```bash
npm run dev
```

5. For deployment:
   - Local deployment: `chmod +x local-start.sh && ./local-start.sh`
   - Server deployment: `chmod +x deploy.sh && ./deploy.sh`

## Project Structure

```
icpc-apac/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── _components/        # Reusable React components
│   │   │   └── pages/         # Page-specific components
│   │   ├── _styles/           # CSS modules for styling
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout component
│   │   └── page.tsx           # Home page component
│   ├── lib/                    # Utility functions and constants
│   └── interfaces/            # TypeScript interfaces
├── public/                    # Static assets
│   ├── assets/               # Images and media files
│   └── favicon/              # Favicon files
├── tailwind.config.ts        # Tailwind CSS configuration
└── package.json              # Project dependencies and scripts
```

## Architecture

The website is built using:
- **Next.js 14**: For server-side rendering and routing
- **TypeScript**: For type safety
- **Tailwind CSS**: For styling
- **Radix UI**: For accessible UI components

### Key Features
- Server-side rendering for better performance
- Dynamic theme switching (light/dark mode)
- Responsive design for all screen sizes
- Modular component architecture
- Markdown content support

## Styling System

The project uses a combination of:
1. **Tailwind CSS**: For utility-first styling
2. **CSS Modules**: For component-specific styles
3. **Global CSS**: For base styles and theme variables

### Color Palette

#### Light Theme
- Primary: Dark Blue (rgba(37, 61, 91, 1))
- Primary Accent: Light Green (rgba(110, 231, 183, 1))
- Secondary: Light Gray (rgba(204, 204, 204, 1))
- Secondary Accent: Pale Cyan (rgba(178, 255, 229, 1))
- Background: Off White (rgba(249, 250, 252, 1))

#### Dark Theme
- Primary: Darker Blue (rgba(26, 43, 60, 1))
- Primary Accent: Dark Green (rgba(16, 185, 129, 1))
- Secondary: Medium Gray (rgba(153, 153, 153, 1))
- Secondary Accent: Dark Teal (rgba(26, 105, 76, 1))
- Background: Dark Blue Gray (rgba(31, 41, 55, 1))

### Typography
- Font Family: Inter (Google Fonts)
- Heading Sizes:
  - h1: 2.5rem (40px)
  - h2: 2rem (32px)
  - h3: 1.75rem (28px)
- Body Text: 1.125rem (18px)

## Theme System

The theme system is implemented using:
- React Context API for state management
- Local storage for theme persistence
- CSS variables for dynamic theme switching
- System preference detection

### Theme Toggle
- Accessible theme switcher component
- Smooth transitions between themes
- Persists user preference

## Components

### Core Components
1. **Navbar**
   - Responsive navigation menu
   - Dynamic theme switcher
   - Mobile-friendly dropdown

2. **Footer**
   - Sponsor showcase
   - Contact information
   - Social media links

3. **Container**
   - Responsive padding and width
   - Maximum width constraints
   - Centered content layout

4. **Content**
   - Markdown rendering
   - Syntax highlighting
   - Responsive images

### Page Components
1. **Intro**
   - Hero section with background image
   - Gradient overlay
   - Responsive layout

2. **Sponsors**
   - Grid layout for logos
   - Responsive sizing
   - Category organization

## Assets Management

### Image Guidelines
- Use Next.js Image component for optimization
- Recommended formats: WebP, PNG
- Responsive image sizes
- Lazy loading enabled

### Icons and Favicons
- Multiple favicon sizes
- SVG icons when possible
- Web app manifest included

### Yearly Sponsors Data Structure

The `public/pages/championship/{year}/sponsors/sponsors.json` file defines the sponsors to be displayed on the sponsorship page. It follows a specific structure to allow for flexible ordering and grouping.

The file contains a top-level JSON array `[]`.

Each element in the array is an object `{}` that represents a single sponsor card (e.g., a card for "Local Sponsors"). The order of these objects in the array dictates the priority of the cards on the page.

```json
[
  { /* Card 1 */ },
  { /* Card 2 */ },
  { /* Card 3 */ }
]
```

Inside each card object, there is a **single key-value pair**.
- The **key** is a string that serves as the title for the card (e.g., `"ICPC Global Sponsors"`).
- The **value** is an array of sponsor objects.

```json
{
  "Card Title": [ /* List of sponsors for this card */ ]
}
```

The array of sponsors contains objects, where each object represents one sponsor. The order of these objects determines the display order of the logos within the card.

Similar to the card object, each sponsor object has a **single key-value pair**.
- The **key** is the sponsor's name (e.g., `"Huawei"`).
- The **value** is an object containing the sponsor's details.

```json
{
  "Sponsor Name": {
    "size": 13,
    "filename": "/path/to/logo.png"
  }
}
```

The sponsor details object has two properties:
- `"size"`: A number representing the proportional space the logo should occupy relative to other logos in the same line.
- `"filename"`: A string with the path to the logo image file. The path should be absolute from the `public` directory.

#### Full Example:

```json
[
  {
    "ICPC Global Sponsors": [
      {
        "Huawei": {
          "size": 13,
          "filename": "/assets/sponsors/huawei-logo.png"
        }
      },
      {
        "Jane Street": {
          "size": 10,
          "filename": "/assets/sponsors/jane-street-logo.png"
        }
      }
    ]
  }
]
```
