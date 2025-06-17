import { Assignment, AssignmentSubmission, AssignmentNotification } from "./assignmentTypes";
import { checkPlagiarism, extractTextFromPDF } from "./plagiarismDetection";

const ASSIGNMENTS_KEY = "lms_assignments";
const SUBMISSIONS_KEY = "lms_submissions";
const NOTIFICATIONS_KEY = "lms_notifications";

// Utility function to get current date in proper timezone
const getCurrentDateTime = (): string => {
  return new Date().toISOString();
};

// Utility function to validate date (allows today and future dates)
export const isValidDueDate = (dateString: string): boolean => {
  const dueDate = new Date(dateString);
  const now = new Date();
  
  // Set time to start of day for comparison to allow same day
  const dueDateDay = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return dueDateDay >= nowDay;
};

// Get all assignments based on user role
export const getAllAssignments = (isFaculty: boolean = false): Assignment[] => {
  try {
    const stored = localStorage.getItem(ASSIGNMENTS_KEY);
    const assignments: Assignment[] = stored ? JSON.parse(stored) : [];
    
    if (isFaculty) {
      // Faculty can see all assignments
      console.log(`Found ${assignments.length} total assignments for faculty`);
      return assignments;
    } else {
      // Students can only see visible assignments
      const visibleAssignments = assignments.filter(assignment => assignment.visibleToStudents);
      console.log(`Found ${visibleAssignments.length} visible assignments for students`);
      return visibleAssignments;
    }
  } catch (error) {
    console.error("Error loading assignments:", error);
    return [];
  }
};

// Get assignment by ID
export const getAssignmentById = (id: string): Assignment | null => {
  try {
    const assignments = getAllAssignments(true); // Get all assignments
    return assignments.find(assignment => assignment.id === id) || null;
  } catch (error) {
    console.error("Error getting assignment by ID:", error);
    return null;
  }
};

// Save assignment (faculty only)
export const saveAssignment = (assignment: Assignment): boolean => {
  try {
    const assignments = getAllAssignments(true);
    const existingIndex = assignments.findIndex(a => a.id === assignment.id);
    
    // Auto-generate upload date if not provided
    if (!assignment.uploadedAt) {
      assignment.uploadedAt = getCurrentDateTime();
    }
    
    if (existingIndex >= 0) {
      assignments[existingIndex] = assignment;
    } else {
      assignments.push(assignment);
      
      // Send notifications to students if assignment is visible
      if (assignment.visibleToStudents) {
        sendAssignmentNotificationToStudents(assignment);
      }
    }
    
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
    console.log(`Assignment saved: ${assignment.title}`);
    return true;
  } catch (error) {
    console.error("Error saving assignment:", error);
    return false;
  }
};

// Delete assignment (faculty only)
export const deleteAssignment = (id: string): boolean => {
  try {
    const assignments = getAllAssignments(true);
    const filteredAssignments = assignments.filter(assignment => assignment.id !== id);
    
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(filteredAssignments));
    console.log(`Assignment deleted: ${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return false;
  }
};

// Update assignment visibility
export const updateAssignmentVisibility = (id: string, visible: boolean): boolean => {
  try {
    const assignments = getAllAssignments(true);
    const assignmentIndex = assignments.findIndex(a => a.id === id);
    
    if (assignmentIndex >= 0) {
      assignments[assignmentIndex].visibleToStudents = visible;
      
      // Send notifications when making visible
      if (visible && !assignments[assignmentIndex].notificationSent) {
        sendAssignmentNotificationToStudents(assignments[assignmentIndex]);
        assignments[assignmentIndex].notificationSent = true;
      }
      
      localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
      console.log(`Assignment visibility updated: ${id} -> ${visible}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating assignment visibility:", error);
    return false;
  }
};

// Save submission (students only) with plagiarism check
export const saveSubmission = async (submission: AssignmentSubmission, files: File[]): Promise<boolean> => {
  try {
    // Extract text content from PDF files
    let combinedTextContent = "";
    const processedFiles = [];
    
    for (const file of files) {
      if (file.type === "application/pdf") {
        const textContent = await extractTextFromPDF(file);
        combinedTextContent += textContent + " ";
        
        processedFiles.push({
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          textContent
        });
      } else {
        processedFiles.push({
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file)
        });
      }
    }
    
    // Update submission with processed files and text content
    submission.files = processedFiles;
    submission.textContent = combinedTextContent.trim();
    
    const submissions = getAllSubmissions();
    
    // Check if student has already submitted for this assignment
    const existingIndex = submissions.findIndex(
      s => s.assignmentId === submission.assignmentId && s.studentEmail === submission.studentEmail
    );
    
    // Get existing submissions for plagiarism check
    const existingSubmissions = submissions.filter(s => 
      s.assignmentId === submission.assignmentId && 
      s.studentEmail !== submission.studentEmail
    );
    
    // Run plagiarism check
    if (submission.textContent) {
      const plagiarismResult = await checkPlagiarism(submission, existingSubmissions);
      submission.plagiarismScore = plagiarismResult.score;
      submission.plagiarismDetails = plagiarismResult;
      
      // Auto-flag if high plagiarism
      if (plagiarismResult.score >= 70) {
        submission.status = "plagiarism_flagged";
      }
    }
    
    if (existingIndex >= 0) {
      // Update existing submission
      submissions[existingIndex] = submission;
      console.log(`Submission updated for assignment: ${submission.assignmentId}`);
    } else {
      // Add new submission
      submissions.push(submission);
      console.log(`New submission saved for assignment: ${submission.assignmentId}`);
    }
    
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
    
    // Update assignment submission count
    updateAssignmentSubmissionCount(submission.assignmentId);
    
    return true;
  } catch (error) {
    console.error("Error saving submission:", error);
    return false;
  }
};

// Get all submissions
export const getAllSubmissions = (): AssignmentSubmission[] => {
  try {
    const stored = localStorage.getItem(SUBMISSIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading submissions:", error);
    return [];
  }
};

// Get submissions for a specific assignment
export const getSubmissionsForAssignment = (assignmentId: string): AssignmentSubmission[] => {
  try {
    const submissions = getAllSubmissions();
    return submissions.filter(submission => submission.assignmentId === assignmentId);
  } catch (error) {
    console.error("Error getting submissions for assignment:", error);
    return [];
  }
};

// Get student's submission for specific assignment
export const getStudentSubmissionForAssignment = (assignmentId: string, studentEmail: string): AssignmentSubmission | null => {
  try {
    const submissions = getAllSubmissions();
    return submissions.find(
      submission => submission.assignmentId === assignmentId && submission.studentEmail === studentEmail
    ) || null;
  } catch (error) {
    console.error("Error getting student submission:", error);
    return null;
  }
};

// Update submission status (faculty only)
export const updateSubmissionStatus = (submissionId: string, status: AssignmentSubmission["status"]): boolean => {
  try {
    const submissions = getAllSubmissions();
    const submissionIndex = submissions.findIndex(s => s.id === submissionId);
    
    if (submissionIndex >= 0) {
      submissions[submissionIndex].status = status;
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
      console.log(`Submission status updated: ${submissionId} -> ${status}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating submission status:", error);
    return false;
  }
};

// Check if user can submit to assignment (role-based permission)
export const canUserSubmitToAssignment = (assignment: Assignment, userEmail: string, userRole: string): boolean => {
  // Faculty cannot submit to their own assignments
  if (userRole === "faculty" && assignment.createdBy === userEmail) {
    return false;
  }
  
  // Students can submit if assignment is visible and not past due
  if (userRole === "student") {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    return assignment.visibleToStudents && now <= dueDate;
  }
  
  // Admin can submit for testing purposes
  if (userRole === "admin") {
    return assignment.visibleToStudents;
  }
  
  return false;
};

// Send notification to students (simulated)
const sendAssignmentNotificationToStudents = (assignment: Assignment): void => {
  try {
    // In a real application, this would send actual emails
    // For now, we'll simulate by creating notification records
    
    const notifications = getNotifications();
    const studentEmails = [
      "student@example.com",
      "alice@student.edu", 
      "bob@student.edu"
    ]; // In real app, this would come from enrollment data
    
    studentEmails.forEach(email => {
      const notification: AssignmentNotification = {
        id: `notification-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        assignmentId: assignment.id,
        studentEmail: email,
        sentAt: new Date().toISOString(),
        type: "new_assignment",
        read: false
      };
      
      notifications.push(notification);
    });
    
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    console.log(`Notifications sent for assignment: ${assignment.title}`);
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};

// Get notifications for a user
export const getNotifications = (userEmail?: string): AssignmentNotification[] => {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    const allNotifications: AssignmentNotification[] = stored ? JSON.parse(stored) : [];
    
    if (userEmail) {
      return allNotifications.filter(notification => notification.studentEmail === userEmail);
    }
    
    return allNotifications;
  } catch (error) {
    console.error("Error getting notifications:", error);
    return [];
  }
};

// Mark notification as read
export const markNotificationAsRead = (notificationId: string): boolean => {
  try {
    const notifications = getNotifications();
    const notificationIndex = notifications.findIndex(n => n.id === notificationId);
    
    if (notificationIndex >= 0) {
      notifications[notificationIndex].read = true;
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
};

// Update assignment submission count
const updateAssignmentSubmissionCount = (assignmentId: string): void => {
  try {
    const assignments = getAllAssignments(true);
    const assignmentIndex = assignments.findIndex(a => a.id === assignmentId);
    
    if (assignmentIndex >= 0) {
      const submissionCount = getSubmissionsForAssignment(assignmentId).length;
      assignments[assignmentIndex].totalSubmissions = submissionCount;
      localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
    }
  } catch (error) {
    console.error("Error updating submission count:", error);
  }
};

// Get assignments with submission stats for faculty
export const getAssignmentsWithStats = (facultyEmail: string): Assignment[] => {
  try {
    const assignments = getAllAssignments(true);
    const facultyAssignments = assignments.filter(a => a.createdBy === facultyEmail);
    
    return facultyAssignments.map(assignment => ({
      ...assignment,
      totalSubmissions: getSubmissionsForAssignment(assignment.id).length
    }));
  } catch (error) {
    console.error("Error getting assignments with stats:", error);
    return [];
  }
};
