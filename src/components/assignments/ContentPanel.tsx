
import { useState } from "react";
import { Assignment, AssignmentSubmission } from "@/lib/assignmentTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  FileDown, 
  Upload, 
  Check, 
  Clock, 
  AlertCircle, 
  Eye,
  FileText,
  MessageSquare,
  Calendar,
  User
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { 
  saveSubmission, 
  getStudentSubmissionForAssignment, 
  canUserSubmitToAssignment 
} from "@/lib/assignmentStorage";

interface ContentPanelProps {
  assignment: Assignment | null;
  isStudent?: boolean;
  onRefresh?: () => void;
  fullWidth?: boolean;
}

const ContentPanel = ({ assignment, isStudent = false, onRefresh, fullWidth = false }: ContentPanelProps) => {
  const { user } = useAuth();
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mySubmission, setMySubmission] = useState<AssignmentSubmission | null>(null);
  
  // Submission form state
  const [submissionData, setSubmissionData] = useState({
    rollNumber: "",
    file: null as File | null,
    textSubmission: "",
    comments: ""
  });

  // Load student's existing submission
  React.useEffect(() => {
    if (assignment && user && isStudent) {
      const submission = getStudentSubmissionForAssignment(assignment.id, user.email);
      setMySubmission(submission);
    }
  }, [assignment, user, isStudent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubmissionData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSubmissionData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assignment || !user) {
      toast.error("Missing assignment or user information");
      return;
    }

    // Validate required fields
    if (!submissionData.rollNumber) {
      toast.error("Please enter your roll number");
      return;
    }

    if (assignment.submissionType === "file_upload" && !submissionData.file) {
      toast.error("Please upload a file");
      return;
    }

    if (assignment.submissionType === "text_submission" && !submissionData.textSubmission.trim()) {
      toast.error("Please enter your text submission");
      return;
    }

    if (assignment.submissionType === "both" && !submissionData.file && !submissionData.textSubmission.trim()) {
      toast.error("Please provide either a file upload or text submission");
      return;
    }

    // Validate roll number format
    const rollNumberRegex = /^[0-9]{2}r[0-9]{2}a[0-9]{4}$/i;
    if (!rollNumberRegex.test(submissionData.rollNumber)) {
      toast.error("Roll number must be in format: 22r21a0489");
      return;
    }

    // Check if past due
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const isLate = now > dueDate;

    setIsSubmitting(true);
    
    try {
      const submission: AssignmentSubmission = {
        id: `submission-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        assignmentId: assignment.id,
        studentName: user.name,
        studentEmail: user.email,
        rollNumber: submissionData.rollNumber,
        submittedAt: new Date().toISOString(),
        fileUrl: submissionData.file ? URL.createObjectURL(submissionData.file) : "",
        fileName: submissionData.file?.name || "",
        fileSize: submissionData.file?.size || 0,
        status: isLate ? "late" : "submitted",
        textSubmission: submissionData.textSubmission || undefined,
        comments: submissionData.comments || undefined,
        isLateSubmission: isLate,
        submissionIpAddress: "127.0.0.1" // In real app, get actual IP
      };
      
      const result = saveSubmission(submission);
      
      if (result) {
        toast.success(
          isLate 
            ? "Late submission recorded successfully" 
            : "Assignment submitted successfully"
        );
        setIsSubmissionDialogOpen(false);
        setMySubmission(submission);
        
        // Reset form
        setSubmissionData({
          rollNumber: "",
          file: null,
          textSubmission: "",
          comments: ""
        });
        
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const isPastDue = (dueDate: string) => {
    return new Date() > new Date(dueDate);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const canSubmit = assignment && user ? canUserSubmitToAssignment(assignment, user.email, user.role) : false;

  if (!assignment) {
    return (
      <div className={`flex items-center justify-center h-64 ${fullWidth ? "w-full" : ""}`}>
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No Assignment Selected</h3>
          <p className="text-muted-foreground">
            {isStudent ? "Select an assignment to view details and submit your work" : "Select an assignment to view student submissions and analytics"}
          </p>
        </div>
      </div>
    );
  }

  const daysUntilDue = getDaysUntilDue(assignment.dueDate);
  const isOverdue = daysUntilDue < 0;

  return (
    <div className={`space-y-6 ${fullWidth ? "w-full" : ""}`}>
      {/* Assignment Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-xl">{assignment.title}</CardTitle>
              <CardDescription className="mt-2">
                {assignment.description}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={assignment.visibleToStudents ? "default" : "secondary"}>
                {assignment.visibleToStudents ? "Active" : "Draft"}
              </Badge>
              {assignment.difficulty && (
                <Badge variant={assignment.difficulty === "easy" ? "default" : 
                              assignment.difficulty === "medium" ? "secondary" :
                              assignment.difficulty === "hard" ? "destructive" : "outline"}>
                  {assignment.difficulty}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Due Date</p>
                <p className={`text-sm ${isOverdue ? "text-red-600" : "text-muted-foreground"}`}>
                  {formatDate(assignment.dueDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Submission Type</p>
                <p className="text-sm text-muted-foreground">
                  {assignment.submissionType === "file_upload" ? "File Upload" :
                   assignment.submissionType === "text_submission" ? "Text Submission" :
                   "File & Text"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Course</p>
                <p className="text-sm text-muted-foreground">{assignment.courseCode}</p>
              </div>
            </div>
          </div>

          {/* Time Remaining */}
          {!isOverdue && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Time Remaining</span>
                <span className="text-sm text-muted-foreground">
                  {daysUntilDue === 0 ? "Due today" : `${daysUntilDue} day(s) left`}
                </span>
              </div>
              <Progress value={Math.max(0, Math.min(100, ((30 - daysUntilDue) / 30) * 100))} />
            </div>
          )}

          {isOverdue && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Assignment Overdue</span>
              </div>
              <p className="text-sm text-red-600 mt-1">
                This assignment was due {Math.abs(daysUntilDue)} day(s) ago
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      {assignment.instructions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{assignment.instructions}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Download */}
      {assignment.fileUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assignment Materials</CardTitle>
            <CardDescription>
              Download the assignment template and complete it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileDown className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium">{assignment.fileName || "Assignment Template"}</p>
                  <p className="text-sm text-muted-foreground">
                    {assignment.fileSize ? `${(assignment.fileSize / 1024 / 1024).toFixed(2)} MB` : "Template file"}
                  </p>
                </div>
              </div>
              <Button asChild>
                <a href={assignment.fileUrl} download target="_blank" rel="noopener noreferrer">
                  <FileDown className="h-4 w-4 mr-2" />
                  Download
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student Submission Section */}
      {isStudent && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Submission</CardTitle>
            <CardDescription>
              {mySubmission ? "You have submitted this assignment" : "Submit your completed work"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mySubmission ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Check className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Submitted Successfully</p>
                      <p className="text-sm text-green-600">
                        Submitted on {formatDate(mySubmission.submittedAt)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={mySubmission.isLateSubmission ? "destructive" : "default"}>
                    {mySubmission.isLateSubmission ? "Late" : "On Time"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Roll Number</Label>
                    <p className="text-sm text-muted-foreground">{mySubmission.rollNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge variant="outline" className="ml-2">
                      {mySubmission.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>

                {mySubmission.fileUrl && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Submitted File</Label>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{mySubmission.fileName}</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={mySubmission.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

                {mySubmission.textSubmission && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Text Submission</Label>
                    <div className="p-3 border rounded-lg bg-muted/20">
                      <p className="text-sm whitespace-pre-wrap">{mySubmission.textSubmission}</p>
                    </div>
                  </div>
                )}

                {mySubmission.comments && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Comments</Label>
                    <p className="text-sm text-muted-foreground">{mySubmission.comments}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                {canSubmit ? (
                  <>
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Ready to Submit?</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload your completed assignment file
                    </p>
                    <Button onClick={() => setIsSubmissionDialogOpen(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Assignment
                    </Button>
                  </>
                ) : (
                  <>
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Submission Not Available</h3>
                    <p className="text-muted-foreground">
                      {isOverdue ? "Assignment deadline has passed" : "Submission is not yet open"}
                    </p>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {assignment.tags && assignment.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Topics Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {assignment.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submission Dialog */}
      <Dialog open={isSubmissionDialogOpen} onOpenChange={setIsSubmissionDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              {assignment.title} - {assignment.courseCode}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitAssignment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number*</Label>
              <Input
                id="rollNumber"
                name="rollNumber"
                placeholder="e.g., 22r21a0489"
                value={submissionData.rollNumber}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter your roll number in the format: 22r21a0489
              </p>
            </div>
            
            {(assignment.submissionType === "file_upload" || assignment.submissionType === "both") && (
              <div className="space-y-2">
                <Label htmlFor="file">
                  Assignment File {assignment.submissionType === "file_upload" ? "*" : "(Optional)"}
                </Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileChange}
                  required={assignment.submissionType === "file_upload"}
                />
                <p className="text-xs text-muted-foreground">
                  Upload your completed assignment (PDF, DOC, or DOCX)
                </p>
              </div>
            )}

            {(assignment.submissionType === "text_submission" || assignment.submissionType === "both") && (
              <div className="space-y-2">
                <Label htmlFor="textSubmission">
                  Text Submission {assignment.submissionType === "text_submission" ? "*" : "(Optional)"}
                </Label>
                <Textarea
                  id="textSubmission"
                  name="textSubmission"
                  placeholder="Enter your assignment solution here..."
                  value={submissionData.textSubmission}
                  onChange={handleInputChange}
                  rows={6}
                  required={assignment.submissionType === "text_submission"}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="comments">Additional Comments (Optional)</Label>
              <Textarea
                id="comments"
                name="comments"
                placeholder="Any additional notes or comments..."
                value={submissionData.comments}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            {isOverdue && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Late Submission Warning</span>
                </div>
                <p className="text-sm text-amber-600 mt-1">
                  This assignment is overdue. Your submission will be marked as late.
                </p>
              </div>
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsSubmissionDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-foreground mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Assignment
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentPanel;
