
export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  createdBy: string; // faculty email
  createdAt: string;
  uploadedAt: string; // Auto-generated upload date
  dueDate: string;
  visibleToStudents: boolean;
  files?: AssignmentFile[]; // Support multiple files
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

export interface AssignmentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentName: string;
  studentEmail: string;
  rollNumber: string;
  submittedAt: string;
  files: SubmissionFile[];
  status: "submitted" | "reviewed" | "graded" | "plagiarism_flagged" | "late";
  feedback?: string;
  grade?: number;
  
  // Extended fields
  comments?: string; // Student submission comments
  originalityScore?: number; // AI-calculated originality percentage
  plagiarismScore?: number; // Plagiarism detection score (0-100)
  plagiarismDetails?: PlagiarismResult; // Detailed plagiarism analysis
  conceptMastery?: Record<string, number>; // Mastery level of concepts
  timeTaken?: number; // Time spent on assignment in minutes
  aiSuggestions?: string[]; // AI-generated feedback suggestions
  
  // New LMS fields
  textSubmission?: string; // For text-based submissions
  isLateSubmission?: boolean; // Track late submissions
  submissionIpAddress?: string; // For audit trail
  textContent?: string; // Extracted text from PDF files
}

export interface SubmissionFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  textContent?: string; // Extracted text content
}

export interface PlagiarismResult {
  score: number; // 0-100 percentage
  matches: PlagiarismMatch[];
  checkedAt: string;
  service: string; // e.g., "internal" or "copyleaks"
}

export interface PlagiarismMatch {
  submissionId: string;
  studentEmail: string;
  similarity: number;
  matchedText: string[];
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
