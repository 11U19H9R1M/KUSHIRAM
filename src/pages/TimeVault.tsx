
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Clock, FileVideo, Upload, Search, Play } from "lucide-react";
import { saveCapsule, getAllCapsules } from "@/lib/storage";

interface Recording {
  id: string;
  title: string;
  description?: string;
  courseCode: string;
  uploadedBy: string;
  uploadDate: Date;
  duration: string;
  url: string;
}

const TimeVault = () => {
  const { user } = useAuth();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    courseCode: "",
    file: null as File | null,
  });

  const isFaculty = user?.role === "faculty" || user?.role === "admin";

  useEffect(() => {
    // Load recordings from storage
    loadRecordings();
  }, []);

  const loadRecordings = () => {
    // Get all capsules that are recordings
    const allCapsules = getAllCapsules();
    const recordingCapsules = allCapsules.filter(
      (capsule) => capsule.documentType === "recording"
    );
    
    setRecordings(
      recordingCapsules.map((recording) => ({
        id: recording.id,
        title: recording.title,
        description: recording.description,
        courseCode: recording.courseCode,
        uploadedBy: recording.createdBy,
        uploadDate: new Date(recording.createdAt),
        duration: recording.duration || "Unknown",
        url: recording.mediaFiles && recording.mediaFiles.length > 0 
          ? recording.mediaFiles[0].url 
          : "#"
      }))
    );
  };

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUploadForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.title || !uploadForm.courseCode || !uploadForm.file) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setIsUploading(true);
    
    // Simulate file upload - in a real app, you'd upload to a server
    setTimeout(() => {
      // For demo purposes, create a recording entry in local storage
      const newRecording = {
        id: `recording_${Date.now()}`,
        title: uploadForm.title,
        description: uploadForm.description,
        courseCode: uploadForm.courseCode,
        documentType: "recording",
        createdBy: user?.email || "faculty@example.com",
        createdAt: new Date().toISOString(),
        duration: "45:00", // Mock duration
        mediaFiles: [{
          name: uploadForm.file?.name,
          type: "video",
          url: URL.createObjectURL(uploadForm.file!),
          size: uploadForm.file?.size || 0
        }]
      };
      
      // Save to storage using the existing storage system
      saveCapsule(newRecording);
      
      // Update UI
      loadRecordings();
      
      // Reset form
      setUploadForm({
        title: "",
        description: "",
        courseCode: "",
        file: null,
      });
      
      setIsUploading(false);
      toast.success("Recording uploaded successfully");
    }, 1500);
  };

  const filteredRecordings = recordings.filter(recording => 
    recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recording.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recording.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recording.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date) => {
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Time Vault</h1>
          <p className="text-muted-foreground mt-1">
            Access and manage recorded lectures and academic sessions
          </p>
        </div>
        
        <Tabs defaultValue="browse">
          <TabsList className="grid grid-cols-2 mb-6 max-w-xs">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Browse Recordings
            </TabsTrigger>
            {isFaculty && (
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Recording
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="browse">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search recordings by title, course code, or uploaded by..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {filteredRecordings.length > 0 ? (
              <div className="grid gap-4">
                {filteredRecordings.map((recording) => (
                  <Card key={recording.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      <div className="bg-primary/5 p-4 flex items-center justify-center md:w-48">
                        <FileVideo className="h-12 w-12 text-primary/60" />
                      </div>
                      <div className="flex-1">
                        <CardHeader className="pb-2">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <CardTitle className="text-lg">{recording.title}</CardTitle>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" /> 
                              {recording.duration}
                            </div>
                          </div>
                          <CardDescription className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            <span>Course: {recording.courseCode}</span>
                            <span>Uploaded by: {recording.uploadedBy}</span>
                            <span>Date: {formatDate(recording.uploadDate)}</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {recording.description && (
                            <p className="text-sm text-muted-foreground mb-4">{recording.description}</p>
                          )}
                          <Button className="w-full md:w-auto" variant="default">
                            <Play className="h-4 w-4 mr-2" />
                            Watch Recording
                          </Button>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileVideo className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No recordings found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Try adjusting your search terms" : "There are no recordings available yet"}
                </p>
                {isFaculty && (
                  <Button onClick={() => document.querySelector('button[value="upload"]')?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload a Recording
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          
          {isFaculty && (
            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle>Upload New Recording</CardTitle>
                  <CardDescription>Share class recordings with your students</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpload} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">
                          Title*
                        </label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="Introduction to Data Structures"
                          value={uploadForm.title}
                          onChange={handleUploadChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="courseCode" className="text-sm font-medium">
                          Course Code*
                        </label>
                        <Input
                          id="courseCode"
                          name="courseCode"
                          placeholder="CS101"
                          value={uploadForm.courseCode}
                          onChange={handleUploadChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-medium">
                        Description
                      </label>
                      <Input
                        id="description"
                        name="description"
                        placeholder="Brief description of the recording content"
                        value={uploadForm.description}
                        onChange={handleUploadChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="file" className="text-sm font-medium">
                        Recording File*
                      </label>
                      <Input
                        id="file"
                        name="file"
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Supported formats: MP4, WebM, MOV (max 500MB)
                      </p>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto" 
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-foreground mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Recording
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TimeVault;
