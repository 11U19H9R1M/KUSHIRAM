
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/DatePicker";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Clock, Users, FileText, Calendar, BookOpen, TrendingUp, Eye, Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import CapsuleCard from "@/components/CapsuleCard";
import { getDocuments, saveDocument, Document } from "@/lib/storage";
import DashboardLayout from "@/components/DashboardLayout";
import { getAllAssignments, getStudentSubmissionForAssignment } from "@/lib/assignmentStorage";
import { Assignment, AssignmentSubmission } from "@/lib/assignmentTypes";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // States for faculty (time capsule functionality)
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState(""); 
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isShared, setIsShared] = useState(false);
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<FileList | null>(null);
  
  // States for student (assignment functionality)
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "student") {
      loadStudentAssignments();
    } else {
      loadDocuments();
    }
  }, [user]);

  // Faculty functions (time capsule)
  const loadDocuments = () => {
    try {
      const loadedDocuments = getDocuments(user?.email || "");
      console.log(`Found ${loadedDocuments.length} documents in total (${loadedDocuments.filter(d => d.createdBy === user?.email).length} user-specific, ${loadedDocuments.filter(d => d.isShared).length} shared)`);
      setDocuments(loadedDocuments);
    } catch (error) {
      console.error("Error loading documents:", error);
      toast.error("Failed to load documents");
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in title and content");
      return;
    }

    if (!selectedDate) {
      toast.error("Please select an unlock date");
      return;
    }

    if (selectedDate <= new Date()) {
      toast.error("Unlock date must be in the future");
      return;
    }

    const document: Document = {
      id: `capsule-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      title,
      content,
      createdBy: user?.email || "",
      createdAt: new Date().toISOString(),
      unlockDate: selectedDate.toISOString(),
      isShared,
      tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0),
      attachments: file ? Array.from(file).map(f => ({ name: f.name, size: f.size, type: f.type, url: URL.createObjectURL(f) })) : []
    };

    const success = saveDocument(document);
    
    if (success) {
      toast.success("Time capsule created successfully!");
      setIsDialogOpen(false);
      setTitle("");
      setContent("");
      setSelectedDate(undefined);
      setIsShared(false);
      setTags("");
      setFile(null);
      loadDocuments();
    } else {
      toast.error("Failed to create time capsule");
    }
  };

  // Student functions (assignments)
  const loadStudentAssignments = async () => {
    setIsLoading(true);
    try {
      const allAssignments = getAllAssignments(false); // Get only visible assignments for students
      setAssignments(allAssignments);
      
      // Load student's submissions
      const studentSubmissions: AssignmentSubmission[] = [];
      allAssignments.forEach(assignment => {
        const submission = getStudentSubmissionForAssignment(assignment.id, user?.email || "");
        if (submission) {
          studentSubmissions.push(submission);
        }
      });
      setSubmissions(studentSubmissions);
      
      console.log(`Loaded ${allAssignments.length} assignments and ${studentSubmissions.length} submissions`);
    } catch (error) {
      console.error("Error loading assignments:", error);
      toast.error("Failed to load assignments");
    } finally {
      setIsLoading(false);
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

  const getSubmissionForAssignment = (assignmentId: string) => {
    return submissions.find(sub => sub.assignmentId === assignmentId);
  };

  // Filter functions for faculty
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || doc.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(documents.flatMap(doc => doc.tags)));

  if (user?.role === "student") {
    // Student Dashboard - Only Assignments
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Student Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                View and submit your assignments
              </p>
            </div>
          </div>

          {/* Student Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Assignments</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assignments.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Submitted</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{submissions.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {assignments.filter(a => {
                    const days = getDaysUntilDue(a.dueDate);
                    return days >= 0 && days <= 7;
                  }).length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {assignments.length > 0 ? Math.round((submissions.length / assignments.length) * 100) : 0}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assignments List */}
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Assignments</h2>
                <Button onClick={() => navigate("/student-assignments")}>
                  View All Assignments
                </Button>
              </div>
              
              {assignments.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Assignments Available</h3>
                    <p className="text-muted-foreground text-center">
                      Your faculty hasn't published any assignments yet. Check back later!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {assignments.slice(0, 5).map((assignment) => {
                    const submission = getSubmissionForAssignment(assignment.id);
                    const daysUntilDue = getDaysUntilDue(assignment.dueDate);
                    const isOverdue = daysUntilDue < 0;

                    return (
                      <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{assignment.title}</CardTitle>
                              <CardDescription className="mt-1">
                                {assignment.courseCode} • Due: {formatDate(assignment.dueDate)}
                              </CardDescription>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {submission ? (
                                <Badge variant="default">
                                  {submission.isLateSubmission ? "Late Submitted" : "Submitted"}
                                </Badge>
                              ) : isOverdue ? (
                                <Badge variant="destructive">Overdue</Badge>
                              ) : (
                                <Badge variant="secondary">
                                  {daysUntilDue === 0 ? "Due Today" : `${daysUntilDue} days left`}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            {assignment.description}
                          </p>
                          <div className="flex gap-2">
                            {assignment.fileUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer">
                                  <Download className="h-4 w-4 mr-2" />
                                  Download Template
                                </a>
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              onClick={() => navigate("/student-assignments")}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              {submission ? "View Submission" : "Submit Assignment"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // Faculty Dashboard - Full Time Capsule functionality
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Academic Vault</h1>
            <p className="text-muted-foreground mt-1">
              Preserve your academic journey through time
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Capsule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Time Capsule</DialogTitle>
                <DialogDescription>
                  Store your academic memories to be unlocked in the future
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter capsule title"
                    className="col-span-3"
                  />
                </div>
                <div>
                  <Label htmlFor="content" className="text-right">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your message to the future..."
                    className="col-span-3"
                    rows={4}
                  />
                </div>
                <div>
                  <Label className="text-right">
                    Unlock Date
                  </Label>
                  <DatePicker date={selectedDate} setDate={setSelectedDate} />
                </div>
                <div>
                  <Label htmlFor="tags" className="text-right">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Enter tags separated by commas"
                    className="col-span-3"
                  />
                </div>
                <div>
                  <Label htmlFor="file" className="text-right">
                    Attachments
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setFile(e.target.files)}
                    multiple
                    className="col-span-3"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="shared" 
                    checked={isShared}
                    onCheckedChange={(checked) => setIsShared(checked as boolean)}
                  />
                  <Label htmlFor="shared" className="text-sm">
                    Share with community
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSubmit}>
                  Create Capsule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Capsules</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unlockable Today</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documents.filter(doc => new Date(doc.unlockDate) <= new Date()).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shared Capsules</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documents.filter(doc => doc.isShared).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documents.filter(doc => 
                  new Date(doc.createdAt).getMonth() === new Date().getMonth() &&
                  new Date(doc.createdAt).getFullYear() === new Date().getFullYear()
                ).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search capsules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Capsules Grid */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Capsules</TabsTrigger>
            <TabsTrigger value="unlockable">Unlockable</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {filteredDocuments.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No capsules found</h3>
                    <p className="text-muted-foreground text-center">
                      Create your first time capsule to get started
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredDocuments.map((document) => (
                  <CapsuleCard 
                    key={document.id} 
                    document={document} 
                    onUpdate={loadDocuments}
                  />
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="unlockable" className="space-y-4">
            <div className="grid gap-4">
              {filteredDocuments
                .filter(doc => new Date(doc.unlockDate) <= new Date())
                .map((document) => (
                  <CapsuleCard 
                    key={document.id} 
                    document={document} 
                    onUpdate={loadDocuments}
                  />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="shared" className="space-y-4">
            <div className="grid gap-4">
              {filteredDocuments
                .filter(doc => doc.isShared)
                .map((document) => (
                  <CapsuleCard 
                    key={document.id} 
                    document={document} 
                    onUpdate={loadDocuments}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
