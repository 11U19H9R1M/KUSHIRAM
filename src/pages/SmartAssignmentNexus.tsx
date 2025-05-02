
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Assignment, AssignmentSubmission } from "@/lib/assignmentTypes";
import { getAllAssignments, saveAssignment, getSubmissionsForAssignment } from "@/lib/assignmentStorage";
import FacultyPanel from "@/components/assignments/FacultyPanel";
import ContentPanel from "@/components/assignments/ContentPanel";
import AnalyticsPanel from "@/components/assignments/AnalyticsPanel";

const SmartAssignmentNexus = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"three-panel" | "faculty" | "student">("three-panel");
  
  // Load assignments on component mount
  useEffect(() => {
    loadAssignments();
  }, []);
  
  // Load assignments based on user role
  const loadAssignments = async () => {
    setIsLoading(true);
    try {
      const isFaculty = user?.role === "faculty" || user?.role === "admin";
      const allAssignments = getAllAssignments(isFaculty);
      setAssignments(allAssignments);
      console.log(`Loaded ${allAssignments.length} assignments`);
      
      // If there are assignments, select the first one by default
      if (allAssignments.length > 0) {
        handleSelectAssignment(allAssignments[0]);
      }
    } catch (error) {
      console.error("Error loading assignments:", error);
      toast.error("Failed to load assignments");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle assignment selection
  const handleSelectAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    
    // Load submissions for the selected assignment if user is faculty
    if (user?.role === "faculty" || user?.role === "admin") {
      try {
        const assignmentSubmissions = getSubmissionsForAssignment(assignment.id);
        setSubmissions(assignmentSubmissions);
      } catch (error) {
        console.error("Error loading submissions:", error);
      }
    }
  };
  
  // Handle assignment save (for faculty)
  const handleSaveAssignment = (assignment: Assignment) => {
    try {
      const result = saveAssignment(assignment);
      
      if (result) {
        toast.success("Assignment saved successfully");
        loadAssignments();
        setSelectedAssignment(assignment);
      } else {
        toast.error("Failed to save assignment");
      }
    } catch (error) {
      console.error("Error saving assignment:", error);
      toast.error("Failed to save assignment");
    }
  };
  
  // Determine what view to show based on user role
  const determineDefaultView = () => {
    if (user?.role === "faculty" || user?.role === "admin") {
      return "faculty";
    } else if (user?.role === "student") {
      return "student";
    }
    return "three-panel";
  };
  
  useEffect(() => {
    setView(determineDefaultView());
  }, [user]);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Smart Assignment Nexus</h1>
            <p className="text-muted-foreground mt-1">
              AI-enhanced assignment management and collaboration platform
            </p>
          </div>
          
          {/* View selector for admins/testers */}
          {user?.role === "admin" && (
            <Tabs defaultValue={view} onValueChange={(v) => setView(v as any)}>
              <TabsList>
                <TabsTrigger value="three-panel">Three Panel</TabsTrigger>
                <TabsTrigger value="faculty">Faculty View</TabsTrigger>
                <TabsTrigger value="student">Student View</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {view === "three-panel" ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Panel - Faculty Assignment Management */}
                <div className="bg-background border rounded-lg shadow-sm p-4">
                  <h2 className="text-xl font-semibold mb-4">Faculty Panel</h2>
                  <FacultyPanel 
                    assignments={assignments} 
                    selectedAssignment={selectedAssignment}
                    onSelectAssignment={handleSelectAssignment}
                    onSaveAssignment={handleSaveAssignment}
                  />
                </div>
                
                {/* Center Panel - Content & Student View */}
                <div className="bg-background border rounded-lg shadow-sm p-4">
                  <h2 className="text-xl font-semibold mb-4">Content & Collaboration</h2>
                  <ContentPanel 
                    assignment={selectedAssignment}
                    isStudent={user?.role === "student"}
                    onRefresh={loadAssignments}
                  />
                </div>
                
                {/* Right Panel - Analytics & Insights */}
                <div className="bg-background border rounded-lg shadow-sm p-4">
                  <h2 className="text-xl font-semibold mb-4">Analytics & Insights</h2>
                  <AnalyticsPanel 
                    assignment={selectedAssignment}
                    submissions={submissions}
                  />
                </div>
              </div>
            ) : view === "faculty" ? (
              <FacultyPanel 
                assignments={assignments}
                selectedAssignment={selectedAssignment}
                onSelectAssignment={handleSelectAssignment}
                onSaveAssignment={handleSaveAssignment}
                fullWidth
              />
            ) : (
              <ContentPanel 
                assignment={selectedAssignment}
                isStudent={true}
                onRefresh={loadAssignments}
                fullWidth
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SmartAssignmentNexus;
