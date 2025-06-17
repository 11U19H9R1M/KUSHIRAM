
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Calendar, FileUp, FileDown, Search, Eye, Check, X, Upload, Download } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Assignment, AssignmentSubmission } from "@/lib/assignmentTypes";
import { getAllAssignments, saveSubmission, getStudentSubmissionForAssignment } from "@/lib/assignmentStorage";

const StudentAssignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    rollNumber: "",
    files: [] as File[]
  });
  const [mySubmissions, setMySubmissions] = useState<Record<string, AssignmentSubmission>>({});

  // Ensure user is student
  useEffect(() => {
    if (user && user.role !== "student") {
      toast.error("You don't have permission to access this page");
    }
  }, [user]);

  // Load assignments
  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    setIsLoading(true);
    try {
      // Get visible assignments for student
      const allAssignments = getAllAssignments(false);
      setAssignments(allAssignments);
      
      // Load student's submissions for these assignments
      if (user) {
        const submissions: Record<string, AssignmentSubmission> = {};
        
        for (const assignment of allAssignments) {
          const submission = getStudentSubmissionForAssignment(assignment.id, user.email);
          if (submission) {
            submissions[assignment.id] = submission;
          }
        }
        
        setMySubmissions(submissions);
      }
      
      console.log(`Loaded ${allAssignments.length} assignments for students`);
    } catch (error) {
      console.error("Error loading assignments:", error);
      toast.error("Failed to load assignments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubmissionData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSubmissionData(prev => ({ ...prev, files: newFiles }));
    }
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!submissionData.rollNumber || submissionData.files.length === 0 || !selectedAssignment || !user) {
      toast.error("Please fill all required fields and select files");
      return;
    }
    
    // Validate roll number format
    const rollNumberRegex = /^[0-9]{2}r[0-9]{2}a[0-9]{4}$/i;
    if (!rollNumberRegex.test(submissionData.rollNumber)) {
      toast.error("Roll number must be in format: 22r21a0489");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create submission object
      const submission: AssignmentSubmission = {
        id: `submission-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        assignmentId: selectedAssignment.id,
        studentName: user.name,
        studentEmail: user.email,
        rollNumber: submissionData.rollNumber,
        submittedAt: new Date().toISOString(),
        files: [], // Will be populated by saveSubmission
        status: "submitted"
      };
      
      // Save submission with files
      const result = await saveSubmission(submission, submissionData.files);
      
      if (result) {
        toast.success("Assignment submitted successfully");
        setIsSubmissionDialogOpen(false);
        
        // Update my submissions
        setMySubmissions(prev => ({
          ...prev,
          [selectedAssignment.id]: submission
        }));
        
        // Reset form
        setSubmissionData({
          rollNumber: "",
          files: []
        });
        
        // Reload assignments to update submission counts
        loadAssignments();
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

  const openSubmissionDialog = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsSubmissionDialogOpen(true);
  };

  // Filter assignments based on search query
  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if assignment is past due
  const isPastDue = (dueDate: string) => {
    return new Date() > new Date(dueDate);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Student Assignments</h1>
          <p className="text-muted-foreground mt-1">
            View assignment PDFs and submit your solutions
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-muted rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-9 bg-muted rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAssignments.map(assignment => (
              <Card key={assignment.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{assignment.title}</CardTitle>
                      <CardDescription>{assignment.courseCode}</CardDescription>
                    </div>
                    
                    {mySubmissions[assignment.id] && (
                      <div className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Submitted
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm mb-2 line-clamp-2">
                      {assignment.description || "No description provided"}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      {isPastDue(assignment.dueDate) ? (
                        <span className="text-destructive">Past Due: {formatDate(assignment.dueDate)}</span>
                      ) : (
                        <span>Due: {formatDate(assignment.dueDate)}</span>
                      )}
                    </div>
                    
                    {/* Show uploaded files from faculty */}
                    {assignment.files && assignment.files.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Assignment Files:</p>
                        <div className="space-y-1">
                          {assignment.files.map((file, index) => (
                            <div key={file.id} className="flex items-center justify-between text-xs bg-muted/50 p-2 rounded">
                              <span className="truncate">{file.name}</span>
                              <Button variant="ghost" size="sm" asChild className="h-6 px-2">
                                <a href={file.url} target="_blank" rel="noopener noreferrer">
                                  <Download className="h-3 w-3" />
                                </a>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  {mySubmissions[assignment.id] ? (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="flex-1"
                      disabled
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Submitted
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => openSubmissionDialog(assignment)}
                      disabled={isPastDue(assignment.dueDate)}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Submit Answer
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-lg">
            <FileDown className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No assignments found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 
                `No assignments match your search for "${searchQuery}"` : 
                "There are no assignments available for you right now"}
            </p>
          </div>
        )}
        
        {/* Submission Dialog */}
        <Dialog open={isSubmissionDialogOpen} onOpenChange={setIsSubmissionDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Submit Assignment</DialogTitle>
              <DialogDescription>
                {selectedAssignment?.title} - {selectedAssignment?.courseCode}
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
              
              <div className="space-y-2">
                <Label htmlFor="file">Answer Files (PDF)*</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  multiple
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Upload your assignment solutions as PDF files
                </p>
                
                {/* Show selected files */}
                {submissionData.files.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-1">Selected Files:</p>
                    <div className="space-y-1">
                      {submissionData.files.map((file, index) => (
                        <div key={index} className="text-xs text-muted-foreground bg-muted p-2 rounded">
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
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
    </DashboardLayout>
  );
};

export default StudentAssignments;
