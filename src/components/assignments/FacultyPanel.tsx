
import { useState } from "react";
import { Assignment } from "@/lib/assignmentTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar, FileUp, Eye, Plus, FileText } from "lucide-react";
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
    courseCode: "",
    dueDate: "",
    visibleToStudents: false,
    file: null as File | null,
    difficulty: "medium", // AI-enhanced difficulty calibration
    tags: "",
    scheduledPublish: "",
  });
  
  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      courseCode: "",
      dueDate: "",
      visibleToStudents: false,
      file: null,
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
        fileUrl: URL.createObjectURL(formData.file),
        allowedFormats: ["pdf"],
        maxFileSize: 5242880,
        // Extended properties for AI features
        difficulty: formData.difficulty as any, 
        tags: formData.tags.split(",").map(tag => tag.trim()),
        scheduledPublish: formData.scheduledPublish ? new Date(formData.scheduledPublish).toISOString() : undefined
      };
      
      // Save assignment
      onSaveAssignment(newAssignment);
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error("Failed to create assignment");
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  
  return (
    <div className={`space-y-4 ${fullWidth ? "w-full" : ""}`}>
      {/* Header with Create Assignment button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Assignments</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Smart Assignment</DialogTitle>
              <DialogDescription>
                Upload a new assignment with AI-enhanced features
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateAssignment} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Assignment Title*</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Machine Learning Project"
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
                    placeholder="e.g., CS401"
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
                    If set, assignment will be automatically published at this time
                  </p>
                </div>
              </div>
              
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
                  <p className="text-xs text-muted-foreground">
                    AI will calibrate difficulty based on content
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    placeholder="e.g., neural networks, classification"
                    value={formData.tags}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="visibleToStudents" 
                  checked={formData.visibleToStudents}
                  onCheckedChange={(checked) => handleCheckboxChange(checked, "visibleToStudents")} 
                />
                <Label htmlFor="visibleToStudents">Make visible to students immediately</Label>
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
                <Button type="submit">Create Smart Assignment</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Assignment List */}
      <div className="space-y-3 mt-4">
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <Card 
              key={assignment.id} 
              className={`cursor-pointer transition-shadow hover:shadow-md ${
                selectedAssignment?.id === assignment.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => onSelectAssignment(assignment)}
            >
              <CardHeader className="py-3">
                <CardTitle className="text-base">{assignment.title}</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="text-sm text-muted-foreground flex items-center">
                  <FileText className="h-3 w-3 mr-1" />
                  {assignment.courseCode}
                </div>
                <div className="text-sm text-muted-foreground flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  Due: {formatDate(assignment.dueDate)}
                </div>
              </CardContent>
              <CardFooter className="py-2">
                <div className="flex items-center text-xs">
                  <div className={`p-1 rounded-full mr-2 ${
                    assignment.visibleToStudents ? "bg-green-100" : "bg-amber-100"
                  }`}>
                    {assignment.visibleToStudents ? (
                      <Eye className="h-3 w-3 text-green-600" />
                    ) : (
                      <Eye className="h-3 w-3 text-amber-600" />
                    )}
                  </div>
                  {assignment.visibleToStudents ? "Visible to students" : "Hidden from students"}
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 bg-muted/20 rounded-lg">
            <FileUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No assignments yet</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
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
