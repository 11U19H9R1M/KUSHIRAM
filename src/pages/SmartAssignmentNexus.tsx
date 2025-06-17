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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, TrendingUp, Clock } from "lucide-react";

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
  
  // Calculate dashboard statistics
  const getDashboardStats = () => {
    const now = new Date();
    const upcomingDeadlines = assignments.filter(a => new Date(a.dueDate) > now).length;
    const totalSubmissions = submissions.length;
    const activeAssignments = assignments.filter(a => a.visibleToStudents).length;
    
    return {
      totalAssignments: assignments.length,
      activeAssignments,
      upcomingDeadlines,
      totalSubmissions
    };
  };

  const stats = getDashboardStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {user?.role === "faculty" ? "Faculty Dashboard" : "Student Portal"} - EduVault LMS
            </h1>
            <p className="text-muted-foreground mt-1">
              {user?.role === "faculty" 
                ? "Manage assignments, review submissions, and track student progress"
                : "View assignments, submit work, and track your academic progress"
              }
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

        {/* Dashboard Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user?.role === "faculty" ? "Total Assignments" : "Available Assignments"}
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.role === "faculty" ? stats.totalAssignments : stats.activeAssignments}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user?.role === "faculty" ? "Active Assignments" : "Upcoming Deadlines"}
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.role === "faculty" ? stats.activeAssignments : stats.upcomingDeadlines}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user?.role === "faculty" ? "Total Submissions" : "Your Submissions"}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user?.role === "faculty" ? "Avg. Submissions" : "Completion Rate"}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user?.role === "faculty" 
                  ? `${stats.activeAssignments > 0 ? Math.round(stats.totalSubmissions / stats.activeAssignments) : 0}%`
                  : "85%"
                }
              </div>
            </CardContent>
          </Card>
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
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {user?.role === "faculty" ? "Assignment Management" : "Available Assignments"}
                  </h2>
                  <FacultyPanel 
                    assignments={assignments} 
                    selectedAssignment={selectedAssignment}
                    onSelectAssignment={handleSelectAssignment}
                    onSaveAssignment={handleSaveAssignment}
                  />
                </div>
                
                {/* Center Panel - Content & Student View */}
                <div className="bg-background border rounded-lg shadow-sm p-4">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {user?.role === "faculty" ? "Student Collaboration Hub" : "Assignment Details & Submission"}
                  </h2>
                  <ContentPanel 
                    assignment={selectedAssignment}
                    isStudent={user?.role === "student"}
                    onRefresh={loadAssignments}
                  />
                </div>
                
                {/* Right Panel - Analytics & Insights */}
                <div className="bg-background border rounded-lg shadow-sm p-4">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Analytics & Insights
                  </h2>
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
