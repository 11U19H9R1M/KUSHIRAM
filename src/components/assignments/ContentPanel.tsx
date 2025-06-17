
import React, { useState, useEffect } from "react";
import { Assignment, AssignmentSubmission } from "@/lib/assignmentTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Download, Upload, FileText, Calendar, User, AlertTriangle, CheckCircle, Clock, Shield } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { 
  saveSubmission, 
  getStudentSubmissionForAssignment, 
  canUserSubmitToAssignment,
  getSubmissionsForAssignment
} from "@/lib/assignmentStorage";
import { getPlagiarismStatusColor, getPlagiarismStatusText } from "@/lib/plagiarismDetection";

interface ContentPanelProps {
  assignment: Assignment | null;
  isStudent?: boolean;
  onRefresh?: () => void;
  fullWidth?: boolean;
}

const ContentPanel = ({ assignment, isStudent = false, onRefresh, fullWidth = false }: ContentPanelProps) => {
  const { user } = useAuth();
  const [submissionFiles, setSubmissionFiles] = useState<FileList | null>(null);
  const [textSubmission, setTextSubmission] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentSubmission, setStudentSubmission] = useState<AssignmentSubmission | null>(null);
  const [allSubmissions, setAllSubmissions] = useState<AssignmentSubmission[]>([]);

  // Load student's existing submission and all submissions (for faculty)
  useEffect(() => {
    if (assignment && user) {
      if (isStudent) {
        const existing = getStudentSubmissionForAssignment(assignment.id, user.email);
        setStudentSubmission(existing);
        if (existing) {
          setTextSubmission(existing.textSubmission || "");
          setComments(existing.comments || "");
        }
      } else {
        // Load all submissions for faculty
        const submissions = getSubmissionsForAssignment(assignment.id);
        setAllSubmissions(submissions);
      }
    }
  }, [assignment, user, isStudent]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubmissionFiles(e.target.files);
  };

  const handleSubmission = async () => {
    if (!assignment || !user) return;

    if (!canUserSubmitToAssignment(assignment, user.email, user.role)) {
      toast.error("You cannot submit to this assignment");
      return;
    }

    if (assignment.submissionType === "file_upload" && (!submissionFiles || submissionFiles.length === 0)) {
      toast.error("Please select files to upload");
      return;
    }

    if (assignment.submissionType === "text_submission" && !textSubmission.trim()) {
      toast.error("Please enter your text submission");
      return;
    }

    if (assignment.submissionType === "both" && (!submissionFiles || submissionFiles.length === 0) && !textSubmission.trim()) {
      toast.error("Please provide either file upload or text submission");
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date();
      const dueDate = new Date(assignment.dueDate);
      const isLate = now > dueDate;

      const submission: AssignmentSubmission = {
        id: studentSubmission?.id || `submission-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        assignmentId: assignment.id,
        studentName: user.name || user.email,
        studentEmail: user.email,
        rollNumber: user.rollNumber || "N/A",
        submittedAt: now.toISOString(),
        files: [],
        status: isLate ? "late" : "submitted",
        textSubmission: textSubmission || undefined,
        comments: comments || undefined,
        isLateSubmission: isLate,
        submissionIpAddress: "127.0.0.1", // In real app, would get actual IP
      };

      const files = submissionFiles ? Array.from(submissionFiles) : [];
      const success = await saveSubmission(submission, files);

      if (success) {
        toast.success(isLate ? "Assignment submitted (late)" : "Assignment submitted successfully!");
        setStudentSubmission(submission);
        if (onRefresh) onRefresh();
      } else {
        toast.error("Failed to submit assignment");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast.error("Failed to submit assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!assignment) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[400px] text-center p-8 ${fullWidth ? "w-full" : ""}`}>
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Assignment Selected</h3>
        <p className="text-muted-foreground">
          {isStudent ? "Select an assignment to view details and submit your work" : "Select an assignment to view details and submissions"}
        </p>
      </div>
    );
  }

  const canSubmit = user && canUserSubmitToAssignment(assignment, user.email, user.role);
  const isOverdue = new Date() > new Date(assignment.dueDate);

  return (
    <div className={`space-y-6 ${fullWidth ? "w-full" : ""}`}>
      {/* Assignment Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-xl">{assignment.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{assignment.courseCode}</Badge>
                <Badge variant={assignment.difficulty === "easy" ? "default" : 
                              assignment.difficulty === "medium" ? "secondary" :
                              assignment.difficulty === "hard" ? "destructive" : "outline"}>
                  {assignment.difficulty}
                </Badge>
                {assignment.visibleToStudents ? (
                  <Badge variant="default">Live</Badge>
                ) : (
                  <Badge variant="outline">Draft</Badge>
                )}
              </div>
            </div>
            {isOverdue && (
              <Badge variant="destructive">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Overdue
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {assignment.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-muted-foreground">{assignment.description}</p>
            </div>
          )}
          
          {assignment.instructions && (
            <div>
              <h4 className="font-medium mb-2">Instructions</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{assignment.instructions}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Due Date</div>
                <div className="text-muted-foreground">{formatDate(assignment.dueDate)}</div>
              </div>
            </div>
            
            {assignment.uploadedAt && (
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Uploaded</div>
                  <div className="text-muted-foreground">{formatDate(assignment.uploadedAt)}</div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Created by</div>
                <div className="text-muted-foreground">{assignment.createdBy}</div>
              </div>
            </div>
          </div>
          
          {/* Assignment Files */}
          {assignment.files && assignment.files.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Assignment Files</h4>
              <div className="space-y-2">
                {assignment.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • Uploaded {formatDate(file.uploadedAt)}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={file.url} download={file.name}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isStudent ? (
        /* Student Submission Section */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {studentSubmission ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Your Submission
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  Submit Assignment
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {studentSubmission ? (
              /* Show existing submission */
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Submission Complete</div>
                      <div className="text-sm text-muted-foreground">
                        Submitted on {formatDate(studentSubmission.submittedAt)}
                        {studentSubmission.isLateSubmission && " (Late)"}
                      </div>
                    </div>
                  </div>
                  <Badge variant={studentSubmission.isLateSubmission ? "destructive" : "default"}>
                    {studentSubmission.status}
                  </Badge>
                </div>

                {/* Show plagiarism score if available */}
                {studentSubmission.plagiarismScore !== undefined && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span className="font-medium">Originality Check</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={getPlagiarismStatusColor(studentSubmission.plagiarismScore)}
                      >
                        {studentSubmission.plagiarismScore}% similarity
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Status: {getPlagiarismStatusText(studentSubmission.plagiarismScore)}
                    </div>
                  </div>
                )}

                {studentSubmission.files && studentSubmission.files.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2">Submitted Files</h5>
                    <div className="space-y-2">
                      {studentSubmission.files.map((file) => (
                        <div key={file.id} className="flex items-center gap-3 p-2 bg-muted rounded">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {studentSubmission.textSubmission && (
                  <div>
                    <h5 className="font-medium mb-2">Text Submission</h5>
                    <div className="p-3 bg-muted rounded text-sm">
                      {studentSubmission.textSubmission}
                    </div>
                  </div>
                )}
              </div>
            ) : canSubmit && !isOverdue ? (
              /* Show submission form */
              <div className="space-y-4">
                {(assignment.submissionType === "file_upload" || assignment.submissionType === "both") && (
                  <div>
                    <Label htmlFor="files">Upload Files (PDF only)</Label>
                    <Input
                      id="files"
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={handleFileChange}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload your completed assignment files (PDF format, max 10MB each)
                    </p>
                  </div>
                )}

                {(assignment.submissionType === "text_submission" || assignment.submissionType === "both") && (
                  <div>
                    <Label htmlFor="textSubmission">Text Submission</Label>
                    <Textarea
                      id="textSubmission"
                      placeholder="Enter your assignment text here..."
                      value={textSubmission}
                      onChange={(e) => setTextSubmission(e.target.value)}
                      rows={6}
                      className="mt-1"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="comments">Comments (Optional)</Label>
                  <Textarea
                    id="comments"
                    placeholder="Any additional comments or notes..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <Button 
                  onClick={handleSubmission} 
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Assignment
                    </>
                  )}
                </Button>
              </div>
            ) : (
              /* Cannot submit */
              <div className="text-center py-8">
                <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  {isOverdue ? "Assignment deadline has passed" : "Submission not available"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Faculty View - Show all submissions with plagiarism scores */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Submissions ({allSubmissions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allSubmissions.length > 0 ? (
              <div className="space-y-4">
                {allSubmissions.map((submission) => (
                  <div key={submission.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium">{submission.studentName}</div>
                        <div className="text-sm text-muted-foreground">{submission.studentEmail}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Submitted: {formatDate(submission.submittedAt)}
                          {submission.isLateSubmission && " (Late)"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={submission.isLateSubmission ? "destructive" : "default"}>
                          {submission.status}
                        </Badge>
                        {submission.plagiarismScore !== undefined && (
                          <Badge 
                            variant="outline"
                            className={getPlagiarismStatusColor(submission.plagiarismScore)}
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            {submission.plagiarismScore}% similarity
                          </Badge>
                        )}
                      </div>
                    </div>

                    {submission.files && submission.files.length > 0 && (
                      <div className="mb-3">
                        <div className="text-sm font-medium mb-1">Files:</div>
                        <div className="flex flex-wrap gap-2">
                          {submission.files.map((file) => (
                            <div key={file.id} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                              <FileText className="h-3 w-3" />
                              {file.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {submission.textSubmission && (
                      <div className="mb-3">
                        <div className="text-sm font-medium mb-1">Text Submission:</div>
                        <div className="text-sm bg-muted p-2 rounded max-h-20 overflow-y-auto">
                          {submission.textSubmission}
                        </div>
                      </div>
                    )}

                    {submission.plagiarismDetails && submission.plagiarismDetails.matches.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-sm font-medium mb-2 text-orange-600">
                          Potential Matches Found:
                        </div>
                        <div className="space-y-1">
                          {submission.plagiarismDetails.matches.slice(0, 3).map((match, index) => (
                            <div key={index} className="text-xs text-muted-foreground">
                              {match.similarity.toFixed(1)}% similarity with {match.studentEmail}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No submissions yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentPanel;
