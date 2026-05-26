import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Eye, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Assignment } from "@/lib/assignmentTypes";
import { getAllAssignments } from "@/lib/assignmentStorage";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    setIsLoading(true);
    try {
      const isFaculty = user?.role === "faculty" || user?.role === "admin";
      const allAssignments = getAllAssignments(isFaculty);
      setAssignments(allAssignments);
    } catch (error) {
      console.error("Error loading assignments:", error);
      toast.error("Failed to load assignments");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-muted rounded w-full mb-2"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-8 bg-muted rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const liveCount = assignments.filter(a => a.visibleToStudents).length;
  const totalSubs = assignments.reduce((sum, a) => sum + (a.totalSubmissions || 0), 0);
  const upcoming = assignments.filter(a => new Date(a.dueDate) > new Date()).length;

  return (
    <DashboardLayout>
      <div className="relative space-y-8">
        {/* Mesh backdrop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-70"
          style={{ background: "var(--gradient-mesh)" }}
        />

        {/* Hero header */}
        <div className="relative overflow-hidden rounded-2xl border bg-card p-6 md:p-8 shadow-[var(--shadow-md)]">
          <div
            aria-hidden
            className="absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-30 blur-3xl"
            style={{ background: "var(--gradient-primary)" }}
          />
          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                {user?.role === "faculty" ? "Faculty workspace" : "Student workspace"}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Welcome back, {user?.name?.split(" ")[0] || "there"}
              </h1>
              <p className="text-muted-foreground max-w-xl">
                Track assignments, submissions, and progress at a glance.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {[
                { label: "Assignments", value: assignments.length },
                { label: "Live", value: liveCount },
                { label: user?.role === "faculty" ? "Submissions" : "Upcoming", value: user?.role === "faculty" ? totalSubs : upcoming },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border bg-background/60 backdrop-blur px-4 py-3 text-center min-w-[88px]">
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {assignments.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card/50 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">No assignments yet</h3>
            <p className="text-muted-foreground text-sm mt-1">New assignments will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {assignments.map((assignment) => {
              const overdue = new Date(assignment.dueDate) < new Date();
              return (
                <Card
                  key={assignment.id}
                  className="group relative overflow-hidden border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"
                >
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1 opacity-80"
                    style={{ background: "var(--gradient-primary)" }}
                  />
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <CardTitle className="text-base md:text-lg truncate">{assignment.title}</CardTitle>
                        <CardDescription className="mt-1 font-mono text-xs">{assignment.courseCode}</CardDescription>
                      </div>
                      <Badge
                        variant={assignment.visibleToStudents ? "default" : "secondary"}
                        className={assignment.visibleToStudents ? "bg-primary/10 text-primary hover:bg-primary/15 border-0" : ""}
                      >
                        {assignment.visibleToStudents ? "Live" : "Draft"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                      {assignment.description || "No description provided"}
                    </p>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className={overdue ? "text-destructive font-medium" : ""}>
                          {overdue ? "Overdue · " : "Due "}{formatDate(assignment.dueDate)}
                        </span>
                      </div>
                      {assignment.files && assignment.files.length > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
                            <FileText className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <span>{assignment.files.length} file{assignment.files.length > 1 ? "s" : ""} attached</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
                          <Users className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span>{assignment.totalSubmissions || 0} submission{(assignment.totalSubmissions || 0) === 1 ? "" : "s"}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full group-hover:border-primary/40 group-hover:bg-accent" asChild>
                      <a href="/student-assignments">
                        <Eye className="h-4 w-4 mr-2" />
                        View Assignment
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
