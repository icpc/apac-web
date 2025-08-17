"use client";

import { useTheme } from "@/app/_components/pages/theme-context";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleTheme}
        className="relative hover:bg-accent hover:text-accent-foreground"
        aria-label="Toggle theme"
      >
        {theme === "light" ? "🌙" : "☀️"}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}

export default ThemeSwitcher;
