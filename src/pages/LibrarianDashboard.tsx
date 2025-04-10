
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, BookOpen, Edit, FileText, Plus, Search, Users, Video, GraduationCap, Trash2, 
  BookMarked, BookIcon, RefreshCw, Filter, DownloadCloud, BookA, Archive, FileVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Sample data for library books with expanded categories
const libraryBooks = [
  {
    id: "book1",
    title: "Advanced Control Systems",
    author: "Dr. Elena Rodriguez",
    subject: "Electrical Engineering",
    category: "Engineering",
    available: true,
    borrowedBy: null,
    dueDate: null,
    coverColor: "bg-blue-100 dark:bg-blue-900/30"
  },
  {
    id: "book2",
    title: "Structural Analysis and Design",
    author: "Prof. James Wilson",
    subject: "Civil Engineering",
    category: "Engineering",
    available: false,
    borrowedBy: "student@example.com",
    dueDate: "2025-04-20",
    coverColor: "bg-green-100 dark:bg-green-900/30"
  },
  {
    id: "book3",
    title: "Machine Learning Fundamentals",
    author: "Dr. Michael Chen",
    subject: "Computer Science",
    category: "Computer Science",
    available: true,
    borrowedBy: null,
    dueDate: null,
    coverColor: "bg-purple-100 dark:bg-purple-900/30"
  },
  {
    id: "book4",
    title: "Thermodynamics: Theory and Applications",
    author: "Prof. Sarah Johnson",
    subject: "Mechanical Engineering",
    category: "Engineering",
    available: true,
    borrowedBy: null,
    dueDate: null,
    coverColor: "bg-orange-100 dark:bg-orange-900/30"
  },
  {
    id: "book5",
    title: "Polymer Chemistry",
    author: "Dr. David Miller",
    subject: "Chemical Engineering",
    category: "Chemistry",
    available: false,
    borrowedBy: "faculty@example.com",
    dueDate: "2025-04-15",
    coverColor: "bg-red-100 dark:bg-red-900/30"
  },
  {
    id: "book6",
    title: "Aerodynamics and Flight Mechanics",
    author: "Prof. Lisa Zhang",
    subject: "Aerospace Engineering",
    category: "Engineering",
    available: true,
    borrowedBy: null,
    dueDate: null,
    coverColor: "bg-cyan-100 dark:bg-cyan-900/30"
  },
  {
    id: "book7",
    title: "Statistical Analysis in Psychology",
    author: "Dr. Robert Brown",
    subject: "Psychology",
    category: "Social Sciences",
    available: true,
    borrowedBy: null,
    dueDate: null,
    coverColor: "bg-rose-100 dark:bg-rose-900/30"
  },
  {
    id: "book8",
    title: "Contemporary Art Theory",
    author: "Prof. Maria Gonzalez",
    subject: "Art History",
    category: "Arts & Design",
    available: false,
    borrowedBy: "student@example.com",
    dueDate: "2025-04-18",
    coverColor: "bg-indigo-100 dark:bg-indigo-900/30"
  },
  {
    id: "book9",
    title: "Constitutional Law and Precedent",
    author: "Judge William Harrington",
    subject: "Law",
    category: "Law",
    available: true,
    borrowedBy: null,
    dueDate: null,
    coverColor: "bg-slate-100 dark:bg-slate-900/30"
  },
  {
    id: "book10",
    title: "Advanced Calculus and Applications",
    author: "Dr. Ada Lovelace",
    subject: "Mathematics",
    category: "Mathematics",
    available: true,
    borrowedBy: null,
    dueDate: null,
    coverColor: "bg-emerald-100 dark:bg-emerald-900/30"
  },
  {
    id: "book11",
    title: "Journal of Medical Research Vol. 42",
    author: "Various Authors",
    subject: "Medicine",
    category: "Journals & Articles",
    available: true,
    borrowedBy: null,
    dueDate: null,
    coverColor: "bg-pink-100 dark:bg-pink-900/30"
  },
  {
    id: "book12",
    title: "Business Leadership and Strategy",
    author: "Prof. Gordon Freeman",
    subject: "Business Management",
    category: "Business & Economics",
    available: false,
    borrowedBy: "faculty@example.com",
    dueDate: "2025-04-25",
    coverColor: "bg-amber-100 dark:bg-amber-900/30"
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
  },
  {
    id: "act5",
    type: "borrow",
    book: "Business Leadership and Strategy",
    user: "Prof. Michael Davis (faculty@example.com)",
    date: "2025-04-04",
    dueDate: "2025-04-25"
  },
  {
    id: "act6",
    type: "renew",
    book: "Contemporary Art Theory",
    user: "Alice Walker (student@example.com)",
    date: "2025-04-03",
    dueDate: "2025-04-18"
  }
];

// Available categories
const bookCategories = [
  { id: "all", name: "All Categories" },
  { id: "eng", name: "Engineering" },
  { id: "cs", name: "Computer Science" },
  { id: "math", name: "Mathematics" },
  { id: "phys", name: "Physics" },
  { id: "chem", name: "Chemistry" },
  { id: "bio", name: "Biology" },
  { id: "med", name: "Medicine" },
  { id: "arch", name: "Architecture" },
  { id: "biz", name: "Business & Economics" },
  { id: "soc", name: "Social Sciences" },
  { id: "hum", name: "Humanities" },
  { id: "art", name: "Arts & Design" },
  { id: "law", name: "Law" },
  { id: "jour", name: "Journals & Articles" },
];

const LibrarianDashboard = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(libraryBooks);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  
  useEffect(() => {
    // Filter books based on search query, category, and availability
    let filtered = libraryBooks;
    
    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        book => 
          book.title.toLowerCase().includes(query) || 
          book.author.toLowerCase().includes(query) || 
          book.subject.toLowerCase().includes(query) ||
          book.category.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (selectedCategory !== "all") {
      const category = bookCategories.find(c => c.id === selectedCategory)?.name;
      if (category) {
        filtered = filtered.filter(book => book.category === category);
      }
    }
    
    // Apply availability filter
    if (availabilityFilter !== "all") {
      const isAvailable = availabilityFilter === "available";
      filtered = filtered.filter(book => book.available === isAvailable);
    }
    
    setFilteredBooks(filtered);
  }, [searchQuery, selectedCategory, availabilityFilter]);

  const handleBookAction = (bookId: string, action: 'checkout' | 'return' | 'edit' | 'delete') => {
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
      case 'delete':
        toast.success(`Book removed from the library`);
        break;
    }
  };

  const handleAddNewBook = () => {
    toast.info("Coming soon: Add new book functionality");
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
              <Badge variant="outline" className="bg-primary/10 border-primary/20 dark:bg-primary/5 dark:border-primary/10">
                <Book className="h-3 w-3 mr-1" />
                Library Management
              </Badge>
              <Badge variant="outline" className="bg-primary/10 border-primary/20 dark:bg-primary/5 dark:border-primary/10">
                <Users className="h-3 w-3 mr-1" />
                Student Access
              </Badge>
              <Badge variant="outline" className="bg-primary/10 border-primary/20 dark:bg-primary/5 dark:border-primary/10">
                <GraduationCap className="h-3 w-3 mr-1" />
                Academic Resources
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card dark:bg-card/90">
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
            
            <Card className="bg-card dark:bg-card/90">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Available</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Book className="h-5 w-5 text-green-500 dark:text-green-400" />
                  <span className="text-3xl font-bold">
                    {libraryBooks.filter(book => book.available).length}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card dark:bg-card/90">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Checked Out</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                  <span className="text-3xl font-bold">
                    {libraryBooks.filter(book => !book.available).length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-8">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search books by title, author, or subject..." 
                    className="pl-10 w-full" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button className="bg-primary text-primary-foreground" onClick={handleAddNewBook}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Book
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-auto">
                  <Label htmlFor="category-filter" className="text-sm font-medium sr-only">Filter by Category</Label>
                  <Select
                    defaultValue="all"
                    onValueChange={setSelectedCategory}
                    value={selectedCategory}
                  >
                    <SelectTrigger id="category-filter" className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookCategories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full sm:w-auto">
                  <Label htmlFor="availability-filter" className="text-sm font-medium sr-only">Filter by Availability</Label>
                  <Select
                    defaultValue="all"
                    onValueChange={setAvailabilityFilter}
                    value={availabilityFilter}
                  >
                    <SelectTrigger id="availability-filter" className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Books</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="checkedout">Checked Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" size="icon" onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setAvailabilityFilter("all");
                }} className="ml-auto">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
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
                  <Card key={book.id} className={`border-l-4 ${book.coverColor} hover:shadow-md transition-shadow dark:bg-card/90`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-1">{book.title}</CardTitle>
                        <Badge variant={book.available ? "outline" : "secondary"} 
                          className={book.available ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"}>
                          {book.available ? "Available" : "Checked Out"}
                        </Badge>
                      </div>
                      <CardDescription>{book.author}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-col text-sm gap-1">
                        <div className="flex items-center">
                          <GraduationCap className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{book.subject}</span>
                        </div>
                        <div className="flex items-center">
                          <BookMarked className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{book.category}</span>
                        </div>
                      </div>
                      {!book.available && book.dueDate && (
                        <div className="text-sm text-orange-600 dark:text-orange-400 mt-2">
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
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        onClick={() => handleBookAction(book.id, 'delete')}
                      >
                        <Trash2 className="h-4 w-4" />
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
              <Card className="bg-card dark:bg-card/90">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Track book checkouts, returns and overdue items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors dark:bg-card/80 dark:hover:bg-accent/20">
                        <div className="flex-1 mb-2 sm:mb-0">
                          <div className="flex items-start sm:items-center gap-3">
                            {activity.type === 'borrow' && (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                                Borrowed
                              </Badge>
                            )}
                            {activity.type === 'return' && (
                              <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                                Returned
                              </Badge>
                            )}
                            {activity.type === 'overdue' && (
                              <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
                                Overdue
                              </Badge>
                            )}
                            {activity.type === 'renew' && (
                              <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800">
                                Renewed
                              </Badge>
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
                            <p className={activity.type === 'overdue' ? "text-red-600 dark:text-red-400" : ""}>
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
              <Card className="bg-card dark:bg-card/90">
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
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Button variant="outline" className="flex items-center gap-2">
                        <DownloadCloud className="h-4 w-4" />
                        <span>Import Videos</span>
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <FileVideo className="h-4 w-4" />
                        <span>Browse Catalog</span>
                      </Button>
                    </div>
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
