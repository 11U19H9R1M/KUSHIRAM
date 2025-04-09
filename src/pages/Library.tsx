
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Bookmark, BookOpen, Laptop, Video, Search, Clock, Award, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Sample data for engineering subjects
const engineeringSubjects = [
  {
    id: "mech",
    title: "Mechanical Engineering",
    books: 126,
    videos: 78,
    icon: <GraduationCap className="h-8 w-8 text-orange-500" />,
    color: "bg-orange-100 text-orange-800 border-orange-200"
  },
  {
    id: "elec",
    title: "Electrical Engineering",
    books: 158,
    videos: 92,
    icon: <GraduationCap className="h-8 w-8 text-blue-500" />,
    color: "bg-blue-100 text-blue-800 border-blue-200"
  },
  {
    id: "civil",
    title: "Civil Engineering",
    books: 104,
    videos: 63,
    icon: <GraduationCap className="h-8 w-8 text-green-500" />,
    color: "bg-green-100 text-green-800 border-green-200"
  },
  {
    id: "cs",
    title: "Computer Science",
    books: 212,
    videos: 137,
    icon: <GraduationCap className="h-8 w-8 text-purple-500" />,
    color: "bg-purple-100 text-purple-800 border-purple-200"
  },
  {
    id: "chem",
    title: "Chemical Engineering",
    books: 95,
    videos: 59,
    icon: <GraduationCap className="h-8 w-8 text-red-500" />,
    color: "bg-red-100 text-red-800 border-red-200"
  },
  {
    id: "aero",
    title: "Aerospace Engineering",
    books: 87,
    videos: 48,
    icon: <GraduationCap className="h-8 w-8 text-cyan-500" />,
    color: "bg-cyan-100 text-cyan-800 border-cyan-200"
  }
];

// Sample data for video lectures
const recentVideos = [
  {
    id: "v1",
    title: "Introduction to Control Systems",
    subject: "Electrical Engineering",
    duration: "48:25",
    instructor: "Dr. Jane Smith",
    date: "2023-04-05"
  },
  {
    id: "v2",
    title: "Fluid Dynamics: Practical Applications",
    subject: "Mechanical Engineering",
    duration: "52:10",
    instructor: "Prof. John Davis",
    date: "2023-04-02"
  },
  {
    id: "v3",
    title: "Data Structures and Algorithms",
    subject: "Computer Science",
    duration: "64:15",
    instructor: "Dr. Michael Chen",
    date: "2023-03-28"
  },
  {
    id: "v4",
    title: "Building Construction Techniques",
    subject: "Civil Engineering",
    duration: "56:40",
    instructor: "Prof. Sarah Johnson",
    date: "2023-03-25"
  }
];

const Library = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-accent/10">
      <Header />
      <main className="flex-1 pt-16 md:pt-24 pb-16 md:pb-20">
        <div className="container px-4 md:px-6">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Digital Library</h1>
                <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
                  Access engineering resources, textbooks, and recorded lectures
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-primary/10 border-primary/20">
                  <Book className="h-3 w-3 mr-1" />
                  Digital Resources
                </Badge>
                <Badge variant="outline" className="bg-primary/10 border-primary/20">
                  <Video className="h-3 w-3 mr-1" />
                  Video Lectures
                </Badge>
                <Badge variant="outline" className="bg-primary/10 border-primary/20">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  Engineering Subjects
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search for resources, books, or videos..." 
                className="pl-10 w-full" 
              />
            </div>
            <Button className="bg-primary text-white">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          
          <Tabs defaultValue="subjects" className="w-full mb-8">
            <TabsList className="grid grid-cols-3 mb-6 w-full md:w-fit">
              <TabsTrigger value="subjects" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                <span className="hidden sm:inline">Engineering Subjects</span>
                <span className="sm:hidden">Subjects</span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span className="hidden sm:inline">Video Lectures</span>
                <span className="sm:hidden">Videos</span>
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                <span className="hidden sm:inline">My Bookmarks</span>
                <span className="sm:hidden">Saved</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="subjects">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {engineeringSubjects.map((subject) => (
                  <Card key={subject.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          {subject.icon}
                          <CardTitle className="text-lg">{subject.title}</CardTitle>
                        </div>
                        <Badge className={subject.color}>{subject.books} Resources</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{subject.books} Books</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Laptop className="h-4 w-4" />
                          <span>{subject.videos} Videos</span>
                        </div>
                      </div>
                      <Button className="w-full">Browse Resources</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="videos">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Video Lectures</CardTitle>
                  <CardDescription>
                    Watch recorded classes and engineering demonstrations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentVideos.map((video) => (
                      <div key={video.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                        <div className="flex-1 mb-2 sm:mb-0">
                          <h3 className="font-medium">{video.title}</h3>
                          <div className="text-sm text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 mt-1">
                            <span className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" /> 
                              {video.subject}
                            </span>
                            <span className="flex items-center gap-1">
                              <Award className="h-3 w-3" /> 
                              {video.instructor}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> 
                              {video.duration}
                            </span>
                          </div>
                        </div>
                        <Button variant="secondary" size="sm">
                          <Video className="h-3 w-3 mr-1" />
                          Watch
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="bookmarks">
              <div className="p-8 text-center">
                <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">No bookmarks yet</h3>
                <p className="text-muted-foreground mb-6">
                  Save your favorite books and videos for easy access
                </p>
                <Button variant="outline">Browse Library</Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recommended For You</CardTitle>
              <CardDescription>Based on your academic profile and recent activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Introduction to Machine Learning</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>Computer Science</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Award className="h-4 w-4" />
                        <span>Dr. Alan Turing</span>
                      </div>
                    </div>
                    <Button className="w-full" size="sm" variant="outline">View Resource</Button>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Circuit Analysis Fundamentals</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>Electrical Engineering</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Award className="h-4 w-4" />
                        <span>Prof. Marie Curie</span>
                      </div>
                    </div>
                    <Button className="w-full" size="sm" variant="outline">View Resource</Button>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Structural Mechanics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>Civil Engineering</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Award className="h-4 w-4" />
                        <span>Dr. Isaac Newton</span>
                      </div>
                    </div>
                    <Button className="w-full" size="sm" variant="outline">View Resource</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Library;
