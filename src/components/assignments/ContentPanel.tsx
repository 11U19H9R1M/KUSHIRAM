
import { useState } from "react";
import { Assignment } from "@/lib/assignmentTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, FileText, Upload, Eye, MessageSquare, Edit } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { saveSubmission } from "@/lib/assignmentStorage";
import { AssignmentSubmission } from "@/lib/assignmentTypes";

interface ContentPanelProps {
  assignment: Assignment | null;
  isStudent: boolean;
  onRefresh: () => void;
  fullWidth?: boolean;
}

const ContentPanel = ({
  assignment,
  isStudent,
  onRefresh,
  fullWidth = false
}: ContentPanelProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("view");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false);
  
  // Student submission form
  const [submissionData, setSubmissionData] = useState({
    rollNumber: "",
    file: null as File | null,
    comments: ""
  });
  
  // Comments/discussion
  const [comments, setComments] = useState<Array<{id: string, user: string, text: string, timestamp: string}>>([]);
  const [newComment, setNewComment] = useState("");
  
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
    
    if (!assignment || !submissionData.rollNumber || !submissionData.file || !user) {
      toast.error("Please fill all required fields");
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
        assignmentId: assignment.id,
        studentName: user.name,
        studentEmail: user.email,
        rollNumber: submissionData.rollNumber,
        submittedAt: new Date().toISOString(),
        fileUrl: URL.createObjectURL(submissionData.file),
        fileName: submissionData.file.name,
        fileSize: submissionData.file.size,
        status: "submitted",
        // Additional fields for comments
        comments: submissionData.comments || ""
      };
      
      // Save submission
      const result = saveSubmission(submission);
      
      if (result) {
        toast.success("Assignment submitted successfully");
        setIsSubmissionDialogOpen(false);
        onRefresh(); // Refresh assignments to update status
        
        // Reset form
        setSubmissionData({
          rollNumber: "",
          file: null,
          comments: ""
        });
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
  
  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;
    
    const comment = {
      id: `comment-${Date.now()}`,
      user: user.name,
      text: newComment.trim(),
      timestamp: new Date().toISOString()
    };
    
    setComments(prev => [...prev, comment]);
    setNewComment("");
    toast.success("Comment added to discussion");
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  
  // If no assignment is selected
  if (!assignment) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[200px] bg-muted/20 rounded-lg ${fullWidth ? "w-full" : ""}`}>
        <FileText className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Select an assignment to view</p>
      </div>
    );
  }
  
  // Show appropriate content based on student/faculty role
  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="view">Content</TabsTrigger>
          <TabsTrigger value="discuss">Discuss</TabsTrigger>
          <TabsTrigger value="submit">Submit</TabsTrigger>
        </TabsList>
        
        {/* Content Tab - PDF Viewer */}
        <TabsContent value="view" className="mt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">{assignment.title}</h3>
              <div className="bg-muted px-2 py-1 rounded text-xs">
                {assignment.courseCode}
              </div>
            </div>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base flex justify-between items-center">
                  <span>Assignment Details</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    Due: {formatDate(assignment.dueDate)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-sm mb-4">
                  {assignment.description || "No detailed description provided."}
                </p>
                
                {/* PDF Viewer (iframe or embed) */}
                <div className="border rounded-md overflow-hidden h-[400px] bg-muted/20">
                  {assignment.fileUrl && (
                    <iframe 
                      src={assignment.fileUrl} 
                      width="100%" 
                      height="100%" 
                      title={assignment.title}
                      className="border-0"
                    />
                  )}
                </div>
              </CardContent>
              <CardFooter className="py-3 flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4 mr-1" /> View Full Screen
                  </a>
                </Button>
                
                {isStudent && (
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setActiveTab("submit");
                      setIsSubmissionDialogOpen(true);
                    }}
                  >
                    <Upload className="h-4 w-4 mr-1" /> Submit Work
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Discussion Tab */}
        <TabsContent value="discuss" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Peer Discussion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Comments list */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto p-2">
                  {comments.length > 0 ? (
                    comments.map(comment => (
                      <div key={comment.id} className="bg-muted/20 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-sm">{comment.user}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No comments yet. Start the discussion!</p>
                    </div>
                  )}
                </div>
                
                {/* Add comment form */}
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Add a comment or question..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                  <Button 
                    className="self-end" 
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Submit Tab */}
        <TabsContent value="submit" className="mt-4">
          {isStudent ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Submit Your Work</CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog open={isSubmissionDialogOpen} onOpenChange={setIsSubmissionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Open Submission Form
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
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
                      
                      <div className="space-y-2">
                        <Label htmlFor="file">Assignment File (PDF)*</Label>
                        <Input
                          id="file"
                          name="file"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Upload your completed assignment as a PDF
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="comments">Comments (Optional)</Label>
                        <Textarea
                          id="comments"
                          name="comments"
                          placeholder="Any additional comments for your submission..."
                          value={submissionData.comments}
                          onChange={handleInputChange}
                          rows={3}
                        />
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
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Submission Guidelines</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Make sure your submission is in PDF format</li>
                    <li>• Maximum file size: 5MB</li>
                    <li>• Remember to include your name and roll number in the document</li>
                    <li>• All submissions are checked for plagiarism</li>
                    <li>• Due date: {formatDate(assignment.dueDate)}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Submission Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Faculty can view submissions in the Analytics panel
                </p>
                <Button variant="outline" onClick={() => setActiveTab("view")}>
                  <Eye className="h-4 w-4 mr-1" /> View Assignment Content
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentPanel;
