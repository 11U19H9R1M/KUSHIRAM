
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "@/hooks/useTheme";
import { motion } from "framer-motion";

const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Toggle 
      pressed={theme === "dark"} 
      onPressedChange={toggleTheme}
      aria-label="Toggle theme"
      className={`relative overflow-hidden glass-button ${className}`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 0 : 180 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative z-10"
      >
        {theme === "dark" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </motion.div>
      <motion.div 
        className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-md z-0"
        initial={false}
        animate={{ 
          opacity: theme === "dark" ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      />
    </Toggle>
  );
};

export default ThemeToggle;
