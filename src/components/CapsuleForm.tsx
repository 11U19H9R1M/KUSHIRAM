
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, CalendarIcon, FileText, BookOpen, Trash, Lock, Bell, Users, Star, GraduationCap, FileUp, University } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn, generateUniqueId } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { saveCapsule } from "@/lib/storage";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const CapsuleForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unlockDate, setUnlockDate] = useState<Date | undefined>(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // Default to 30 days from now
  );
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Academic specific fields
  const [documentType, setDocumentType] = useState("examPaper");
  const [courseCode, setCourseCode] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  
  // Security options
  const [isConfidential, setIsConfidential] = useState(true);
  const [restrictedAccess, setRestrictedAccess] = useState(true);
  const [sendNotifications, setSendNotifications] = useState(true);
  const [watermark, setWatermark] = useState(true);
  const [autoExpire, setAutoExpire] = useState(true);
  const [authorizedRoles, setAuthorizedRoles] = useState<string[]>(["examController", "faculty"]);
  const [tags, setTags] = useState("");

  const documentTypes = [
    { value: "examPaper", label: "Exam Question Paper" },
    { value: "answerKey", label: "Answer Key" },
    { value: "transcript", label: "Academic Transcript" },
    { value: "admission", label: "Admission Document" },
    { value: "financial", label: "Financial Record" },
    { value: "research", label: "Research Paper/Thesis" },
    { value: "accreditation", label: "Accreditation Report" },
    { value: "meeting", label: "Meeting Minutes" },
    { value: "placement", label: "Placement Record" },
    { value: "personal", label: "Student Personal Data" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
      
      // Create preview URLs for the files
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviewUrls = [...previewUrls];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index]);
    
    newFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    setFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
  };

  const toggleRole = (role: string) => {
    if (authorizedRoles.includes(role)) {
      setAuthorizedRoles(authorizedRoles.filter(r => r !== role));
    } else {
      setAuthorizedRoles([...authorizedRoles, role]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!title.trim()) {
        toast.error("Please enter a title for your document");
        setIsSubmitting(false);
        return;
      }
      
      if (!unlockDate) {
        toast.error("Please select a release date");
        setIsSubmitting(false);
        return;
      }

      if (files.length === 0) {
        toast.error("Please upload at least one document");
        setIsSubmitting(false);
        return;
      }
      
      // Generate a new unique ID for the document
      const documentId = generateUniqueId();
      
      // Create a new document object
      const newDocument = {
        id: documentId,
        title,
        description,
        coverImage: previewUrls.length > 0 && files[0].type.startsWith('image/') ? previewUrls[0] : undefined,
        createdAt: new Date(),
        unlockDate: unlockDate || new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        isUnlocked: false,
        // Academic specific fields
        documentType,
        courseCode,
        department,
        semester,
        academicYear,
        // Security options
        isConfidential,
        restrictedAccess,
        sendNotifications,
        watermark,
        autoExpire,
        authorizedRoles,
        tags: tags.split(',').map(tag => tag.trim()),
        notes,
        mediaFiles: previewUrls.map((url, index) => ({
          id: `file-${index}`,
          url,
          type: files[index].type.startsWith('image/') ? 'image' : 
                files[index].type === 'application/pdf' ? 'pdf' :
                files[index].type.startsWith('video/') ? 'video' : 'document',
          name: files[index].name
        }))
      };
      
      // Save document using our storage utility
      const saved = saveCapsule(newDocument);
      
      if (saved) {
        // Show success message
        toast.success("Academic document secured successfully!");
        
        // Redirect to dashboard
        setTimeout(() => {
          setIsSubmitting(false);
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error("Failed to secure document. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error securing academic document:", error);
      toast.error("Failed to secure document. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div>
          <Label htmlFor="documentType">Document Type</Label>
          <Select 
            value={documentType} 
            onValueChange={setDocumentType}
          >
            <SelectTrigger className="mt-1.5 glass-input">
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Midterm Exam Paper - Computer Science"
            required
            className="mt-1.5 glass-input"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Details about this document"
            className="mt-1.5 min-h-[100px] glass-input"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="courseCode">Course Code</Label>
            <Input
              id="courseCode"
              value={courseCode}
              onChange={e => setCourseCode(e.target.value)}
              placeholder="CS101"
              className="mt-1.5 glass-input"
            />
          </div>
          
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              placeholder="Computer Science"
              className="mt-1.5 glass-input"
            />
          </div>
          
          <div>
            <Label htmlFor="semester">Semester</Label>
            <Input
              id="semester"
              value={semester}
              onChange={e => setSemester(e.target.value)}
              placeholder="Spring 2024"
              className="mt-1.5 glass-input"
            />
          </div>
          
          <div>
            <Label htmlFor="academicYear">Academic Year</Label>
            <Input
              id="academicYear"
              value={academicYear}
              onChange={e => setAcademicYear(e.target.value)}
              placeholder="2023-2024"
              className="mt-1.5 glass-input"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="unlock-date">Release Date</Label>
          <div className="mt-1.5">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal glass-button",
                    !unlockDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {unlockDate ? format(unlockDate, "PPP") : "Select release date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 glass-morphism">
                <CalendarComponent
                  mode="single"
                  selected={unlockDate}
                  onSelect={setUnlockDate}
                  initialFocus
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div>
          <Label htmlFor="notes">Secure Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Special instructions or information about this document"
            className="mt-1.5 min-h-[150px] glass-input"
          />
        </div>
        
        {/* Document Upload */}
        <div>
          <Label className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Document Upload
          </Label>
          <div className="mt-1.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-md overflow-hidden border border-border glass-card flex flex-col justify-between">
                  {files[index].type.startsWith('image/') ? (
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-4">
                      <FileText className="w-16 h-16 text-primary/60 mb-2" />
                      <p className="text-sm font-medium text-center break-all">{files[index].name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(files[index].size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Badge variant="outline" className="mt-2">
                        {files[index].type === 'application/pdf' ? 'PDF' : 
                         files[index].type.split('/')[1].toUpperCase()}
                      </Badge>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <label className="cursor-pointer">
              <div className="aspect-square rounded-md border border-dashed border-border glass-card flex flex-col items-center justify-center hover:bg-secondary/30 transition-colors">
                <FileUp className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm font-medium">Upload Documents</span>
                <span className="text-xs text-muted-foreground">PDFs, DOCs, Images</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*"
                  className="hidden"
                />
              </div>
            </label>
          </div>
        </div>

        {/* Security Options */}
        <div className="bg-background/50 backdrop-blur-sm rounded-lg border border-border p-4 mt-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Security Options
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="confidential" checked={isConfidential} onCheckedChange={setIsConfidential} />
              <Label htmlFor="confidential" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Mark as Confidential
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="restricted" checked={restrictedAccess} onCheckedChange={setRestrictedAccess} />
              <Label htmlFor="restricted" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Restricted Access
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="notifications" checked={sendNotifications} onCheckedChange={setSendNotifications} />
              <Label htmlFor="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Send Release Notifications
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="watermark" checked={watermark} onCheckedChange={setWatermark} />
              <Label htmlFor="watermark" className="flex items-center gap-2">
                <University className="w-4 h-4" />
                Add Watermark
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="expire" checked={autoExpire} onCheckedChange={setAutoExpire} />
              <Label htmlFor="expire" className="flex items-center gap-2">
                <Trash className="w-4 h-4" />
                Auto-Expire After 30 Days
              </Label>
            </div>
          </div>
          
          <div className="mt-4">
            <Label className="mb-2 block">Authorized Roles</Label>
            <div className="flex flex-wrap gap-2">
              {["examController", "faculty", "admin", "student", "staff"].map(role => (
                <Badge 
                  key={role}
                  variant={authorizedRoles.includes(role) ? "default" : "outline"} 
                  className="cursor-pointer transition-all"
                  onClick={() => toggleRole(role)}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="e.g., midterm, 2024, computer science"
              className="mt-1.5 glass-input"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => navigate("/dashboard")} className="glass-button">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="glass-primary-button">
          {isSubmitting ? "Securing..." : "Secure Document"}
        </Button>
      </div>
    </form>
  );
};

export default CapsuleForm;
