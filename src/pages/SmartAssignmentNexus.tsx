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
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // Load assignments on component mount
  useEffect(() => {
    loadAssignments();
    loadNotifications();
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

  // Load notifications for students
  const loadNotifications = () => {
    if (user?.role === "student") {
      try {
        const userNotifications = getNotifications(user.email);
        setNotifications(userNotifications);
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
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
        toast.success(
          assignment.visibleToStudents 
            ? "Assignment published and students notified!" 
            : "Assignment saved as draft"
        );
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
    
    if (user?.role === "faculty" || user?.role === "admin") {
      // Faculty statistics
      const totalAssignments = assignments.length;
      const activeAssignments = assignments.filter(a => a.visibleToStudents).length;
      const draftAssignments = assignments.filter(a => !a.visibleToStudents).length;
      const totalSubmissions = submissions.length;
      const overdueAssignments = assignments.filter(a => new Date(a.dueDate) < now && a.visibleToStudents).length;
      
      return {
        totalAssignments,
        activeAssignments,
        draftAssignments,
        totalSubmissions,
        overdueAssignments,
        avgSubmissionsPerAssignment: activeAssignments > 0 ? Math.round(totalSubmissions / activeAssignments) : 0
      };
    } else {
      // Student statistics
      const availableAssignments = assignments.filter(a => a.visibleToStudents).length;
      const upcomingDeadlines = assignments.filter(a => {
        const dueDate = new Date(a.dueDate);
        const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff >= 0 && daysDiff <= 7 && a.visibleToStudents;
      }).length;
      const overdueAssignments = assignments.filter(a => new Date(a.dueDate) < now && a.visibleToStudents).length;
      const unreadNotifications = notifications.filter(n => !n.read).length;
      
      return {
        availableAssignments,
        upcomingDeadlines,
        overdueAssignments,
        unreadNotifications,
        completionRate: 85 // This would be calculated from actual submissions
      };
    }
  };

  const stats = getDashboardStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {user?.role === "faculty" ? "Faculty Dashboard" : "Student Portal"} - Smart Assignment Nexus
            </h1>
            <p className="text-muted-foreground mt-1">
              {user?.role === "faculty" 
                ? "Create assignments, track submissions, and manage student progress with AI-powered insights"
                : "Access assignments, submit work, and track your academic progress"
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
          {user?.role === "faculty" || user?.role === "admin" ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalAssignments}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.draftAssignments} drafts
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeAssignments}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.overdueAssignments} overdue
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all assignments
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Submissions</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgSubmissionsPerAssignment}</div>
                  <p className="text-xs text-muted-foreground">
                    Per assignment
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Assignments</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.availableAssignments}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.upcomingDeadlines}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.unreadNotifications}</div>
                  <p className="text-xs text-muted-foreground">
                    Unread
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completionRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    Assignment completion
                  </p>
                </CardContent>
              </Card>
            </>
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
                    {user?.role === "faculty" ? "Assignment Content & Preview" : "Assignment Details & Submission"}
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
