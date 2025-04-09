
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, BookOpen, Edit, FileText, Plus, Search, Users, Video, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Sample data for library books
const libraryBooks = [
  {
    id: "book1",
    title: "Advanced Control Systems",
    author: "Dr. Elena Rodriguez",
    subject: "Electrical Engineering",
    available: true,
    borrowedBy: null,
    dueDate: null,
    coverColor: "bg-blue-100"
  },
  {
    id: "book2",
    title: "Structural Analysis and Design",
    author: "Prof. James Wilson",
    subject: "Civil Engineering",
    available: false,
    borrowedBy: "student@example.com",
    dueDate: "2025-04-20",
    coverColor: "bg-green-100"
  },
  {
    id: "book3",
    title: "Machine Learning Fundamentals",
    author: "Dr. Michael Chen",
    subject: "Computer Science",
    available: true,
    borrowedBy: null,
    dueDate: null,
    coverColor: "bg-purple-100"
  },
  {
    id: "book4",
    title: "Thermodynamics: Theory and Applications",
    author: "Prof. Sarah Johnson",
    subject: "Mechanical Engineering",
    available: true,
    borrowedBy: null,
    dueDate: null,
    coverColor: "bg-orange-100"
  },
  {
    id: "book5",
    title: "Polymer Chemistry",
    author: "Dr. David Miller",
    subject: "Chemical Engineering",
    available: false,
    borrowedBy: "faculty@example.com",
    dueDate: "2025-04-15",
    coverColor: "bg-red-100"
  },
  {
    id: "book6",
    title: "Aerodynamics and Flight Mechanics",
    author: "Prof. Lisa Zhang",
    subject: "Aerospace Engineering",
    available: true,
    borrowedBy: null,
    dueDate: null,
    coverColor: "bg-cyan-100"
  }
];

// Sample data for recent activities
const recentActivities = [
  {
    id: "act1",
    type: "borrow",
    book: "Structural Analysis and Design",
    user: "John Smith (student@example.com)",
    date: "2025-04-02",
    dueDate: "2025-04-20"
  },
  {
    id: "act2",
    type: "return",
    book: "Digital Signal Processing",
    user: "Maria Garcia (student@example.com)",
    date: "2025-04-01",
    dueDate: null
  },
  {
    id: "act3",
    type: "borrow",
    book: "Polymer Chemistry",
    user: "Dr. Robert Lee (faculty@example.com)",
    date: "2025-03-30",
    dueDate: "2025-04-15"
  },
  {
    id: "act4",
    type: "overdue",
    book: "Database Systems: Concepts and Design",
    user: "Emily Johnson (student@example.com)",
    date: "2025-03-15",
    dueDate: "2025-03-30"
  }
];

const LibrarianDashboard = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(libraryBooks);
  
  useEffect(() => {
    // Filter books based on search query
    if (searchQuery.trim() === "") {
      setFilteredBooks(libraryBooks);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = libraryBooks.filter(
        book => 
          book.title.toLowerCase().includes(query) || 
          book.author.toLowerCase().includes(query) || 
          book.subject.toLowerCase().includes(query)
      );
      setFilteredBooks(filtered);
    }
  }, [searchQuery]);

  const handleBookAction = (bookId: string, action: 'checkout' | 'return' | 'edit') => {
    switch (action) {
      case 'checkout':
        toast.success(`Book checked out successfully`);
        break;
      case 'return':
        toast.success(`Book returned successfully`);
        break;
      case 'edit':
        toast.info(`Edit book details`);
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-accent/10">
      <Header />
      <main className="flex-1 pt-16 md:pt-24 pb-16 md:pb-20">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Librarian Dashboard</h1>
            <p className="text-muted-foreground mt-1 md:mt-2">
              Manage library resources and monitor book checkouts
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline" className="bg-primary/10 border-primary/20">
                <Book className="h-3 w-3 mr-1" />
                Library Management
              </Badge>
              <Badge variant="outline" className="bg-primary/10 border-primary/20">
                <Users className="h-3 w-3 mr-1" />
                Student Access
              </Badge>
              <Badge variant="outline" className="bg-primary/10 border-primary/20">
                <GraduationCap className="h-3 w-3 mr-1" />
                Academic Resources
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Books</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-3xl font-bold">{libraryBooks.length}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Available</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Book className="h-5 w-5 text-green-500" />
                  <span className="text-3xl font-bold">
                    {libraryBooks.filter(book => book.available).length}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Checked Out</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  <span className="text-3xl font-bold">
                    {libraryBooks.filter(book => !book.available).length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search books by title, author, or subject..." 
                  className="pl-10 w-full" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button className="bg-primary text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add New Book
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="books" className="w-full mb-8">
            <TabsList className="grid grid-cols-3 mb-6 w-full md:w-fit">
              <TabsTrigger value="books" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                <span className="hidden sm:inline">Books</span>
                <span className="sm:hidden">Books</span>
              </TabsTrigger>
              <TabsTrigger value="activities" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Recent Activities</span>
                <span className="sm:hidden">Activities</span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span className="hidden sm:inline">Lecture Videos</span>
                <span className="sm:hidden">Videos</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="books">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <Card key={book.id} className={`border-l-4 ${book.coverColor} hover:shadow-md transition-shadow`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-1">{book.title}</CardTitle>
                        <Badge variant={book.available ? "outline" : "secondary"}>
                          {book.available ? "Available" : "Checked Out"}
                        </Badge>
                      </div>
                      <CardDescription>{book.author}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center text-sm mb-2">
                        <GraduationCap className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{book.subject}</span>
                      </div>
                      {!book.available && book.dueDate && (
                        <div className="text-sm text-orange-600">
                          <p>Borrowed by: {book.borrowedBy}</p>
                          <p>Due: {new Date(book.dueDate).toLocaleDateString()}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      {book.available ? (
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleBookAction(book.id, 'checkout')}
                        >
                          Check Out
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleBookAction(book.id, 'return')}
                        >
                          Mark as Returned
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleBookAction(book.id, 'edit')}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {filteredBooks.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No books found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or browse all books
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="activities">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Track book checkouts, returns and overdue items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                        <div className="flex-1 mb-2 sm:mb-0">
                          <div className="flex items-start sm:items-center gap-3">
                            {activity.type === 'borrow' && (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200">Borrowed</Badge>
                            )}
                            {activity.type === 'return' && (
                              <Badge className="bg-green-100 text-green-800 border-green-200">Returned</Badge>
                            )}
                            {activity.type === 'overdue' && (
                              <Badge className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>
                            )}
                            <div>
                              <h3 className="font-medium">{activity.book}</h3>
                              <p className="text-sm text-muted-foreground">{activity.user}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-right">
                          <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                          {activity.dueDate && (
                            <p className={activity.type === 'overdue' ? "text-red-600" : ""}>
                              Due: {new Date(activity.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="videos">
              <Card>
                <CardHeader>
                  <CardTitle>Lecture Videos</CardTitle>
                  <CardDescription>Manage recorded lectures and educational videos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Video className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">Video Management Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      The video library management system is under development and will be available in the next update.
                    </p>
                    <Button variant="outline">Learn More</Button>
                  </div>
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

export default LibrarianDashboard;
