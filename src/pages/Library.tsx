import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Bookmark, BookOpen, Laptop, Video, Search, Clock, Award, GraduationCap, BookA, Newspaper, Lock, FileText, Book as BookIcon, Archive, FileVideo, BookCopy, Microscope, Building, Briefcase, PenTool, Scale, Heart, BrainCircuit, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

// Updated categories for books
const bookCategories = [
  {
    id: "eng",
    title: "Engineering",
    books: 215,
    videos: 78,
    icon: <GraduationCap className="h-8 w-8 text-orange-500 dark:text-orange-400" />,
    color: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800"
  },
  {
    id: "cs",
    title: "Computer Science",
    books: 212,
    videos: 137,
    icon: <BrainCircuit className="h-8 w-8 text-purple-500 dark:text-purple-400" />,
    color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
  },
  {
    id: "math",
    title: "Mathematics",
    books: 158,
    videos: 92,
    icon: <BookIcon className="h-8 w-8 text-blue-500 dark:text-blue-400" />,
    color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
  },
  {
    id: "phys",
    title: "Physics",
    books: 130,
    videos: 67,
    icon: <Microscope className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />,
    color: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
  },
  {
    id: "chem",
    title: "Chemistry",
    books: 95,
    videos: 59,
    icon: <BookIcon className="h-8 w-8 text-red-500 dark:text-red-400" />,
    color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
  },
  {
    id: "med",
    title: "Medicine",
    books: 112,
    videos: 46,
    icon: <Heart className="h-8 w-8 text-pink-500 dark:text-pink-400" />,
    color: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800"
  },
  {
    id: "biz",
    title: "Business & Economics",
    books: 142,
    videos: 53,
    icon: <Briefcase className="h-8 w-8 text-amber-500 dark:text-amber-400" />,
    color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
  },
  {
    id: "hum",
    title: "Humanities",
    books: 124,
    videos: 43,
    icon: <BookOpen className="h-8 w-8 text-rose-500 dark:text-rose-400" />,
    color: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800"
  },
  {
    id: "art",
    title: "Arts & Design",
    books: 97,
    videos: 35,
    icon: <PenTool className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />,
    color: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800"
  },
  {
    id: "law",
    title: "Law",
    books: 87,
    videos: 32,
    icon: <Scale className="h-8 w-8 text-slate-500 dark:text-slate-400" />,
    color: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-800"
  },
  {
    id: "arch",
    title: "Architecture",
    books: 79,
    videos: 28,
    icon: <Building className="h-8 w-8 text-cyan-500 dark:text-cyan-400" />,
    color: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800"
  },
  {
    id: "journal",
    title: "Journals & Articles",
    books: 215,
    videos: 12,
    icon: <Newspaper className="h-8 w-8 text-neutral-500 dark:text-neutral-400" />,
    color: "bg-neutral-100 text-neutral-800 border-neutral-200 dark:bg-neutral-900/30 dark:text-neutral-300 dark:border-neutral-800"
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

// New state for library tickets
interface LibraryTicket {
  id: string;
  bookTitle: string;
  issueDate: Date;
  status: "pending" | "collected" | "returned";
  pickupLocation: string;
  bookId: string;
}

const Library = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(bookCategories);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [tickets, setTickets] = useState<LibraryTicket[]>([]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load existing tickets from localStorage
    const storedTickets = localStorage.getItem(`user_${user?.id}_libraryTickets`);
    if (storedTickets) {
      try {
        const parsedTickets = JSON.parse(storedTickets);
        setTickets(parsedTickets.map((ticket: any) => ({
          ...ticket,
          issueDate: new Date(ticket.issueDate)
        })));
      } catch (error) {
        console.error("Error loading tickets:", error);
      }
    }
  }, [user?.id]);

  useEffect(() => {
    // Filter categories based on search query
    if (searchQuery.trim() === "") {
      setFilteredCategories(bookCategories);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = bookCategories.filter(
        category => category.title.toLowerCase().includes(query)
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality is already handled by the useEffect above
  };
  
  const handleCheckout = (bookInfo: any) => {
    setSelectedBook(bookInfo);
    setShowTicketDialog(true);
  };
  
  const generateTicket = () => {
    if (!selectedBook) return;
    
    const newTicket: LibraryTicket = {
      id: `ticket_${Date.now()}`,
      bookTitle: selectedBook.title,
      issueDate: new Date(),
      status: "pending", 
      pickupLocation: "Main Library Desk",
      bookId: selectedBook.id || `book_${Date.now()}`
    };
    
    // Add ticket to state
    const updatedTickets = [...tickets, newTicket];
    setTickets(updatedTickets);
    
    // Save to localStorage
    localStorage.setItem(
      `user_${user?.id}_libraryTickets`, 
      JSON.stringify(updatedTickets)
    );
    
    // Close dialog
    setShowTicketDialog(false);
    
    // Show success toast
    toast.success(
      `Ticket generated for "${selectedBook.title}". Please collect the book from the library desk.`,
      {
        duration: 5000,
      }
    );
  };

  // Define sample books for each category
  const sampleBooks = [
    {
      id: "book1",
      title: "Introduction to Machine Learning",
      author: "Dr. Alan Turing",
      category: "Computer Science",
      available: true
    },
    {
      id: "book2",
      title: "Circuit Analysis Fundamentals",
      author: "Prof. Marie Curie",
      category: "Electrical Engineering",
      available: true
    },
    {
      id: "book3",
      title: "Structural Mechanics",
      author: "Dr. Isaac Newton",
      category: "Civil Engineering",
      available: false
    }
  ];

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
                  Access academic resources, textbooks, journals, and recorded lectures
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
                  <Ticket className="h-3 w-3 mr-1" />
                  Library Tickets
                </Badge>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSearch} className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search for resources, books, or videos..." 
                className="pl-10 w-full" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="bg-primary text-primary-foreground">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
          
          <Tabs defaultValue="subjects" className="w-full mb-8">
            <TabsList className="grid grid-cols-4 mb-6 w-full md:w-fit">
              <TabsTrigger value="subjects" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                <span className="hidden sm:inline">Categories</span>
                <span className="sm:hidden">Categories</span>
              </TabsTrigger>
              <TabsTrigger value="books" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Books</span>
                <span className="sm:hidden">Books</span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span className="hidden sm:inline">Video Lectures</span>
                <span className="sm:hidden">Videos</span>
              </TabsTrigger>
              <TabsTrigger value="tickets" className="flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                <span className="hidden sm:inline">My Tickets</span>
                <span className="sm:hidden">Tickets</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="subjects">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                  <Card key={category.id} className="hover:shadow-lg transition-shadow duration-300 bg-card dark:bg-card/90">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          {category.icon}
                          <CardTitle className="text-lg">{category.title}</CardTitle>
                        </div>
                        <Badge className={category.color}>{category.books} Resources</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{category.books} Books</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Laptop className="h-4 w-4" />
                          <span>{category.videos} Videos</span>
                        </div>
                      </div>
                      <Button className="w-full" onClick={() => document.querySelector('button[value="books"]')?.click()}>Browse Resources</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredCategories.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No categories found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="books">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleBooks.map((book) => (
                  <Card key={book.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg">{book.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-2 mt-1">
                          <Award className="h-4 w-4" />
                          <span>{book.author}</span>
                        </div>
                        <Badge variant="outline" className="mt-2">
                          {book.category}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center">
                      <div className="text-sm">
                        {book.available ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                            Checked Out
                          </Badge>
                        )}
                      </div>
                      <Button 
                        onClick={() => handleCheckout(book)}
                        disabled={!book.available}
                      >
                        <Ticket className="h-4 w-4 mr-2" />
                        Get Ticket
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="videos">
              <Card className="bg-card dark:bg-card/90">
                <CardHeader>
                  <CardTitle>Recent Video Lectures</CardTitle>
                  <CardDescription>
                    Watch recorded classes and demonstrations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentVideos.map((video) => (
                      <div key={video.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors dark:bg-card/80 dark:hover:bg-accent/20">
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
            
            <TabsContent value="tickets">
              {tickets.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">Your Library Tickets</h3>
                  {tickets.map((ticket) => (
                    <Card key={ticket.id} className="overflow-hidden">
                      <div className="flex border-l-4 border-primary">
                        <div className="p-4 flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div>
                              <h3 className="font-medium text-lg">{ticket.bookTitle}</h3>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Ticket className="h-3 w-3" />
                                  Ticket #{ticket.id.split('_')[1]}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {ticket.issueDate.toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Building className="h-3 w-3" />
                                  {ticket.pickupLocation}
                                </span>
                              </div>
                            </div>
                            <Badge className={
                              ticket.status === "pending" 
                                ? "bg-amber-100 text-amber-800 border-amber-200"
                                : ticket.status === "collected"
                                ? "bg-blue-100 text-blue-800 border-blue-200" 
                                : "bg-green-100 text-green-800 border-green-200"
                            }>
                              {ticket.status === "pending" 
                                ? "Ready for Pickup" 
                                : ticket.status === "collected" 
                                ? "Collected" 
                                : "Returned"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Ticket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-medium mb-2">No library tickets yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Browse the library and get tickets for books you want to check out
                  </p>
                  <Button variant="outline" onClick={() => {
                    const element = document.querySelector('button[value="books"]');
                    if (element) {
                      (element as HTMLElement).click();
                    }
                  }}>
                    Browse Books
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <Card className="mb-8 bg-card dark:bg-card/90">
            <CardHeader>
              <CardTitle>Recommended For You</CardTitle>
              <CardDescription>Based on your academic profile and recent activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-primary/20 dark:bg-card/80">
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
                    <Button className="w-full" size="sm" variant="outline" onClick={() => handleCheckout({
                      id: "rec1",
                      title: "Introduction to Machine Learning",
                      author: "Dr. Alan Turing",
                      category: "Computer Science",
                      available: true
                    })}>
                      Get Book Ticket
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/20 dark:bg-card/80">
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
                    <Button className="w-full" size="sm" variant="outline" onClick={() => handleCheckout({
                      id: "rec2",
                      title: "Circuit Analysis Fundamentals",
                      author: "Prof. Marie Curie",
                      category: "Electrical Engineering",
                      available: true
                    })}>
                      Get Book Ticket
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/20 dark:bg-card/80">
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
                    <Button className="w-full" size="sm" variant="outline" onClick={() => handleCheckout({
                      id: "rec3",
                      title: "Structural Mechanics",
                      author: "Dr. Isaac Newton",
                      category: "Civil Engineering",
                      available: true
                    })}>
                      Get Book Ticket
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      
      {/* Ticket Dialog */}
      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Library Ticket</DialogTitle>
            <DialogDescription>
              This ticket will allow you to pick up the physical book from the library.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBook && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                  <Book className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{selectedBook.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedBook.author}</p>
                  <Badge variant="outline" className="mt-1">{selectedBook.category}</Badge>
                </div>
              </div>
              
              <div className="space-y-2 border-t border-b py-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Pickup Location</span>
                  <span className="font-medium">Main Library Desk</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Available Until</span>
                  <span className="font-medium">End of Day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Loan Period</span>
                  <span className="font-medium">14 days</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTicketDialog(false)}>Cancel</Button>
            <Button onClick={generateTicket}>
              <Ticket className="h-4 w-4 mr-2" />
              Generate Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Library;
