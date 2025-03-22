import { toast } from "sonner";

/**
 * Save document data to localStorage
 */
export const saveCapsule = (documentData: any): boolean => {
  try {
    // Ensure we have an ID for the document
    if (!documentData.id) {
      console.error("Cannot save document: Missing ID");
      return false;
    }
    
    // Get existing documents - standardize on academicDocuments key
    const existingData = localStorage.getItem('academicDocuments');
    const documents = existingData ? JSON.parse(existingData) : [];
    
    // Log the document data we're attempting to save
    console.log("Attempting to save document:", documentData.id);
    
    // Process document images and ensure they are properly stored
    if (documentData.mediaFiles && documentData.mediaFiles.length > 0) {
      console.log(`Document has ${documentData.mediaFiles.length} media files`);
      
      // Ensure each media file has the correct properties
      documentData.mediaFiles = documentData.mediaFiles.map((file: any, index: number) => {
        console.log(`Processing media file ${index}: ${file.name || 'unnamed'}, type: ${file.type || 'unknown'}`);
        
        // If file doesn't have a proper type, try to infer it
        if (!file.type || file.type === 'unknown') {
          const name = file.name || '';
          if (name.endsWith('.pdf')) file.type = 'pdf';
          else if (name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) file.type = 'image';
          else if (name.match(/\.(mp4|webm|mov)$/i)) file.type = 'video';
          else file.type = 'document';
          
          console.log(`Inferred type for file: ${file.type}`);
        }
        
        return file;
      });
    }
    
    // Check if document with this ID already exists
    const existingIndex = documents.findIndex((c: any) => c.id === documentData.id);
    
    if (existingIndex !== -1) {
      console.log(`Updating existing document at index: ${existingIndex}`);
      // Update existing document
      documents[existingIndex] = documentData;
    } else {
      console.log("Adding new document to collection");
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
    // First try to get from academicDocuments (standard key)
    const data = localStorage.getItem('academicDocuments');
    
    // If no data exists in the 'academicDocuments' key
    if (!data) {
      console.log("No documents found in 'academicDocuments'");
      
      // Try the old format for backward compatibility
      const oldData = localStorage.getItem('timeCapsules');
      if (oldData) {
        console.log("Found documents in 'timeCapsules', migrating to 'academicDocuments'");
        // Migrate data to new key
        localStorage.setItem('academicDocuments', oldData);
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

/**
 * Load dashboard capsules from localStorage
 */
export const loadDashboardCapsules = () => {
  try {
    const capsules = getAllCapsules();
    return capsules.map((capsule: any) => ({
      ...capsule,
      createdAt: new Date(capsule.createdAt),
      unlockDate: new Date(capsule.unlockDate)
    }));
  } catch (error) {
    console.error("Error loading dashboard capsules:", error);
    return [];
  }
};

/**
 * Debug function to help troubleshoot localStorage issues
 */
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
    
    // If we have data in timeCapsules but not in academicDocuments, migrate it
    if (timeCapsules && !academicDocs) {
      console.log("Migrating data from timeCapsules to academicDocuments");
      localStorage.setItem('academicDocuments', timeCapsules);
    }
    
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

