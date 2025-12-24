# Championship Content Management Guide

## Overview

This guide explains how to manage content for the ICPC Asia Pacific Championship pages. The championship content is organized by year and uses a markdown-based system with JSON configuration files for navigation and sponsors.

## Architecture Summary

- **Routing**: Championship pages use dynamic routes `/championship/[year]/[section]`
- **Content**: Markdown files stored in `public/pages/championship/{year}/`
- **Ordering**: `order.json` files control navigation order and display names
- **Versioning**: Markdown files use date prefixes (`YYYYMMDD_filename.md`) - newest file is displayed
- **Sponsors**: JSON files define sponsor logos and groupings

## 1. Adding a New Championship Year

### Steps:

1. **Create the year directory structure:**
   ```
   public/pages/championship/{YEAR}/
   ├── order.json
   ├── information/
   │   ├── order.json
   │   └── {subfolders}/
   ├── competition/
   │   ├── order.json
   │   └── {subfolders}/
   ├── resources/
   │   ├── order.json
   │   └── {subfolders}/
   ├── teams/
   │   ├── order.json
   │   └── {subfolders}/
   ├── schedule/
   │   ├── order.json
   │   └── {subfolders}/
   ├── travel/
   │   ├── order.json
   │   └── {subfolders}/
   ├── committee/
   │   ├── order.json
   │   └── {subfolders}/
   └── sponsors/
       └── sponsors.json
   ```

   **Note**: The sections shown above are standard, but you can customize them by adding, removing, or renaming sections. If you make changes, be sure to update the main `order.json` file accordingly.

2. **Update constants** (`src/lib/constants.ts`):
   - Add the year to `AVAILABLE_YEARS` array: 
   ```typescript
   export const AVAILABLE_YEARS = ['2026', '2025', '2024'];
   ```
   - Note: Years should be in descending order (newest first)

3. **Create main `order.json`** (`public/pages/championship/{YEAR}/order.json`):
   ```json
   {
     "information": {
       "order": 1,
       "display_name": "Information"
     },
     "competition": {
       "order": 2,
       "display_name": "Competition"
     },
     "resources": {
       "order": 3,
       "display_name": "Resources"
     },
     "teams": {
       "order": 4,
       "display_name": "Teams"
     },
     "schedule": {
       "order": 5,
       "display_name": "Schedule"
     },
     "travel": {
       "order": 6,
       "display_name": "Travel"
     },
     "committee": {
       "order": 7,
       "display_name": "Committee"
     }
   }
   ```
   - Each **key** is the directory name (must match folder name exactly)
   - `order` controls navigation order (lower numbers appear first)
   - `display_name` is shown in the navigation menu

4. **Create section `order.json` files** for each section (e.g., `information/order.json`):
   ```json
   {
     "general": {
       "order": 1,
       "display_name": "General Information"
     },
     "hosts": {
       "order": 2,
       "display_name": "Hosts and Organizers"
     },
     "prizes": {
       "order": 3,
       "display_name": "Prizes"
     },
     "contact": {
       "order": 4,
       "display_name": "Contact"
     }
   }
   ```
   - Same structure: keys are subfolder names, values contain `order` and `display_name`

5. **Create subfolders and markdown files**:
   - Each subfolder contains markdown files with date prefixes: `YYYYMMDD_filename.md`
   - The newest file (by date prefix) is displayed
   - Example: `information/general/20250101_general.md`
   - Previous versions are automatically kept for version history

6. **Create sponsors file** (`sponsors/sponsors.json`):
   - See [section 3: Adding a Sponsor Logo](#3-adding-a-sponsor-logo) for details

## 2. Adding a Column to a Table

Tables are written as HTML in markdown files. To add a column:

1. **Locate the table** in the relevant markdown file (e.g., `teams/teams/20250114_teams.md`)

2. **Add `<th>` header** in the `<thead><tr>` section:
   ```html
   <th style="width: X%; min-width: Ypx;">Column Name</th>
   ```
   - Adjust `width` percentage to control column width
   - `min-width` ensures column doesn't get too narrow on small screens

3. **Add `<td>` cells** in each `<tbody><tr>` row:
   ```html
   <td>Column content</td>
   ```

**Example** (from teams page):
```html
<table>
  <thead>
    <tr>
      <th style="width: 10%; min-width: 100px"></th>
      <th style="width: 30%; min-width: 200px;">University</th>
      <th>Team Name(s)</th>
      <!-- Add new column here -->
      <th style="width: 15%; min-width: 120px;">New Column</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="..." alt="..." width="50"></td>
      <td>University Name</td>
      <td>
        <ul>
          <li>Team Name</li>
        </ul>
      </td>
      <!-- Add new cell here -->
      <td>New Column Data</td>
    </tr>
  </tbody>
</table>
```

## 3. Adding a Sponsor Logo

### Steps:

1. **Add logo file** to `public/assets/sponsors/`:
   - Format: `{sponsor-name}-logo.png` (lowercase, hyphens)
   - Example: `public/assets/sponsors/new-sponsor-logo.png`

2. **Update sponsors JSON** (`public/pages/championship/{YEAR}/sponsors/sponsors.json`):
   ```json
   [
     {
       "Sponsor Category Name": [
         {
           "Sponsor Name": {
             "size": 8,
             "filename": "/assets/sponsors/sponsor-name-logo.png"
           }
         },
         {
           "Another Sponsor": {
             "size": 6,
             "filename": "/assets/sponsors/another-sponsor-logo.png"
           }
         }
       ]
     },
     {
       "Another Category": [
         {
           "Sponsor Name": {
             "size": 4,
             "filename": "/assets/sponsors/sponsor-name-logo.png"
           }
         }
       ]
     }
   ]
   ```
   - **Structure**: Top-level array contains category objects
   - **Categories**: Each object has one key (category name) with an array of sponsors
   - **Sponsors**: Each sponsor object has one key (sponsor name) with `size` and `filename`
   - **Size**: Proportional width (relative to other logos in the same line)
     - Larger numbers = wider logos
     - Typical range: 3-20
   - **Filename**: Absolute path from `public/` directory (must start with `/assets/`)
   - **Order**: Array order determines display order

3. **For global sponsors** (shown in footer), update `public/pages/championship/current-global-sponsors.json`:
   ```json
   [
     {
       "Sponsor Name": {
         "size": 4,
         "filename": "/assets/sponsors/sponsor-name-logo.png"
       }
     },
     {
       "Another Global Sponsor": {
         "size": 7,
         "filename": "/assets/sponsors/another-sponsor-logo.png"
       }
     }
   ]
   ```
   - Simpler structure: array of sponsor objects
   - Each object has one key (sponsor name) with `size` and `filename`

**Example from 2025 sponsors.json:**
```json
[
  {
    "ICPC Global Sponsors": [
      {
        "Huawei": {
          "size": 4,
          "filename": "/assets/sponsors/huawei-logo.png"
        }
      },
      {
        "Jane Street": {
          "size": 8,
          "filename": "/assets/sponsors/jane-street-logo.png"
        }
      }
    ]
  },
  {
    "Local Sponsors": [
      {
        "Optiver": {
          "size": 6,
          "filename": "/assets/sponsors/optiver-logo.png"
        }
      }
    ]
  }
]
```

## 4. Adding a Page or Subpage

Pages and subpages are subfolders within a championship section. They appear as separate content sections on the same page at `/championship/{YEAR}/{SECTION}`.

**Note**: The structure is flat - sections can have subfolders, but those subfolders cannot have nested subfolders. Subfolders directly contain markdown files.

### Steps:

1. **Create subfolder** directly within the section:
   ```
   public/pages/championship/{YEAR}/{SECTION}/{subfolder-name}/
   ```
   - Example: `public/pages/championship/2025/information/new-page/`
   - Example: `public/pages/championship/2025/information/post-contest/`
   - The subfolder will contain markdown files directly (no further nesting)

2. **Add entry to section's `order.json`** (`{SECTION}/order.json`):
   ```json
   {
     "subfolder-name": {
       "order": X,
       "display_name": "Display Name"
     }
   }
   ```
   - The `display_name` will appear as a section heading
   - Use a descriptive `display_name` for the navigation
   - Set `order` to control where it appears (lower numbers appear first)

3. **Create markdown file** with date prefix:
   ```
   {YYYYMMDD}_{descriptive-name}.md
   ```
   - Example: `20250114_new-page.md`
   - Example: `20250412_post-contest.md`
   - Format: `YYYYMMDD` (8 digits) followed by underscore and descriptive name
   - Use descriptive names that match the subfolder
   - The newest file (by date) is displayed
   - Previous versions are kept for version history
   - Use `00000000` for placeholder/draft files or files with unknown date of creation (won't show last updated date)

4. **The page will automatically appear** at `/championship/{YEAR}/{SECTION}`:
   - Multiple pages show as separate sections with titles
   - Single page shows without section title
   - Order is controlled by `order.json`
   - Version history is automatically maintained (previous versions accessible)

## File Naming Conventions

### Markdown Files:
- **Championship pages**: `YYYYMMDD_descriptive-name.md`
  - Date prefix: `YYYYMMDD` format (e.g., `20250114`)
  - Use `00000000` for placeholder/draft files (won't show last updated date)
  - Newest file (by date) is displayed
  - Previous versions are kept for history

### Logo Files:
- Format: `{name}-logo.png` (lowercase, hyphens)
- Location: `public/assets/sponsors/`
- Example: `huawei-logo.png`, `jane-street-logo.png`

### Directory Names:
- Use lowercase with hyphens (e.g., `contest-env`, `post-contest`)
- Must match keys in `order.json` files exactly
- Examples: `information`, `contest-env`, `post-contest`

## Key Files Reference

- **Constants**: `src/lib/constants.ts` - `AVAILABLE_YEARS` array
- **Order configs**: 
  - `public/pages/championship/{year}/order.json` (main sections)
  - `public/pages/championship/{year}/{section}/order.json` (subpages)
- **Sponsors**: 
  - `public/pages/championship/{year}/sponsors/sponsors.json` (year-specific)
  - `public/pages/championship/current-global-sponsors.json` (footer)

## Examples

### Complete Example: Adding 2026 Championship

1. Add the new year to `src/lib/constants.ts`:
   ```typescript
   export const AVAILABLE_YEARS = ['2026', '2025', '2024'];
   ```

2. Create directory: `public/pages/championship/2026/`

3. Create `public/pages/championship/2026/order.json`:
   ```json
   {
     "information": { "order": 1, "display_name": "Information" },
     "competition": { "order": 2, "display_name": "Competition" },
     "resources": { "order": 3, "display_name": "Resources" },
     "teams": { "order": 4, "display_name": "Teams" },
     "schedule": { "order": 5, "display_name": "Schedule" },
     "travel": { "order": 6, "display_name": "Travel" },
     "committee": { "order": 7, "display_name": "Committee" }
   }
   ```

4. Create section directories and their `order.json` files

5. Create subfolders and markdown files

6. Create `sponsors/sponsors.json`

### Example: Adding a New Sponsor

1. Add logo: `public/assets/sponsors/acme-logo.png`

2. Update `public/pages/championship/2025/sponsors/sponsors.json`:
   ```json
   [
     {
       "Local Sponsors": [
         {
           "Acme Corporation": {
             "size": 6,
             "filename": "/assets/sponsors/acme-logo.png"
           }
         }
       ]
     }
   ]
   ```

### Example: Adding a New Information Page

1. Create: `public/pages/championship/2025/information/faq/`

2. Update `public/pages/championship/2025/information/order.json`:
   ```json
   {
     "general": { "order": 1, "display_name": "General Information" },
     "faq": { "order": 2, "display_name": "Frequently Asked Questions" },
     "hosts": { "order": 3, "display_name": "Hosts and Organizers" }
   }
   ```

3. Create: `public/pages/championship/2025/information/faq/20250115_faq.md`

---

For questions or issues, refer to the codebase structure or check existing examples in `public/pages/championship/2025/` or `public/pages/championship/2024/`.

