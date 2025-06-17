
export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  createdBy: string; // faculty email
  createdAt: string;
  dueDate: string;
  visibleToStudents: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  allowedFormats?: string[]; // e.g. ["pdf", "docx"]
  maxFileSize?: number; // in bytes
  
  // Extended fields for LMS features
  difficulty?: "easy" | "medium" | "hard" | "advanced";
  tags?: string[];
  scheduledPublish?: string; // ISO date string for scheduled visibility
  aiScore?: number; // AI-calculated complexity score
  conceptGraph?: Record<string, number>; // Concept coverage mapping
  recommendedTime?: number; // in minutes
  
  // New LMS fields
  instructions?: string; // Detailed instructions for students
  submissionType: "file_upload" | "text_submission" | "both";
  notificationSent?: boolean; // Track if notification was sent to students
  totalSubmissions?: number; // Cache submission count
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentName: string;
  studentEmail: string;
  rollNumber: string;
  submittedAt: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  status: "submitted" | "reviewed" | "graded" | "plagiarism_flagged" | "late";
  feedback?: string;
  grade?: number;
  
  // Extended fields
  comments?: string; // Student submission comments
  originalityScore?: number; // AI-calculated originality percentage
  conceptMastery?: Record<string, number>; // Mastery level of concepts
  timeTaken?: number; // Time spent on assignment in minutes
  aiSuggestions?: string[]; // AI-generated feedback suggestions
  
  // New LMS fields
  textSubmission?: string; // For text-based submissions
  isLateSubmission?: boolean; // Track late submissions
  submissionIpAddress?: string; // For audit trail
}

// Notification interface for student alerts
export interface AssignmentNotification {
  id: string;
  assignmentId: string;
  studentEmail: string;
  sentAt: string;
  type: "new_assignment" | "deadline_reminder" | "grade_released";
  read: boolean;
}
