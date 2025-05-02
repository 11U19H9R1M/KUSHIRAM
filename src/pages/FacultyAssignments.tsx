import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Calendar, FileUp, FileDown, Eye, EyeOff, Filter, Search, Plus, Trash, Edit, Check, X
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Assignment, AssignmentSubmission } from "@/lib/assignmentTypes";
import { 
  saveAssignment, 
  getAllAssignments, 
  deleteAssignment, 
  updateAssignmentVisibility, 
  getSubmissionsForAssignment, 
  updateSubmissionStatus 
} from "@/lib/assignmentStorage";

const FacultyAssignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [courses, setCourses] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [viewingSubmissions, setViewingSubmissions] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseCode: "",
    dueDate: "",
    visibleToStudents: false,
    file: null as File | null,
    allowedFormats: ["pdf"],
    maxFileSize: 5242880, // 5MB default
  });

  // Ensure user is faculty
  useEffect(() => {
    if (user && user.role !== "faculty" && user.role !== "admin") {
      toast.error("You don't have permission to access this page");
      // Redirect to dashboard or appropriate page
    }
  }, [user]);

  // Load assignments
  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = () => {
    setIsLoading(true);
    try {
      // Get all assignments for faculty
      const allAssignments = getAllAssignments(true);
      setAssignments(allAssignments);
      
      // Extract unique course codes
      const uniqueCourses: string[] = Array.from(
        new Set(allAssignments.map(assignment => assignment.courseCode))
      );
      setCourses(uniqueCourses);
      
      console.log(`Loaded ${allAssignments.length} assignments`);
    } catch (error) {
      console.error("Error loading assignments:", error);
      toast.error("Failed to load assignments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean, name: string) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.courseCode || !formData.dueDate || !formData.file) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      // Create new assignment
      const newAssignment: Assignment = {
        id: `assignment-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        title: formData.title,
        description: formData.description,
        courseCode: formData.courseCode,
        createdBy: user?.email || "",
        createdAt: new Date().toISOString(),
        dueDate: new Date(formData.dueDate).toISOString(),
        visibleToStudents: formData.visibleToStudents,
        fileName: formData.file.name,
        fileSize: formData.file.size,
        fileUrl: URL.createObjectURL(formData.file), // In a real app, this would be a server upload URL
        allowedFormats: formData.allowedFormats,
        maxFileSize: formData.maxFileSize
      };
      
      // Save assignment
      const result = saveAssignment(newAssignment);
      
      if (result) {
        toast.success("Assignment created successfully");
        setIsDialogOpen(false);
        resetForm();
        loadAssignments();
      } else {
        toast.error("Failed to create assignment");
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error("Failed to create assignment");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      courseCode: "",
      dueDate: "",
      visibleToStudents: false,
      file: null,
      allowedFormats: ["pdf"],
      maxFileSize: 5242880,
    });
  };

  const handleDeleteAssignment = (id: string) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      try {
        const result = deleteAssignment(id);
        
        if (result) {
          toast.success("Assignment deleted successfully");
          loadAssignments();
        } else {
          toast.error("Failed to delete assignment");
        }
      } catch (error) {
        console.error("Error deleting assignment:", error);
        toast.error("Failed to delete assignment");
      }
    }
  };

  const toggleVisibility = (id: string, currentVisibility: boolean) => {
    try {
      const result = updateAssignmentVisibility(id, !currentVisibility);
      
      if (result) {
        toast.success(`Assignment is now ${!currentVisibility ? "visible" : "hidden"} to students`);
        loadAssignments();
      } else {
        toast.error("Failed to update visibility");
      }
    } catch (error) {
      console.error("Error updating visibility:", error);
      toast.error("Failed to update visibility");
    }
  };

  const viewSubmissions = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    
    try {
      const assignmentSubmissions = getSubmissionsForAssignment(assignment.id);
      setSubmissions(assignmentSubmissions);
      setViewingSubmissions(true);
    } catch (error) {
      console.error("Error loading submissions:", error);
      toast.error("Failed to load submissions");
    }
  };

  const updateSubmissionReviewStatus = (submission: AssignmentSubmission, status: "reviewed" | "graded" | "plagiarism_flagged") => {
    try {
      const result = updateSubmissionStatus(submission.id, status);
      
      if (result) {
        toast.success(`Submission marked as ${status}`);
        
        // Refresh submissions
        if (selectedAssignment) {
          const refreshedSubmissions = getSubmissionsForAssignment(selectedAssignment.id);
          setSubmissions(refreshedSubmissions);
        }
      } else {
        toast.error("Failed to update submission status");
      }
    } catch (error) {
      console.error("Error updating submission status:", error);
      toast.error("Failed to update submission status");
    }
  };

  // Filter assignments based on search query and selected course
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = 
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      assignment.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCourse === "all") {
      return matchesSearch;
    } else {
      return assignment.courseCode === selectedCourse && matchesSearch;
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Faculty Assignment Management</h1>
          <p className="text-muted-foreground mt-1">
            Create, manage, and review student assignments
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <select 
              className="p-2 border rounded-md"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
                <DialogDescription>
                  Add a new assignment for students to complete
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateAssignment} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Assignment Title*</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Midterm Assignment"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="courseCode">Course Code*</Label>
                    <Input
                      id="courseCode"
                      name="courseCode"
                      placeholder="e.g., CS101"
                      value={formData.courseCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Detailed instructions for students..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date*</Label>
                    <Input
                      id="dueDate"
                      name="dueDate"
                      type="datetime-local"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2 flex items-center">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="visibleToStudents">Make Visible to Students</Label>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="visibleToStudents" 
                          checked={formData.visibleToStudents}
                          onCheckedChange={(checked) => handleCheckboxChange(checked, "visibleToStudents")} 
                        />
                        <Label htmlFor="visibleToStudents" className="text-sm">
                          {formData.visibleToStudents ? "Visible" : "Hidden"}
                        </Label>
                      </div>
                    </div>
                  </div>
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
                    Upload the assignment document (max 5MB)
                  </p>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Upload Assignment</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Main content */}
        {viewingSubmissions && selectedAssignment ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Submissions for: {selectedAssignment.title}</h2>
              <Button variant="outline" onClick={() => setViewingSubmissions(false)}>
                Back to Assignments
              </Button>
            </div>
            
            {submissions.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Student Submissions</CardTitle>
                  <CardDescription>
                    {submissions.length} submission(s) for {selectedAssignment.courseCode}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Roll Number</TableHead>
                        <TableHead>Submission Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map(submission => (
                        <TableRow key={submission.id}>
                          <TableCell>{submission.studentName}</TableCell>
                          <TableCell>{submission.rollNumber}</TableCell>
                          <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              submission.status === "submitted" ? "bg-blue-100 text-blue-800" :
                              submission.status === "reviewed" ? "bg-green-100 text-green-800" :
                              submission.status === "graded" ? "bg-purple-100 text-purple-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {submission.status.replace("_", " ")}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                asChild
                              >
                                <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </a>
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => updateSubmissionReviewStatus(submission, "reviewed")}
                                disabled={submission.status !== "submitted"}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Mark Reviewed
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => updateSubmissionReviewStatus(submission, "plagiarism_flagged")}
                                disabled={submission.status === "plagiarism_flagged"}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Flag Plagiarism
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <FileDown className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No submissions yet</h3>
                <p className="text-muted-foreground">
                  There are no submissions for this assignment yet
                </p>
              </div>
            )}
          </div>
        ) : (
          // Assignment list
          <>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssignments.map(assignment => (
                  <Card key={assignment.id} className="overflow-hidden transition-shadow hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{assignment.title}</CardTitle>
                          <CardDescription>{assignment.courseCode}</CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleVisibility(assignment.id, assignment.visibleToStudents)}
                            title={assignment.visibleToStudents ? "Hide from students" : "Make visible to students"}
                          >
                            {assignment.visibleToStudents ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteAssignment(assignment.id)}
                            title="Delete assignment"
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <p className="text-sm mb-2 line-clamp-2">
                          {assignment.description || "No description provided"}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due: {formatDate(assignment.dueDate)}
                        </div>
                      </div>
                      
                      {assignment.fileUrl && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <FileUp className="h-3 w-3 mr-1" />
                          {assignment.fileName || "Assignment PDF"}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild 
                        className="flex-1"
                      >
                        <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-1" />
                          View PDF
                        </a>
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => viewSubmissions(assignment)}
                      >
                        <FileDown className="h-4 w-4 mr-1" />
                        View Submissions
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <FileUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No assignments found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 
                    `No assignments match your search for "${searchQuery}"` : 
                    "You haven't created any assignments yet"}
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Assignment
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FacultyAssignments;
