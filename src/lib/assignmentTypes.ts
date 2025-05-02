
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
  
  // Extended fields for AI features
  difficulty?: "easy" | "medium" | "hard" | "advanced";
  tags?: string[];
  scheduledPublish?: string; // ISO date string for scheduled visibility
  aiScore?: number; // AI-calculated complexity score
  conceptGraph?: Record<string, number>; // Concept coverage mapping
  recommendedTime?: number; // in minutes
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
  status: "submitted" | "reviewed" | "graded" | "plagiarism_flagged";
  feedback?: string;
  grade?: number;
  
  // Extended fields
  comments?: string; // Student submission comments
  originalityScore?: number; // AI-calculated originality percentage
  conceptMastery?: Record<string, number>; // Mastery level of concepts
  timeTaken?: number; // Time spent on assignment in minutes
  aiSuggestions?: string[]; // AI-generated feedback suggestions
}
