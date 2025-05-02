
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
}
