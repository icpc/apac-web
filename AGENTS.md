# AGENTS.md

## Build/Lint/Test Commands

- Build: `npm run build`
- Development server: `npm run dev` (uses Turbopack)
- Start: `npm run start -p 3000`

## Code Style Guidelines

- **Formatting**: Use Prettier with Tailwind CSS plugin (configured in package.json scripts)
- **Imports**: Use absolute paths with @/ prefix (e.g., `@/components/ui/button`)
- **Types**: Strict TypeScript (enabled in tsconfig.json)
- **Naming**: 
  - Components: PascalCase (e.g., `MyComponent`)
  - Functions/Variables: camelCase (e.g., `myFunction`)
  - **Files**: kebab-case (e.g., `my-component.tsx`, `use-hook.ts`)
- **Styling**: Prefer Tailwind CSS utilities; use CSS modules for complex component styles
- **Components**: Store in src/app/_components/ or src/components/
- **Error Handling**: Use try-catch for async operations; validate data from external sources
- **Best Practices**: Use React hooks properly; avoid inline functions in render

## File Naming Conventions

- **Rule**: All files must use kebab-case naming (lowercase letters, numbers, and hyphens only)
- **Examples**: 
  - ✅ `my-component.tsx`, `use-hook.ts`, `api-handler.ts`
  - ❌ `MyComponent.tsx`, `useHook.ts`, `apiHandler.ts`
- **Enforcement**: Pre-commit hook automatically prevents commits with non-kebab-case filenames
- **Migration**: Project has been migrated from PascalCase/camelCase to kebab-case file naming

No Cursor, Copilot, or linter rules found.