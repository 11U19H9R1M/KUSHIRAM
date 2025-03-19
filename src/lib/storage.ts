
import { toast } from "sonner";

/**
 * Save document data to localStorage
 */
export const saveCapsule = (documentData: any): boolean => {
  try {
    // Get existing documents
    const existingData = localStorage.getItem('academicDocuments');
    const documents = existingData ? JSON.parse(existingData) : [];
    
    // Check if document with this ID already exists
    const existingIndex = documents.findIndex((c: any) => c.id === documentData.id);
    
    if (existingIndex !== -1) {
      // Update existing document
      documents[existingIndex] = documentData;
    } else {
      // Add new document
      documents.push(documentData);
    }
    
    // Save back to localStorage
    localStorage.setItem('academicDocuments', JSON.stringify(documents));
    return true;
  } catch (error) {
    console.error("Error saving document:", error);
    return false;
  }
};

/**
 * Get all documents from localStorage
 */
export const getAllCapsules = () => {
  try {
    const data = localStorage.getItem('academicDocuments');
    if (!data) {
      // If no data exists in the new format, try the old format for backward compatibility
      const oldData = localStorage.getItem('timeCapsules');
      return oldData ? JSON.parse(oldData) : [];
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error retrieving documents:", error);
    toast.error("Failed to load your academic documents");
    return [];
  }
};

/**
 * Get a specific document by ID
 */
export const getCapsuleById = (id: string) => {
  try {
    const documents = getAllCapsules();
    return documents.find((doc: any) => doc.id === id) || null;
  } catch (error) {
    console.error("Error retrieving document:", error);
    return null;
  }
};

/**
 * Delete a document by ID
 */
export const deleteCapsule = (id: string): boolean => {
  try {
    const documents = getAllCapsules();
    const filteredDocuments = documents.filter((doc: any) => doc.id !== id);
    localStorage.setItem('academicDocuments', JSON.stringify(filteredDocuments));
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    return false;
  }
};

/**
 * Check if a document is now unlockable (release date has passed)
 */
export const isDocumentUnlockable = (document: any): boolean => {
  if (!document || !document.unlockDate) return false;
  
  const unlockDate = new Date(document.unlockDate);
  const now = new Date();
  
  return now >= unlockDate;
};

/**
 * Get documents filtered by status (released/unreleased)
 */
export const getDocumentsByStatus = (released: boolean) => {
  try {
    const documents = getAllCapsules();
    const now = new Date();
    
    return documents.filter((doc: any) => {
      const unlockDate = new Date(doc.unlockDate);
      if (released) {
        return now >= unlockDate;
      } else {
        return now < unlockDate;
      }
    });
  } catch (error) {
    console.error("Error filtering documents:", error);
    return [];
  }
};

/**
 * Get documents by department
 */
export const getDocumentsByDepartment = (department: string) => {
  try {
    const documents = getAllCapsules();
    return documents.filter((doc: any) => 
      doc.department && doc.department.toLowerCase() === department.toLowerCase()
    );
  } catch (error) {
    console.error("Error filtering documents by department:", error);
    return [];
  }
};

/**
 * Get documents by course code
 */
export const getDocumentsByCourse = (courseCode: string) => {
  try {
    const documents = getAllCapsules();
    return documents.filter((doc: any) => 
      doc.courseCode && doc.courseCode.toLowerCase() === courseCode.toLowerCase()
    );
  } catch (error) {
    console.error("Error filtering documents by course:", error);
    return [];
  }
};

/**
 * Get documents by document type
 */
export const getDocumentsByType = (documentType: string) => {
  try {
    const documents = getAllCapsules();
    return documents.filter((doc: any) => 
      doc.documentType && doc.documentType === documentType
    );
  } catch (error) {
    console.error("Error filtering documents by type:", error);
    return [];
  }
};
