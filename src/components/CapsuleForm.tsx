import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, CalendarIcon, FileText, BookOpen, Trash, Lock, Bell, Users, Star, GraduationCap, FileUp, University, Search, AlertTriangle } from "lucide-react";
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
import SmartTags from "@/components/SmartTags";
import AIContentAnalysis from "@/components/AIContentAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlagiarismDetector from "@/components/PlagiarismDetector";

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
  const [activeTab, setActiveTab] = useState("content");
  
  const [isDuplicateFile, setIsDuplicateFile] = useState(false);
  const [duplicateFileNames, setDuplicateFileNames] = useState<string[]>([]);

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
      
      const duplicates: string[] = [];
      const existingFileMap = new Map(files.map(f => [`${f.name}-${f.size}`, f.name]));
      
      newFiles.forEach(file => {
        const fileKey = `${file.name}-${file.size}`;
        if (existingFileMap.has(fileKey)) {
          duplicates.push(file.name);
        }
      });
      
      if (duplicates.length > 0) {
        const uniqueFiles = newFiles.filter(file => 
          !duplicates.includes(file.name) || !existingFileMap.has(`${file.name}-${file.size}`)
        );
        
        setFiles([...files, ...uniqueFiles]);
        setDuplicateFileNames(duplicates);
        setIsDuplicateFile(true);
        
        const newPreviewUrls = uniqueFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls([...previewUrls, ...newPreviewUrls]);
        
        toast.warning(`Duplicate file(s) detected: ${duplicates.join(", ")}`, {
          description: "These files have already been uploaded."
        });
      } else {
        setFiles([...files, ...newFiles]);
        
        const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls([...previewUrls, ...newPreviewUrls]);
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviewUrls = [...previewUrls];
    
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

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };

  const handlePlagiarismResult = (result: {isDuplicate: boolean, similarity: number, fileName: string}) => {
    if (result.isDuplicate) {
      toast.warning(`High similarity detected in "${result.fileName}"`, {
        description: `This file has ${result.similarity.toFixed(0)}% similarity with existing documents.`,
        duration: 5000,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
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
      
      if (isDuplicateFile) {
        const shouldContinue = window.confirm(
          `Warning: Duplicate file(s) detected: ${duplicateFileNames.join(", ")}. Do you still want to continue?`
        );
        
        if (!shouldContinue) {
          setIsSubmitting(false);
          return;
        }
      }
      
      const documentId = generateUniqueId();
      
      const newDocument = {
        id: documentId,
        title,
        description,
        coverImage: previewUrls.length > 0 && files[0].type.startsWith('image/') ? previewUrls[0] : undefined,
        createdAt: new Date(),
        unlockDate: unlockDate || new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        isUnlocked: false,
        documentType,
        courseCode,
        department,
        semester,
        academicYear,
        learningObjectives,
        isConfidential,
        restrictedAccess,
        sendNotifications,
        watermark,
        autoExpire,
        authorizedRoles,
        tags,
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
      
      const saved = saveCapsule(newDocument);
      
      if (saved) {
        toast.success("Academic document secured successfully!");
        
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="content" className="data-[state=active]:glassmorphism">
            <FileText className="w-4 h-4 mr-2 hidden sm:block" />
            Content
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:glassmorphism">
            <GraduationCap className="w-4 h-4 mr-2 hidden sm:block" />
            Academic
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:glassmorphism">
            <Lock className="w-4 h-4 mr-2 hidden sm:block" />
            Security
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-6 animate-fade-in">
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
                        {isDuplicateFile && duplicateFileNames.includes(files[index].name) && (
                          <div className="absolute top-2 right-2 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-full p-1.5">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                        )}
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
            
            {files.length > 0 && (
              <div className="mt-4">
                <PlagiarismDetector 
                  files={files} 
                  onPlagiarismDetected={handlePlagiarismResult}
                />
              </div>
            )}
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
          
          <SmartTags 
            initialTags={tags} 
            onChange={handleTagsChange}
          />
          
          {notes && <AIContentAnalysis content={notes} title={title} mediaCount={files.length} />}
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6 animate-fade-in">
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
            <Label htmlFor="learningObjectives">Learning Objectives</Label>
            <Textarea
              id="learningObjectives"
              value={learningObjectives}
              onChange={e => setLearningObjectives(e.target.value)}
              placeholder="List the learning objectives associated with this document"
              className="mt-1.5 min-h-[100px] glass-input"
            />
          </div>
          
          <div className="bg-background/50 backdrop-blur-sm rounded-lg border border-border p-4">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Academic Standards Compliance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch id="accreditation" defaultChecked />
                <Label htmlFor="accreditation">Accreditation Standards</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="accessibility" defaultChecked />
                <Label htmlFor="accessibility">Accessibility Compliance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="plagiarism" defaultChecked />
                <Label htmlFor="plagiarism">Plagiarism Check</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="curriculum" defaultChecked />
                <Label htmlFor="curriculum">Curriculum Alignment</Label>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6 animate-fade-in">
          <div className="bg-background/50 backdrop-blur-sm rounded-lg border border-border p-4">
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
          </div>
          
          <div className="bg-background/50 backdrop-blur-sm rounded-lg border border-border p-4">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Advanced Security
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch id="encryption" defaultChecked />
                <Label htmlFor="encryption">End-to-End Encryption</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="2fa" defaultChecked />
                <Label htmlFor="2fa">Require 2FA for Access</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="audit" defaultChecked />
                <Label htmlFor="audit">Activity Audit Log</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="tamper" defaultChecked />
                <Label htmlFor="tamper">Tamper Protection</Label>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
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
