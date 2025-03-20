import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  ChevronLeft, 
  Clock, 
  Download, 
  FileText,
  Lock, 
  Share2, 
  Star, 
  Users,
  BookOpen,
  University,
  GraduationCap,
  Eye,
  Image
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCapsuleById, isDocumentUnlockable } from "@/lib/storage";
import { toast } from "sonner";

const ViewCapsule = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [document, setDocument] = useState<any>(null);
  
  useEffect(() => {
    // Fetch the document
    if (id) {
      console.log(`Attempting to fetch document with ID: ${id}`);
      const fetchedDocument = getCapsuleById(id);
      
      if (fetchedDocument) {
        console.log("Document found:", fetchedDocument.title);
        setDocument(fetchedDocument);
        // Check if it's unlockable
        const unlockable = isDocumentUnlockable(fetchedDocument);
        console.log(`Document unlockable status: ${unlockable}`);
        setIsUnlocked(unlockable);
      } else {
        console.error(`Document with ID ${id} not found`);
        toast.error("Document not found");
      }
    }
    
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!document) return;
    
    // Check if the document should be unlocked
    const checkUnlockStatus = () => {
      const now = new Date();
      const unlockDate = new Date(document.unlockDate);
      
      if (now >= unlockDate) {
        setIsUnlocked(true);
      } else {
        // Update countdown
        setCountdown(formatDistanceToNow(unlockDate, { addSuffix: true }));
      }
    };
    
    checkUnlockStatus();
    const timer = setInterval(checkUnlockStatus, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [document]);

  const handleManualUnlock = () => {
    setIsUnlocked(true);
    toast.success("Document unlocked successfully");
  };
  
  const getDocumentTypeIcon = () => {
    if (!document) return <FileText />;
    
    switch(document.documentType) {
      case "examPaper": return <FileText />;
      case "transcript": return <GraduationCap />;
      case "research": return <BookOpen />;
      default: return <FileText />;
    }
  };
  
  const getDocumentTypeLabel = () => {
    if (!document) return "Document";
    
    switch(document.documentType) {
      case "examPaper": return "Exam Question Paper";
      case "answerKey": return "Answer Key";
      case "transcript": return "Academic Transcript";
      case "admission": return "Admission Document";
      case "financial": return "Financial Record";
      case "research": return "Research Paper/Thesis";
      case "accreditation": return "Accreditation Report";
      case "meeting": return "Meeting Minutes";
      case "placement": return "Placement Record";
      case "personal": return "Student Personal Data";
      default: return "Academic Document";
    }
  };

  const hasImagesAttached = () => {
    if (!document || !document.mediaFiles || document.mediaFiles.length === 0) return false;
    return document.mediaFiles.some((file: any) => file.type === 'image');
  };

  const getFirstImageUrl = () => {
    if (!document || !document.mediaFiles) return null;
    
    const imageFile = document.mediaFiles.find((file: any) => file.type === 'image');
    return imageFile ? imageFile.url : null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-20 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-secondary mb-4"></div>
            <div className="w-48 h-6 bg-secondary rounded mb-2"></div>
            <div className="w-32 h-4 bg-secondary rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-20 flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Document Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The document you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-20">
        <div className="container px-4 md:px-6">
          <div className="mb-6">
            <Button asChild variant="ghost" size="sm" className="mb-4">
              <Link to="/dashboard">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Documents
              </Link>
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {document.isConfidential && (
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                      Confidential
                    </Badge>
                  )}
                  <Badge variant="outline">
                    {getDocumentTypeLabel()}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">{document.title}</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Star className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="rounded-xl overflow-hidden border border-border mb-6 bg-secondary">
                {document.coverImage ? (
                  <img 
                    src={document.coverImage} 
                    alt={document.title}
                    className="w-full aspect-[16/9] object-cover"
                  />
                ) : hasImagesAttached() ? (
                  <img 
                    src={getFirstImageUrl()} 
                    alt={document.title}
                    className="w-full aspect-[16/9] object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[16/9] flex items-center justify-center bg-accent/10">
                    {getDocumentTypeIcon()}
                    <span className="ml-2 text-lg font-medium">{getDocumentTypeLabel()}</span>
                  </div>
                )}
              </div>
              
              {isUnlocked ? (
                <div className="animate-fade-up">
                  <Tabs defaultValue="files">
                    <TabsList className="mb-4">
                      <TabsTrigger value="files">Files</TabsTrigger>
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="files" className="rounded-xl border border-border p-6 bg-card">
                      <h3 className="text-lg font-medium mb-4">Document Files</h3>
                      {document.mediaFiles && document.mediaFiles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {document.mediaFiles.map((file: any, index: number) => (
                            <div key={index} className="flex items-center p-3 border border-border rounded-lg bg-card hover:bg-accent/10 transition-colors">
                              <div className="mr-3 p-2 rounded-md bg-primary/10">
                                {file.type === 'pdf' ? (
                                  <FileText className="w-6 h-6 text-primary" />
                                ) : file.type === 'image' ? (
                                  <Image className="w-6 h-6 text-primary" />
                                ) : (
                                  <FileText className="w-6 h-6 text-primary" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{file.type.toUpperCase()}</p>
                              </div>
                              <Button variant="ghost" size="sm" className="ml-2">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No files attached to this document.</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="notes" className="rounded-xl border border-border p-6 bg-card">
                      <h3 className="text-lg font-medium mb-4">Notes</h3>
                      {document.notes ? (
                        <p className="whitespace-pre-line text-balance">{document.notes}</p>
                      ) : (
                        <p className="text-muted-foreground">No notes provided for this document.</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="details" className="rounded-xl border border-border p-6 bg-card">
                      <h3 className="text-lg font-medium mb-4">Document Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {document.courseCode && (
                          <div>
                            <p className="text-sm font-medium">Course Code</p>
                            <p className="text-muted-foreground">{document.courseCode}</p>
                          </div>
                        )}
                        {document.department && (
                          <div>
                            <p className="text-sm font-medium">Department</p>
                            <p className="text-muted-foreground">{document.department}</p>
                          </div>
                        )}
                        {document.semester && (
                          <div>
                            <p className="text-sm font-medium">Semester</p>
                            <p className="text-muted-foreground">{document.semester}</p>
                          </div>
                        )}
                        {document.academicYear && (
                          <div>
                            <p className="text-sm font-medium">Academic Year</p>
                            <p className="text-muted-foreground">{document.academicYear}</p>
                          </div>
                        )}
                      </div>
                      
                      {document.description && (
                        <div className="mt-4">
                          <p className="text-sm font-medium">Description</p>
                          <p className="text-muted-foreground mt-1">{document.description}</p>
                        </div>
                      )}
                      
                      {document.tags && document.tags.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Tags</p>
                          <div className="flex flex-wrap gap-2">
                            {document.tags.map((tag: string, index: number) => (
                              <Badge key={index} variant="outline">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="rounded-xl border border-border p-10 bg-card flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Lock className="w-8 h-8 text-primary animate-soft-pulse" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">This document is currently restricted</h2>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    This academic document will be automatically released {countdown}.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={handleManualUnlock}>
                      Unlock Now
                    </Button>
                    <Button variant="outline">
                      Set Reminder
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-border p-6 bg-card sticky top-24">
                <h3 className="text-lg font-medium mb-4">Document Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Status</p>
                    <Badge variant={isUnlocked ? "default" : "secondary"} className="mb-1">
                      {isUnlocked ? "Released" : "Restricted"}
                    </Badge>
                    {!isUnlocked && (
                      <p className="text-sm text-muted-foreground">Releases {countdown}</p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Dates</p>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <Calendar className="w-4 h-4 text-muted-foreground mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Created</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(document.createdAt), "PPP")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="w-4 h-4 text-muted-foreground mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Release Date</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(document.unlockDate), "PPP")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {document.authorizedRoles && document.authorizedRoles.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Authorized Roles</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {document.authorizedRoles.map((role: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Security Options</p>
                    <div className="space-y-2">
                      {document.isConfidential && (
                        <div className="flex items-center text-sm">
                          <Lock className="w-4 h-4 mr-2 text-destructive" />
                          <span>Confidential</span>
                        </div>
                      )}
                      {document.restrictedAccess && (
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-2" />
                          <span>Restricted Access</span>
                        </div>
                      )}
                      {document.watermark && (
                        <div className="flex items-center text-sm">
                          <University className="w-4 h-4 mr-2" />
                          <span>Watermarked</span>
                        </div>
                      )}
                      {document.autoExpire && (
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Auto-Expires After 30 Days</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ViewCapsule;
