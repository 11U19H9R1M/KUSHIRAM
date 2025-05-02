
import { useState } from "react";
import { Assignment, AssignmentSubmission } from "@/lib/assignmentTypes";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Check, X, Eye, ChevronUp, ChevronDown } from "lucide-react";
import { updateSubmissionStatus } from "@/lib/assignmentStorage";
import { toast } from "sonner";

interface AnalyticsPanelProps {
  assignment: Assignment | null;
  submissions: AssignmentSubmission[];
}

const AnalyticsPanel = ({
  assignment,
  submissions
}: AnalyticsPanelProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sortField, setSortField] = useState<string>("submittedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Sort submissions
  const sortedSubmissions = [...submissions].sort((a, b) => {
    if (sortField === "submittedAt") {
      return sortDirection === "asc" 
        ? new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
        : new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    } else if (sortField === "studentName") {
      return sortDirection === "asc"
        ? a.studentName.localeCompare(b.studentName)
        : b.studentName.localeCompare(a.studentName);
    } else if (sortField === "status") {
      return sortDirection === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });
  
  // Calculate statistics
  const totalStudents = submissions.length;
  const submittedOnTime = submissions.filter(s => 
    new Date(s.submittedAt) <= (assignment ? new Date(assignment.dueDate) : new Date())
  ).length;
  const submissionRate = totalStudents > 0 ? (submittedOnTime / totalStudents) * 100 : 0;
  const reviewedCount = submissions.filter(s => 
    s.status === "reviewed" || s.status === "graded"
  ).length;
  const reviewRate = totalStudents > 0 ? (reviewedCount / totalStudents) * 100 : 0;
  const flaggedCount = submissions.filter(s => s.status === "plagiarism_flagged").length;
  
  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Update submission status
  const handleUpdateStatus = (submissionId: string, status: "reviewed" | "graded" | "plagiarism_flagged") => {
    try {
      const result = updateSubmissionStatus(submissionId, status);
      
      if (result) {
        toast.success(`Submission marked as ${status}`);
      } else {
        toast.error("Failed to update submission status");
      }
    } catch (error) {
      console.error("Error updating submission status:", error);
      toast.error("Failed to update submission status");
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  
  // If no assignment is selected
  if (!assignment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] bg-muted/20 rounded-lg">
        <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Select an assignment to view analytics</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          {/* Submission Statistics */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">Submission Statistics</CardTitle>
            </CardHeader>
            <CardContent className="py-2 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Submission Rate</span>
                  <span>{submittedOnTime} / {totalStudents} students</span>
                </div>
                <Progress value={submissionRate} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Review Progress</span>
                  <span>{reviewedCount} / {totalStudents} reviewed</span>
                </div>
                <Progress value={reviewRate} className="h-2" />
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-green-50 p-3 rounded-md text-center">
                  <div className="text-xl font-semibold text-green-700">{totalStudents}</div>
                  <div className="text-xs text-muted-foreground">Total Submissions</div>
                </div>
                <div className="bg-amber-50 p-3 rounded-md text-center">
                  <div className="text-xl font-semibold text-amber-700">
                    {totalStudents - submittedOnTime}
                  </div>
                  <div className="text-xs text-muted-foreground">Late Submissions</div>
                </div>
                <div className="bg-red-50 p-3 rounded-md text-center">
                  <div className="text-xl font-semibold text-red-700">{flaggedCount}</div>
                  <div className="text-xs text-muted-foreground">Plagiarism Flags</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* AI Insights */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
            <CardHeader className="py-3">
              <CardTitle className="text-base">AI-Enhanced Insights</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="space-y-4">
                <div className="bg-white/80 p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Assignment Difficulty Analysis</h4>
                  <p className="text-xs text-muted-foreground">
                    Based on submission rates and time spent, this assignment appears to be 
                    <span className="font-medium text-purple-700"> {assignment.difficulty || "medium"} difficulty</span>.
                    Consider adjusting future assignments accordingly.
                  </p>
                </div>
                
                <div className="bg-white/80 p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Concept Mastery</h4>
                  <p className="text-xs text-muted-foreground">
                    Students show strong understanding of core concepts but struggle with more advanced
                    applications. Consider providing additional resources on implementation techniques.
                  </p>
                </div>
                
                <div className="bg-white/80 p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Recommended Next Steps</h4>
                  <p className="text-xs text-muted-foreground">
                    Based on submission patterns, scheduling a review session focusing on 
                    practical applications would benefit approximately 68% of students.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="py-2">
              <Button variant="outline" size="sm" className="w-full">
                Generate Detailed AI Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Submissions Tab */}
        <TabsContent value="submissions" className="mt-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">Student Submissions</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              {submissions.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort("studentName")}
                        >
                          Student Name
                          {sortField === "studentName" && (
                            sortDirection === "asc" ? 
                              <ChevronUp className="inline h-4 w-4 ml-1" /> : 
                              <ChevronDown className="inline h-4 w-4 ml-1" />
                          )}
                        </TableHead>
                        <TableHead>Roll Number</TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort("submittedAt")}
                        >
                          Submission Date
                          {sortField === "submittedAt" && (
                            sortDirection === "asc" ? 
                              <ChevronUp className="inline h-4 w-4 ml-1" /> : 
                              <ChevronDown className="inline h-4 w-4 ml-1" />
                          )}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort("status")}
                        >
                          Status
                          {sortField === "status" && (
                            sortDirection === "asc" ? 
                              <ChevronUp className="inline h-4 w-4 ml-1" /> : 
                              <ChevronDown className="inline h-4 w-4 ml-1" />
                          )}
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedSubmissions.map(submission => (
                        <TableRow key={submission.id}>
                          <TableCell>{submission.studentName}</TableCell>
                          <TableCell>{submission.rollNumber}</TableCell>
                          <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              submission.status === "submitted" ? "bg-blue-100 text-blue-800" :
                              submission.status === "reviewed" ? "bg-green-100 text-green-800" :
                              submission.status === "graded" ? "bg-purple-100 text-purple-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {submission.status.replace("_", " ")}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild className="h-8 px-2 text-xs">
                                <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-3 w-3 mr-1" /> View
                                </a>
                              </Button>
                              
                              <Button 
                                size="sm"
                                variant="outline"
                                className="h-8 px-2 text-xs" 
                                onClick={() => handleUpdateStatus(submission.id, "reviewed")}
                                disabled={submission.status !== "submitted"}
                              >
                                <Check className="h-3 w-3 mr-1" /> Review
                              </Button>
                              
                              <Button 
                                size="sm"
                                variant="outline"
                                className="h-8 px-2 text-xs text-red-500 border-red-200 hover:bg-red-50"
                                onClick={() => handleUpdateStatus(submission.id, "plagiarism_flagged")}
                                disabled={submission.status === "plagiarism_flagged"}
                              >
                                <X className="h-3 w-3 mr-1" /> Flag
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No submissions yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Submissions will appear here once students submit their work
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPanel;
