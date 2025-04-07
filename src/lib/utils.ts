
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUniqueId(): string {
  return `capsule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatTimeLeft(date: Date | string): string {
  const targetDate = date instanceof Date ? date : new Date(date);
  const now = new Date();
  
  const diff = targetDate.getTime() - now.getTime();
  
  // If date is in the past
  if (diff <= 0) return "Unlocked";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 365) {
    const years = (days / 365).toFixed(1);
    return `${years} years left`;
  } else if (days > 30) {
    const months = Math.floor(days / 30);
    return `${months} months left`;
  } else if (days > 0) {
    return `${days} days left`;
  } else if (hours > 0) {
    return `${hours} hours left`;
  } else {
    return `${minutes} minutes left`;
  }
}

/**
 * Returns a className conditional that includes responsive classes
 * Example: getResponsiveClasses('text-base', 'md:text-xl', 'lg:text-2xl')
 */
export function getResponsiveClasses(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Creates responsive padding based on screen size
 */
export function getResponsivePadding(
  base: string = 'p-4', 
  sm: string = 'sm:p-6', 
  md: string = 'md:p-8', 
  lg: string = 'lg:p-10'
): string {
  return `${base} ${sm} ${md} ${lg}`;
}

/**
 * Gets responsive font sizes
 */
export function getResponsiveText(
  size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
): string {
  const sizes = {
    xs: 'text-xs sm:text-xs',
    sm: 'text-xs sm:text-sm',
    base: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg',
    xl: 'text-lg sm:text-xl md:text-xl',
    '2xl': 'text-xl sm:text-2xl md:text-2xl',
    '3xl': 'text-2xl sm:text-3xl md:text-3xl',
    '4xl': 'text-3xl sm:text-4xl md:text-4xl',
  };
  
  return sizes[size] || sizes.base;
}

/**
 * Creates a responsive grid with automatic column sizing
 */
export function getResponsiveGrid(
  cols: { base?: number; sm?: number; md?: number; lg?: number; xl?: number } = {}
): string {
  const { base = 1, sm = 2, md = 3, lg = 4, xl = 4 } = cols;
  
  return `grid grid-cols-${base} sm:grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${lg} xl:grid-cols-${xl} gap-4 md:gap-6`;
}

/**
 * Creates a container with responsive max width
 */
export function getResponsiveContainer(
  centered: boolean = true,
  withPadding: boolean = true
): string {
  return `w-full mx-${centered ? 'auto' : '0'} ${
    withPadding ? 'px-4 sm:px-6 md:px-8' : ''
  } max-w-7xl`;
}

/**
 * Generates glass morphism styles with responsive properties
 */
export function getGlassMorphismStyles(
  opacity: 'low' | 'medium' | 'high' = 'medium',
  blur: 'sm' | 'md' | 'lg' = 'md'
): string {
  const opacityValues = {
    low: 'bg-white/5 dark:bg-black/5',
    medium: 'bg-white/10 dark:bg-black/10',
    high: 'bg-white/20 dark:bg-black/20'
  };
  
  const blurValues = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg'
  };
  
  return `${opacityValues[opacity]} ${blurValues[blur]} border border-white/10 dark:border-white/5 shadow-lg`;
}

/**
 * Returns appropriate spacing for different device sizes
 */
export function getResponsiveSpacing(
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
): string {
  const spaces = {
    xs: 'space-y-1 sm:space-y-2',
    sm: 'space-y-2 sm:space-y-3',
    md: 'space-y-3 sm:space-y-4 md:space-y-6',
    lg: 'space-y-4 sm:space-y-6 md:space-y-8',
    xl: 'space-y-6 sm:space-y-8 md:space-y-12',
  };
  
  return spaces[size] || spaces.md;
}

/**
 * Creates responsive width classes
 */
export function getResponsiveWidth(
  small: boolean = false,
  fullOnMobile: boolean = true
): string {
  if (small) {
    return fullOnMobile ? 'w-full sm:w-auto sm:max-w-xs' : 'max-w-xs';
  }
  
  return fullOnMobile ? 'w-full sm:w-auto' : 'w-auto';
}
