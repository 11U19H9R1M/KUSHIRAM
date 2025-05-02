import { toast } from "sonner";
import { Assignment, AssignmentSubmission } from "./assignmentTypes";
import { getCurrentUserPrefix } from "./storage";

// Get shared prefix for cross-user access
const getSharedPrefix = (): string => {
  return "shared_"; 
};

// Save assignment data
export const saveAssignment = (assignmentData: Assignment): boolean => {
  try {
    // Ensure we have an ID for the assignment
    if (!assignmentData.id) {
      console.error("Cannot save assignment: Missing ID");
      return false;
    }
    
    const userPrefix = getCurrentUserPrefix();
    const sharedPrefix = getSharedPrefix();
    
    // Get existing assignments
    const existingData = localStorage.getItem(`${userPrefix}assignments`);
    const assignments = existingData ? JSON.parse(existingData) : [];
    
    console.log("Attempting to save assignment:", assignmentData.id);
    
    // Check if assignment with this ID already exists
    const existingIndex = assignments.findIndex((a: Assignment) => a.id === assignmentData.id);
    
    if (existingIndex !== -1) {
      console.log(`Updating existing assignment at index: ${existingIndex}`);
      assignments[existingIndex] = assignmentData;
    } else {
      console.log("Adding new assignment to collection");
      assignments.push(assignmentData);
    }
    
    // Save back to localStorage with user prefix
    localStorage.setItem(`${userPrefix}assignments`, JSON.stringify(assignments));
    
    // Also save to shared storage for students to access
    if (assignmentData.visibleToStudents) {
      saveToSharedAssignments(assignmentData);
    }
    
    console.log(`Assignment saved successfully with ID: ${assignmentData.id}`);
    
    return true;
  } catch (error) {
    console.error("Error saving assignment:", error);
    return false;
  }
};

// Helper function to save assignments to shared storage
const saveToSharedAssignments = (assignmentData: Assignment): boolean => {
  try {
    const sharedPrefix = getSharedPrefix();
    
    // Get existing assignments from shared storage
    const sharedData = localStorage.getItem(`${sharedPrefix}assignments`);
    const sharedAssignments = sharedData ? JSON.parse(sharedData) : [];
    
    // Check if assignment already exists in shared storage
    const existingIndex = sharedAssignments.findIndex((a: Assignment) => a.id === assignmentData.id);
    
    if (existingIndex !== -1) {
      // Update existing assignment
      sharedAssignments[existingIndex] = assignmentData;
    } else {
      // Add new assignment
      sharedAssignments.push(assignmentData);
    }
    
    // Save back to localStorage with shared prefix
    localStorage.setItem(`${sharedPrefix}assignments`, JSON.stringify(sharedAssignments));
    
    console.log(`Assignment also saved to shared storage with ID: ${assignmentData.id}`);
    
    return true;
  } catch (error) {
    console.error("Error saving assignment to shared storage:", error);
    return false;
  }
};

// Get all assignments (faculty sees all, students see only visible ones)
export const getAllAssignments = (isFaculty: boolean = false) => {
  try {
    const userPrefix = getCurrentUserPrefix();
    const sharedPrefix = getSharedPrefix();
    
    // Get user-specific assignments (for faculty)
    const userData = localStorage.getItem(`${userPrefix}assignments`);
    const userAssignments = userData ? JSON.parse(userData) : [];
    
    if (isFaculty) {
      return userAssignments;
    }
    
    // For students, get only visible assignments from shared storage
    const sharedData = localStorage.getItem(`${sharedPrefix}assignments`);
    const sharedAssignments = sharedData ? JSON.parse(sharedData) : [];
    
    // Students only see assignments marked as visible
    const visibleAssignments = sharedAssignments.filter((a: Assignment) => a.visibleToStudents);
    
    console.log(`Found ${visibleAssignments.length} visible assignments for students`);
    
    return visibleAssignments;
  } catch (error) {
    console.error("Error retrieving assignments:", error);
    toast.error("Failed to load assignments");
    return [];
  }
};

// Get assignment by ID
export const getAssignmentById = (id: string, isFaculty: boolean = false) => {
  try {
    const userPrefix = getCurrentUserPrefix();
    const sharedPrefix = getSharedPrefix();
    
    // For faculty, check user's own assignments first
    if (isFaculty) {
      const userData = localStorage.getItem(`${userPrefix}assignments`);
      const userAssignments = userData ? JSON.parse(userData) : [];
      
      const assignment = userAssignments.find((a: Assignment) => a.id === id);
      if (assignment) return assignment;
    }
    
    // For students or as fallback, check shared assignments
    const sharedData = localStorage.getItem(`${sharedPrefix}assignments`);
    const sharedAssignments = sharedData ? JSON.parse(sharedData) : [];
    
    const assignment = sharedAssignments.find((a: Assignment) => a.id === id);
    
    // Students can only see assignments marked as visible
    if (!isFaculty && assignment && !assignment.visibleToStudents) {
      return null;
    }
    
    return assignment || null;
  } catch (error) {
    console.error("Error retrieving assignment:", error);
    return null;
  }
};

// Delete assignment
export const deleteAssignment = (id: string): boolean => {
  try {
    const userPrefix = getCurrentUserPrefix();
    const sharedPrefix = getSharedPrefix();
    
    // Remove from faculty's storage
    const userData = localStorage.getItem(`${userPrefix}assignments`);
    const userAssignments = userData ? JSON.parse(userData) : [];
    const filteredAssignments = userAssignments.filter((a: Assignment) => a.id !== id);
    localStorage.setItem(`${userPrefix}assignments`, JSON.stringify(filteredAssignments));
    
    // Also remove from shared storage
    const sharedData = localStorage.getItem(`${sharedPrefix}assignments`);
    if (sharedData) {
      const sharedAssignments = JSON.parse(sharedData);
      const filteredShared = sharedAssignments.filter((a: Assignment) => a.id !== id);
      localStorage.setItem(`${sharedPrefix}assignments`, JSON.stringify(filteredShared));
    }
    
    // Remove all submissions for this assignment
    removeAllSubmissionsForAssignment(id);
    
    console.log(`Assignment with ID: ${id} deleted successfully`);
    return true;
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return false;
  }
};

// Update assignment visibility
export const updateAssignmentVisibility = (id: string, isVisible: boolean): boolean => {
  try {
    const assignment = getAssignmentById(id, true);
    
    if (!assignment) {
      console.error(`Assignment with ID: ${id} not found`);
      return false;
    }
    
    assignment.visibleToStudents = isVisible;
    
    // Update assignment
    const result = saveAssignment(assignment);
    
    if (result) {
      console.log(`Assignment visibility updated to ${isVisible}`);
    }
    
    return result;
  } catch (error) {
    console.error("Error updating assignment visibility:", error);
    return false;
  }
};

// Save assignment submission
export const saveSubmission = (submissionData: AssignmentSubmission): boolean => {
  try {
    // Ensure we have an ID for the submission
    if (!submissionData.id) {
      console.error("Cannot save submission: Missing ID");
      return false;
    }
    
    const userPrefix = getCurrentUserPrefix();
    const sharedPrefix = getSharedPrefix();
    
    // Get existing submissions
    const existingData = localStorage.getItem(`${userPrefix}submissions`);
    const submissions = existingData ? JSON.parse(existingData) : [];
    
    console.log("Attempting to save submission:", submissionData.id);
    
    // Check if submission with this ID already exists
    const existingIndex = submissions.findIndex((s: AssignmentSubmission) => s.id === submissionData.id);
    
    if (existingIndex !== -1) {
      console.log(`Updating existing submission at index: ${existingIndex}`);
      submissions[existingIndex] = submissionData;
    } else {
      console.log("Adding new submission to collection");
      submissions.push(submissionData);
    }
    
    // Save back to localStorage with user prefix (for student records)
    localStorage.setItem(`${userPrefix}submissions`, JSON.stringify(submissions));
    
    // Also save to shared storage for faculty to access
    saveToSharedSubmissions(submissionData);
    
    console.log(`Submission saved successfully with ID: ${submissionData.id}`);
    
    return true;
  } catch (error) {
    console.error("Error saving submission:", error);
    return false;
  }
};

// Helper function to save submissions to shared storage for faculty access
const saveToSharedSubmissions = (submissionData: AssignmentSubmission): boolean => {
  try {
    const sharedPrefix = getSharedPrefix();
    
    // Get existing submissions from shared storage
    const sharedData = localStorage.getItem(`${sharedPrefix}submissions`);
    const sharedSubmissions = sharedData ? JSON.parse(sharedData) : [];
    
    // Check if submission already exists in shared storage
    const existingIndex = sharedSubmissions.findIndex((s: AssignmentSubmission) => s.id === submissionData.id);
    
    if (existingIndex !== -1) {
      // Update existing submission
      sharedSubmissions[existingIndex] = submissionData;
    } else {
      // Add new submission
      sharedSubmissions.push(submissionData);
    }
    
    // Save back to localStorage with shared prefix
    localStorage.setItem(`${sharedPrefix}submissions`, JSON.stringify(sharedSubmissions));
    
    console.log(`Submission also saved to shared storage with ID: ${submissionData.id}`);
    
    return true;
  } catch (error) {
    console.error("Error saving submission to shared storage:", error);
    return false;
  }
};

// Get all submissions for a specific assignment
export const getSubmissionsForAssignment = (assignmentId: string) => {
  try {
    const sharedPrefix = getSharedPrefix();
    
    // Get all submissions from shared storage
    const sharedData = localStorage.getItem(`${sharedPrefix}submissions`);
    const sharedSubmissions = sharedData ? JSON.parse(sharedData) : [];
    
    // Filter submissions for the specified assignment
    const assignmentSubmissions = sharedSubmissions.filter(
      (s: AssignmentSubmission) => s.assignmentId === assignmentId
    );
    
    console.log(`Found ${assignmentSubmissions.length} submissions for assignment: ${assignmentId}`);
    
    return assignmentSubmissions;
  } catch (error) {
    console.error("Error retrieving submissions:", error);
    return [];
  }
};

// Get student's submission for a specific assignment
export const getStudentSubmissionForAssignment = (assignmentId: string, studentEmail: string) => {
  try {
    const userPrefix = getCurrentUserPrefix();
    
    // Get student's submissions
    const userData = localStorage.getItem(`${userPrefix}submissions`);
    const userSubmissions = userData ? JSON.parse(userData) : [];
    
    // Find submission for specific assignment
    const submission = userSubmissions.find(
      (s: AssignmentSubmission) => s.assignmentId === assignmentId && s.studentEmail === studentEmail
    );
    
    return submission || null;
  } catch (error) {
    console.error("Error retrieving student submission:", error);
    return null;
  }
};

// Update submission status (for faculty review/grading)
export const updateSubmissionStatus = (
  submissionId: string, 
  status: "reviewed" | "graded" | "plagiarism_flagged",
  feedback?: string,
  grade?: number
): boolean => {
  try {
    const sharedPrefix = getSharedPrefix();
    
    // Get all submissions from shared storage
    const sharedData = localStorage.getItem(`${sharedPrefix}submissions`);
    if (!sharedData) return false;
    
    const sharedSubmissions = JSON.parse(sharedData);
    
    // Find submission by ID
    const index = sharedSubmissions.findIndex((s: AssignmentSubmission) => s.id === submissionId);
    
    if (index === -1) {
      console.error(`Submission with ID: ${submissionId} not found`);
      return false;
    }
    
    // Update submission
    sharedSubmissions[index] = {
      ...sharedSubmissions[index],
      status,
      ...(feedback !== undefined && { feedback }),
      ...(grade !== undefined && { grade })
    };
    
    // Save back to shared storage
    localStorage.setItem(`${sharedPrefix}submissions`, JSON.stringify(sharedSubmissions));
    
    // Also update in student's storage if possible
    updateStudentSubmission(sharedSubmissions[index]);
    
    console.log(`Submission status updated to ${status}`);
    return true;
  } catch (error) {
    console.error("Error updating submission status:", error);
    return false;
  }
};

// Helper to update submission in student's storage
const updateStudentSubmission = (submission: AssignmentSubmission): void => {
  try {
    // In a real app with backend, we'd use the student's ID to update their storage
    // For this demo, we'll just ensure the shared storage is updated
    console.log("Student submission would be updated in their storage");
  } catch (error) {
    console.error("Error updating student submission:", error);
  }
};

// Remove all submissions for an assignment (when deleting an assignment)
const removeAllSubmissionsForAssignment = (assignmentId: string): void => {
  try {
    const sharedPrefix = getSharedPrefix();
    
    // Get all submissions from shared storage
    const sharedData = localStorage.getItem(`${sharedPrefix}submissions`);
    if (!sharedData) return;
    
    const sharedSubmissions = JSON.parse(sharedData);
    
    // Filter out submissions for the specified assignment
    const filteredSubmissions = sharedSubmissions.filter(
      (s: AssignmentSubmission) => s.assignmentId !== assignmentId
    );
    
    // Save filtered submissions back to shared storage
    localStorage.setItem(`${sharedPrefix}submissions`, JSON.stringify(filteredSubmissions));
    
    console.log(`Removed all submissions for assignment: ${assignmentId}`);
  } catch (error) {
    console.error("Error removing submissions:", error);
  }
};

// Basic plagiarism check (note: in a real app, this would be server-side)
export const checkPlagiarism = (fileContent: string, assignmentId: string): boolean => {
  // In a real app, this would be a complex server-side process
  // For this demo, we'll just implement a simple placeholder
  
  try {
    // Get existing submissions for this assignment
    const submissions = getSubmissionsForAssignment(assignmentId);
    
    // In a real implementation, we would compare file contents
    // Here we'll just assume no plagiarism for the demo
    console.log("Performed simple plagiarism check (mock implementation)");
    
    return false; // false means no plagiarism detected
  } catch (error) {
    console.error("Error in plagiarism check:", error);
    return false;
  }
};
