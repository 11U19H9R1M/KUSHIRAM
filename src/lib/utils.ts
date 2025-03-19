
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
