
import { toast } from "sonner";

/**
 * Save capsule data to localStorage
 */
export const saveCapsule = (capsuleData: any): boolean => {
  try {
    // Get existing capsules
    const existingData = localStorage.getItem('timeCapsules');
    const capsules = existingData ? JSON.parse(existingData) : [];
    
    // Check if capsule with this ID already exists
    const existingIndex = capsules.findIndex((c: any) => c.id === capsuleData.id);
    
    if (existingIndex !== -1) {
      // Update existing capsule
      capsules[existingIndex] = capsuleData;
    } else {
      // Add new capsule
      capsules.push(capsuleData);
    }
    
    // Save back to localStorage
    localStorage.setItem('timeCapsules', JSON.stringify(capsules));
    return true;
  } catch (error) {
    console.error("Error saving capsule:", error);
    return false;
  }
};

/**
 * Get all capsules from localStorage
 */
export const getAllCapsules = () => {
  try {
    const data = localStorage.getItem('timeCapsules');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error retrieving capsules:", error);
    toast.error("Failed to load your time capsules");
    return [];
  }
};

/**
 * Get a specific capsule by ID
 */
export const getCapsuleById = (id: string) => {
  try {
    const capsules = getAllCapsules();
    return capsules.find((capsule: any) => capsule.id === id) || null;
  } catch (error) {
    console.error("Error retrieving capsule:", error);
    return null;
  }
};

/**
 * Delete a capsule by ID
 */
export const deleteCapsule = (id: string): boolean => {
  try {
    const capsules = getAllCapsules();
    const filteredCapsules = capsules.filter((capsule: any) => capsule.id !== id);
    localStorage.setItem('timeCapsules', JSON.stringify(filteredCapsules));
    return true;
  } catch (error) {
    console.error("Error deleting capsule:", error);
    return false;
  }
};
