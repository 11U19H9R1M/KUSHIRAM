
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
    
    // Log success message for debugging
    console.log(`Document saved successfully with ID: ${documentData.id}`);
    
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
    
    // If no data exists in the 'academicDocuments' key
    if (!data) {
      console.log("No documents found in 'academicDocuments'");
      
      // Try the old format for backward compatibility
      const oldData = localStorage.getItem('timeCapsules');
      if (oldData) {
        console.log("Found documents in 'timeCapsules'");
        return JSON.parse(oldData);
      }
      
      console.log("No documents found at all");
      return [];
    }
    
    const parsedData = JSON.parse(data);
    console.log(`Found ${parsedData.length} documents in storage`);
    return parsedData;
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
    const document = documents.find((doc: any) => doc.id === id);
    
    if (document) {
      console.log(`Found document with ID: ${id}`);
    } else {
      console.log(`No document found with ID: ${id}`);
    }
    
    return document || null;
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
    console.log(`Document with ID: ${id} deleted successfully`);
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
  
  const isUnlockable = now >= unlockDate;
  console.log(`Document unlock check: Current time: ${now.toISOString()}, Unlock date: ${unlockDate.toISOString()}, Is unlockable: ${isUnlockable}`);
  
  return isUnlockable;
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

// Debug function to help troubleshoot localStorage issues
export const debugStorage = () => {
  try {
    console.log("--- Storage Debug Information ---");
    
    // Log all localStorage keys
    console.log("All localStorage keys:");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      console.log(`- ${key}`);
    }
    
    // Check academicDocuments specifically
    const academicDocs = localStorage.getItem('academicDocuments');
    console.log("academicDocuments:", academicDocs ? JSON.parse(academicDocs).length + " items" : "null");
    
    // Check timeCapsules for backward compatibility
    const timeCapsules = localStorage.getItem('timeCapsules');
    console.log("timeCapsules:", timeCapsules ? JSON.parse(timeCapsules).length + " items" : "null");
    
    console.log("--- End Debug Information ---");
    
    return {
      academicDocuments: academicDocs ? JSON.parse(academicDocs) : null,
      timeCapsules: timeCapsules ? JSON.parse(timeCapsules) : null,
      allKeys: Object.keys(localStorage)
    };
  } catch (error) {
    console.error("Error during storage debugging:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
};
