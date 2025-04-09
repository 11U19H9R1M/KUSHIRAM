
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CapsuleForm from "@/components/CapsuleForm";
import InteractiveTimeline from "@/components/InteractiveTimeline";
import SmartTags from "@/components/SmartTags";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Award, 
  GraduationCap, 
  Brain, 
  Lightbulb, 
  Clock, 
  ArrowRight,
  CalendarClock,
  FileText,
  Lock,
  Tag,
  Search,
  BarChart,
  RefreshCw,
  Globe,
  Check,
  Code,
  Image,
  AlertTriangle
} from "lucide-react";
import EnhancementTabs from "@/components/EnhancementTabs";
import SchedulingOptions from "@/components/SchedulingOptions";

const Create = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("create");
  const [unlockDate, setUnlockDate] = useState<Date | undefined>(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // Default to 30 days from now
  );
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle tag changes
  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
  };

  // Handle unlock date changes
  const handleUnlockDateChange = (date: Date | undefined) => {
    setUnlockDate(date);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-accent/10">
      <Header />
      <main className="flex-1 pt-16 md:pt-24 pb-16 md:pb-20">
        <div className="container px-4 md:px-6">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">TimeVault Academia</h1>
                <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
                  Secure academic documents with advanced blockchain verification and AI analysis
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-primary/10 border-primary/20">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Powered
                </Badge>
                <Badge variant="outline" className="bg-primary/10 border-primary/20">
                  <Clock className="h-3 w-3 mr-1" />
                  Time-Locked
                </Badge>
                <Badge variant="outline" className="bg-primary/10 border-primary/20">
                  <Award className="h-3 w-3 mr-1" />
                  Blockchain Verified
                </Badge>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="create" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6 glass-morphism w-full md:w-fit">
              <TabsTrigger value="create" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Create Capsule</span>
                <span className="sm:hidden">Create</span>
              </TabsTrigger>
              <TabsTrigger value="enhance" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <span className="hidden sm:inline">AI Enhancement</span>
                <span className="sm:hidden">AI</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4" />
                <span className="hidden sm:inline">Scheduling</span>
                <span className="sm:hidden">Schedule</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="glass-morphism border-white/20 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-primary" />
                        Create Academic Document Capsule
                      </CardTitle>
                      <CardDescription>
                        Upload and secure exam papers, academic records, and other sensitive documents
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CapsuleForm />
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:col-span-1 space-y-6">
                  <Card className="glass-morphism border-white/20 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-base">
                        <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                        Smart Document Tags
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Categorize your documents for better organization and discovery
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SmartTags 
                        onChange={handleTagsChange} 
                        initialTags={selectedTags}
                        suggestedTags={[
                          "Midterm", "Final Exam", "Project", "Assignment", "Notes",
                          "Computer Science", "Mathematics", "Physics", "Chemistry",
                          "Research", "Thesis", "Dissertation", "Lab Report",
                          "Spring 2024", "Fall 2023", "Important", "Reference"
                        ]}
                      />
                    </CardContent>
                  </Card>
                  
                  <InteractiveTimeline 
                    events={[
                      { date: new Date(), title: "Document Created", description: "Initial creation and upload" },
                      { date: new Date(Date.now() + 86400000), title: "Processing", description: "Verification and encryption" },
                      { date: new Date(Date.now() + 172800000), title: "Secure Storage", description: "Document securely stored" }
                    ]} 
                  />
                  
                  <Card className="glass-morphism border-white/20 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-base">
                        <Award className="h-4 w-4 mr-2 text-primary" />
                        Need Help?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Explore our guides to learn more about securing your academic documents effectively.
                      </p>
                      <Button variant="link" className="p-0 h-auto text-primary flex items-center">
                        View Documentation
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="enhance" className="mt-0">
              <EnhancementTabs />
            </TabsContent>
            
            <TabsContent value="schedule" className="mt-0">
              <Card className="glass-morphism border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarClock className="h-5 w-5 mr-2 text-primary" />
                    Advanced Scheduling & Access Control
                  </CardTitle>
                  <CardDescription>
                    Set up time-based access controls and blockchain verification for your academic documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SchedulingOptions 
                    unlockDate={unlockDate}
                    onUnlockDateChange={handleUnlockDateChange}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Create;
