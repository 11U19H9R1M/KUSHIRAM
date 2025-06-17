
import { useState } from "react";
import { Assignment } from "@/lib/assignmentTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileUp, Eye, Plus, FileText, Users, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface FacultyPanelProps {
  assignments: Assignment[];
  selectedAssignment: Assignment | null;
  onSelectAssignment: (assignment: Assignment) => void;
  onSaveAssignment: (assignment: Assignment) => void;
  fullWidth?: boolean;
}

const FacultyPanel = ({
  assignments,
  selectedAssignment,
  onSelectAssignment,
  onSaveAssignment,
  fullWidth = false
}: FacultyPanelProps) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    courseCode: "",
    dueDate: "",
    visibleToStudents: false,
    file: null as File | null,
    submissionType: "file_upload" as "file_upload" | "text_submission" | "both",
    difficulty: "medium",
    tags: "",
    scheduledPublish: "",
  });
  
  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      instructions: "",
      courseCode: "",
      dueDate: "",
      visibleToStudents: false,
      file: null,
      submissionType: "file_upload",
      difficulty: "medium",
      tags: "",
      scheduledPublish: "",
    });
  };
  
  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle checkbox/switch changes
  const handleCheckboxChange = (checked: boolean, name: string) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle file changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };
  
  // Handle assignment creation
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.courseCode || !formData.dueDate) {
      toast.error("Please fill all required fields");
      return;
    }
    
    if (formData.submissionType === "file_upload" && !formData.file) {
      toast.error("Please upload a template document for file submissions");
      return;
    }
    
    try {
      // Create new assignment
      const newAssignment: Assignment = {
        id: `assignment-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        title: formData.title,
        description: formData.description,
        instructions: formData.instructions,
        courseCode: formData.courseCode,
        createdBy: user?.email || "",
        createdAt: new Date().toISOString(),
        dueDate: new Date(formData.dueDate).toISOString(),
        visibleToStudents: formData.visibleToStudents,
        submissionType: formData.submissionType,
        fileName: formData.file?.name,
        fileSize: formData.file?.size,
        fileUrl: formData.file ? URL.createObjectURL(formData.file) : undefined,
        allowedFormats: ["pdf", "docx", "doc"],
        maxFileSize: 10485760, // 10MB
        difficulty: formData.difficulty as any,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        scheduledPublish: formData.scheduledPublish ? new Date(formData.scheduledPublish).toISOString() : undefined,
        notificationSent: false,
        totalSubmissions: 0
      };
      
      onSaveAssignment(newAssignment);
      setIsDialogOpen(false);
      resetForm();
      
      toast.success(
        newAssignment.visibleToStudents 
          ? "Assignment created and made visible to students!" 
          : "Assignment created as draft"
      );
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error("Failed to create assignment");
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
  
  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  return (
    <div className={`space-y-4 ${fullWidth ? "w-full" : ""}`}>
      {/* Header with Create Assignment button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Assignment Management</h3>
          <p className="text-sm text-muted-foreground">Create and manage course assignments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>
                Upload assignment materials and set submission requirements for students
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateAssignment} className="space-y-6 mt-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Assignment Title*</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Data Structures Assignment 1"
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
                    placeholder="e.g., CS301"
                    value={formData.courseCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the assignment..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
              
              {/* Detailed Instructions */}
              <div className="space-y-2">
                <Label htmlFor="instructions">Detailed Instructions for Students</Label>
                <Textarea
                  id="instructions"
                  name="instructions"
                  placeholder="Provide detailed instructions on how students should complete and submit this assignment..."
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              
              {/* Submission Type */}
              <div className="space-y-2">
                <Label htmlFor="submissionType">Submission Type*</Label>
                <select
                  id="submissionType"
                  name="submissionType"
                  className="w-full p-2 border rounded-md"
                  value={formData.submissionType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="file_upload">File Upload Only</option>
                  <option value="text_submission">Text Submission Only</option>
                  <option value="both">Both File & Text</option>
                </select>
              </div>
              
              {/* Template File Upload */}
              {(formData.submissionType === "file_upload" || formData.submissionType === "both") && (
                <div className="space-y-2">
                  <Label htmlFor="file">Template Document*</Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileChange}
                    required={formData.submissionType === "file_upload"}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload the assignment template that students will download, complete, and re-upload (max 10MB)
                  </p>
                </div>
              )}
              
              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date & Time*</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledPublish">Scheduled Publish (Optional)</Label>
                  <Input
                    id="scheduledPublish"
                    name="scheduledPublish"
                    type="datetime-local"
                    value={formData.scheduledPublish}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Auto-publish at this time
                  </p>
                </div>
              </div>
              
              {/* Additional Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    className="w-full p-2 border rounded-md"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    placeholder="e.g., algorithms, sorting, complexity"
                    value={formData.tags}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              {/* Visibility Toggle */}
              <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
                <Switch 
                  id="visibleToStudents" 
                  checked={formData.visibleToStudents}
                  onCheckedChange={(checked) => handleCheckboxChange(checked, "visibleToStudents")} 
                />
                <div className="flex-1">
                  <Label htmlFor="visibleToStudents" className="font-medium">
                    Make visible to students immediately
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Students will be notified via email and can start working on the assignment
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Assignment
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Assignment List */}
      <div className="space-y-3 mt-4">
        {assignments.length > 0 ? (
          assignments.map((assignment) => {
            const daysUntilDue = getDaysUntilDue(assignment.dueDate);
            const isOverdue = daysUntilDue < 0;
            
            return (
              <Card 
                key={assignment.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedAssignment?.id === assignment.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => onSelectAssignment(assignment)}
              >
                <CardHeader className="py-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-base">{assignment.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {assignment.courseCode}
                        </Badge>
                        <Badge variant={assignment.difficulty === "easy" ? "default" : 
                                      assignment.difficulty === "medium" ? "secondary" :
                                      assignment.difficulty === "hard" ? "destructive" : "outline"} 
                               className="text-xs">
                          {assignment.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className={`p-1 rounded-full ${
                        assignment.visibleToStudents ? "bg-green-100" : "bg-amber-100"
                      }`}>
                        <Eye className={`h-3 w-3 ${
                          assignment.visibleToStudents ? "text-green-600" : "text-amber-600"
                        }`} />
                      </div>
                      {assignment.totalSubmissions !== undefined && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Users className="h-3 w-3 mr-1" />
                          {assignment.totalSubmissions}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="space-y-2">
                    {assignment.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {assignment.description}
                      </p>
                    )}
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                        {isOverdue ? `Overdue by ${Math.abs(daysUntilDue)} day(s)` :
                         daysUntilDue === 0 ? "Due today" :
                         `Due in ${daysUntilDue} day(s)`}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(assignment.dueDate)}</span>
                    </div>
                    
                    {assignment.submissionType && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <FileText className="h-3 w-3 mr-1" />
                        {assignment.submissionType === "file_upload" ? "File Upload" :
                         assignment.submissionType === "text_submission" ? "Text Submission" :
                         "File & Text"}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="py-2">
                  <div className="flex items-center justify-between w-full text-xs">
                    <span className={assignment.visibleToStudents ? "text-green-600" : "text-amber-600"}>
                      {assignment.visibleToStudents ? "Live for students" : "Draft mode"}
                    </span>
                    {isOverdue && (
                      <div className="flex items-center text-red-600">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Overdue
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-8 bg-muted/20 rounded-lg">
            <FileUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground mb-4">No assignments created yet</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Your First Assignment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyPanel;
