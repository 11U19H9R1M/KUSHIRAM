import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Book, BookOpen, Edit, FileText, Plus, Search, Users, Video, GraduationCap, Trash2, 
  BookMarked, RefreshCw, Filter, DownloadCloud, Archive, FileVideo, BookCopy, 
  Microscope, Building, Briefcase, PenTool, Scale, Heart, BrainCircuit, Newspaper,
  CheckCircle, History, AlertCircle, UploadCloud, Calendar, ListFilter, BookOpenCheck,
  Library, UserCheck, ClipboardCheck, Printer, ArrowLeft, RotateCcw, CheckSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Interface for library books
interface LibraryBook {
  id: string;
  title: string;
  author: string;
  subject: string;
  category: string;
  available: boolean;
  borrowedBy: string | null;
  dueDate: string | null;
  coverColor: string;
  isbn?: string;
  publishYear?: string;
  publisher?: string;
  description?: string;
  location?: string;
  totalCopies?: number;
  availableCopies?: number;
}

// Interface for library activities
interface LibraryActivity {
  id: string;
  type: "borrow" | "return" | "overdue" | "renew" | "edit" | "add" | "delete";
  book: string;
  user: string;
  date: string;
  dueDate: string | null;
  notes?: string;
}

// Sample data for library books with expanded categories
const initialLibraryBooks: LibraryBook[] = [
  {
    id: "book1",
    title: "Advanced Control Systems",
    author: "Dr. Elena Rodriguez",
    subject: "Electrical Engineering",
    category: "Engineering",
    available: true,
    borrowedBy: null,
    dueDate: null,
    coverColor: "bg-blue-100 dark:bg-blue-900/30",
    isbn: "978-3-16-148410-0",
    publishYear: "2022",
    publisher: "Engineering Press",
    description: "A comprehensive guide to modern control systems with practical examples",
    location: "Floor 2, Shelf A3",
    totalCopies: 3,
    availableCopies: 3
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
    coverColor: "bg-green-100 dark:bg-green-900/30",
    isbn: "978-1-23-456789-0",
    publishYear: "2021",
    publisher: "Academic Publishing",
    description: "Advanced structural analysis techniques for civil engineers",
    location: "Floor 1, Shelf B7",
    totalCopies: 2,
    availableCopies: 1
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
    coverColor: "bg-purple-100 dark:bg-purple-900/30",
    isbn: "978-9-87-654321-0",
    publishYear: "2023",
    publisher: "Tech Science Books",
    description: "An introduction to machine learning algorithms and applications",
    location: "Floor 2, Shelf C2",
    totalCopies: 4,
    availableCopies: 4
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
    coverColor: "bg-orange-100 dark:bg-orange-900/30",
    isbn: "978-6-54-321098-7",
    publishYear: "2022",
    publisher: "Engineering Publications",
    description: "Comprehensive study of thermodynamics principles and engineering applications",
    location: "Floor 1, Shelf A4",
    totalCopies: 3,
    availableCopies: 3
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
    coverColor: "bg-red-100 dark:bg-red-900/30",
    isbn: "978-4-32-109876-5",
    publishYear: "2021",
    publisher: "Chemical Academic Press",
    description: "In-depth analysis of polymer synthesis, properties, and applications",
    location: "Floor 2, Shelf B5",
    totalCopies: 2,
    availableCopies: 1
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
    coverColor: "bg-cyan-100 dark:bg-cyan-900/30",
    isbn: "978-8-76-543210-9",
    publishYear: "2023",
    publisher: "Aeronautical Publishers",
    description: "Principles of aerodynamics and their application to flight mechanics",
    location: "Floor 1, Shelf C6",
    totalCopies: 4,
    availableCopies: 4
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
    coverColor: "bg-rose-100 dark:bg-rose-900/30",
    isbn: "978-2-34-567890-1",
    publishYear: "2022",
    publisher: "Behavioral Science Press",
    description: "Statistical methods for psychological research and data analysis",
    location: "Floor 3, Shelf D1",
    totalCopies: 3,
    availableCopies: 3
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
    coverColor: "bg-indigo-100 dark:bg-indigo-900/30",
    isbn: "978-7-89-012345-6",
    publishYear: "2021",
    publisher: "Artistic Academic Publishing",
    description: "Exploration of contemporary art theories and their historical context",
    location: "Floor 3, Shelf E4",
    totalCopies: 2,
    availableCopies: 1
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
    coverColor: "bg-slate-100 dark:bg-slate-900/30",
    isbn: "978-5-43-210987-3",
    publishYear: "2023",
    publisher: "Legal Studies Publications",
    description: "Analysis of constitutional law principles and landmark precedents",
    location: "Floor 3, Shelf G7",
    totalCopies: 4,
    availableCopies: 4
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
    coverColor: "bg-emerald-100 dark:bg-emerald-900/30",
    isbn: "978-1-12-345678-8",
    publishYear: "2022",
    publisher: "Mathematical Academic Press",
    description: "Advanced calculus techniques and their applications in various fields",
    location: "Floor 2, Shelf H2",
    totalCopies: 3,
    availableCopies: 3
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
    coverColor: "bg-pink-100 dark:bg-pink-900/30",
    isbn: "ISSN 1234-5678",
    publishYear: "2024",
    publisher: "Medical Research Society",
    description: "Collection of articles on current medical research topics",
    location: "Reference Section",
    totalCopies: 10,
    availableCopies: 10
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
    coverColor: "bg-amber-100 dark:bg-amber-900/30",
    isbn: "978-3-34-567890-2",
    publishYear: "2021",
    publisher: "Business Academic Publishing",
    description: "Strategies and leadership principles for effective business management",
    location: "Floor 3, Shelf I5",
    totalCopies: 2,
    availableCopies: 1
  },
  {
    id: "book13",
    title: "The Art of Photography",
    author: "Elena Richards",
    subject: "Visual Arts",
    category: "Arts & Design",
    available: true,
    borrowedBy: null,
    dueDate: null,
    coverColor: "bg-violet-100 dark:bg-violet-900/30",
    isbn: "978-9-90-123456-7",
    publishYear: "2022",
    publisher: "Visual Arts Press",
    description: "Techniques and principles of artistic photography",
    location: "Floor 3, Shelf E2",
    totalCopies: 3,
    availableCopies: 3
  },
  {
    id: "book14",
    title: "Modern Poetry Analysis",
    author: "Dr. William Blake",
    subject: "Literature",
    category: "Poetry",
    available: true,
    borrowedBy: null,
    dueDate: null,
    coverColor: "bg-fuchsia-100 dark:bg-fuchsia-900/30",
    isbn: "978-6-67-890123-4",
    publishYear: "2023",
    publisher: "Literary Analysis Publications",
    description: "Critical analysis of modern poetry and its historical context",
    location: "Floor 3, Shelf F1",
    totalCopies: 4,
    availableCopies: 4
  },
  {
    id: "book15",
    title: "Database Design Patterns",
    author: "Prof. Alan Turing",
    subject: "Information Technology",
    category: "Computer Science",
    available: true,
    borrowedBy: null,
    dueDate: null,
    coverColor: "bg-blue-100 dark:bg-blue-900/30",
    isbn: "978-4-45-678901-5",
    publishYear: "2022",
    publisher: "Tech Science Books",
    description: "Common design patterns for database systems and applications",
    location: "Floor 2, Shelf C4",
    totalCopies: 3,
    availableCopies: 3
  },
  {
    id: "book16",
    title: "Introduction to Robotics",
    author: "Dr. Isaac Asimov",
    subject: "Robotics",
    category: "Engineering",
    available: false,
    borrowedBy: "student@example.com",
    dueDate: "2025-04-22",
    coverColor: "bg-teal-100 dark:bg-teal-900/30",
    isbn: "978-1-11-222333-6",
    publishYear: "2021",
    publisher: "Engineering Publications",
    description: "An introductory guide to the principles and applications of robotics",
    location: "Floor 1, Shelf A6",
    totalCopies: 2,
    availableCopies: 1
  },
  {
    id: "book17",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    subject: "American Literature",
    category: "Fiction",
    available: true,
    borrowedBy: null,
    dueDate: null,
    coverColor: "bg-yellow-100 dark:bg-yellow-900/30",
    isbn: "978-7-15-482913-7",
    publishYear: "1925",
    publisher: "Classic Books",
    description: "A classic novel depicting the Jazz Age in America",
    location: "Floor 3, Shelf F2",
    totalCopies: 5,
    availableCopies: 5
  },
  {
    id: "book18",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    subject: "American Literature",
    category: "Fiction",
    available: true,
    borrowedBy: null,
    dueDate: null,
    coverColor: "bg-purple-100 dark:bg-purple-900/30",
    isbn: "978-5-12-345678-9",
    publishYear: "1960",
    publisher: "Literary Classics",
    description: "A novel about racial injustice and moral growth in the American South",
    location: "Floor 3, Shelf F3",
    totalCopies: 4,
    availableCopies: 4
  },
  {
    id: "book19",
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    subject: "Children's Literature",
    category: "Children's Books",
    available: true,
    borrowedBy: null,
    dueDate: null,
    coverColor: "bg-blue-100 dark:bg-blue-900/30",
    isbn: "978-2-17-563214-8",
    publishYear: "1943",
    publisher: "Children's Press",
    description: "A poetic tale about a young prince who visits various planets",
    location: "Floor 1, Shelf K1",
    totalCopies: 3,
    availableCopies: 3
  },
  {
    id: "book20",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    subject: "English Literature",
    category: "Fiction",
    available: false,
    borrowedBy: "faculty@example.com",
    dueDate: "2025-04-22",
    coverColor: "bg-pink-100 dark:bg-pink-900/30",
    isbn: "978-3-98-765432-1",
    publishYear: "1813",
    publisher: "Classic Literature",
    description: "A romantic novel of manners set in early 19th-century England",
    location: "Floor 3, Shelf F4",
    totalCopies: 3,
    availableCopies: 2
  }
];

// Sample data for recent activities
const initialRecentActivities: LibraryActivity[] = [
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
  },
  {
    id: "act7",
    type: "borrow",
    book: "Modern Poetry Analysis",
    user: "Thomas Reed (student@example.com)",
    date: "2025-04-05",
    dueDate: "2025-04-26"
  },
  {
    id: "act8",
    type: "return",
    book: "Introduction to Robotics",
    user: "Jennifer Kim (faculty@example.com)",
    date: "2025-04-06",
    dueDate: null
  },
  {
    id: "act9",
    type: "add",
    book: "The Great Gatsby",
    user: "Library Admin (librarian@library.com)",
    date: "2025-04-07",
    dueDate: null,
    notes: "Added new classic literature collection"
  },
  {
    id: "act10",
    type: "edit",
    book: "Machine Learning Fundamentals",
    user: "Library Admin (librarian@library.com)",
    date: "2025-04-08",
    dueDate: null,
    notes: "Updated book information and location"
  }
];

// Available categories - expanded list
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
  { id: "text", name: "Textbooks" },
  { id: "ref", name: "Reference Books" },
  { id: "jour", name: "Journals & Articles" },
  { id: "ebook", name: "E-books" },
  { id: "research", name: "Research Reports" },
  { id: "guide", name: "Guides & Manuals" },
  { id: "case", name: "Case Studies" },
  { id: "thesis", name: "Theses & Dissertations" },
  { id: "fiction", name: "Fiction" },
  { id: "nonfiction", name: "Non-Fiction" },
  { id: "poetry", name: "Poetry" },
  { id: "drama", name: "Drama & Plays" },
  { id: "children", name: "Children's Books" },
  { id: "ya", name: "Young Adult (YA)" },
  { id: "rare", name: "Rare Books" },
  { id: "archive", name: "Archived Materials" },
  { id: "digital", name: "Digital Archives" },
];

// Library locations for book storage
const libraryLocations = [
  "Floor 1, Shelf A1",
  "Floor 1, Shelf A2",
  "Floor 1, Shelf B1",
  "Floor 1, Shelf B2",
  "Floor 2, Shelf A1",
  "Floor 2, Shelf A2",
  "Floor 2, Shelf B1",
  "Floor 2, Shelf B2",
  "Floor 3, Shelf A1",
  "Floor 3, Shelf A2",
  "Floor 3, Shelf B1",
  "Floor 3, Shelf B2",
  "Rare Books Collection",
  "Digital Archives",
  "Reference Section",
  "Children's Section"
];

// Publishers list
const publishers = [
  "Academic Press",
  "Cambridge University Press",
  "Oxford University Press",
  "Pearson Education",
  "McGraw-Hill Education",
  "Wiley",
  "Springer",
  "Elsevier",
  "HarperCollins",
  "Penguin Random House",
  "Simon & Schuster",
  "MIT Press",
  "Yale University Press",
  "Harvard University Press",
  "Other"
];

const LibrarianDashboard = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [libraryBooks, setLibraryBooks] = useState<LibraryBook[]>(initialLibraryBooks);
  const [recentActivities, setRecentActivities] = useState<LibraryActivity[]>(initialRecentActivities);
  const [filteredBooks, setFilteredBooks] = useState<LibraryBook[]>(initialLibraryBooks);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [animateCards, setAnimateCards] = useState(false);
  
  // State for add/edit book dialog
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isEditBookOpen, setIsEditBookOpen] = useState(false);
  const [isDeleteBookOpen, setIsDeleteBookOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReturnBookOpen, setIsReturnBookOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<LibraryBook | null>(null);
  
  // State for new book form
  const [newBook, setNewBook] = useState<Partial<LibraryBook>>({
    title: "",
    author: "",
    subject: "",
    category: "",
    isbn: "",
    publishYear: "",
    publisher: "",
    description: "",
    location: "",
    coverColor: "bg-blue-100 dark:bg-blue-900/30",
    available: true,
    totalCopies: 1,
    availableCopies: 1
  });
  
  // State for checkout form
  const [checkoutDetails, setCheckoutDetails] = useState({
    borrowerEmail: "",
    dueDate: ""
  });
  
  // State for detailed view
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [detailBook, setDetailBook] = useState<LibraryBook | null>(null);
  
  // State for sorting
  const [sortField, setSortField] = useState<keyof LibraryBook>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // State for bulk actions
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<"checkout" | "return" | "delete" | "">("");
  
  // State for advanced search
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [advancedSearch, setAdvancedSearch] = useState({
    title: "",
    author: "",
    subject: "",
    category: "",
    isbn: "",
    publisher: "",
    yearFrom: "",
    yearTo: ""
  });
  
  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => {
      setAnimateCards(true);
    }, 300);
  }, []);
  
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
          book.category.toLowerCase().includes(query) ||
          (book.isbn && book.isbn.toLowerCase().includes(query))
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
    
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      // Handle string comparison
      if (typeof a[sortField] === 'string' && typeof b[sortField] === 'string') {
        const valueA = (a[sortField] as string).toLowerCase();
        const valueB = (b[sortField] as string).toLowerCase();
        if (sortDirection === 'asc') {
          return valueA.localeCompare(valueB);
        } else {
          return valueB.localeCompare(valueA);
        }
      }
      
      // Handle boolean comparison
      if (typeof a[sortField] === 'boolean' && typeof b[sortField] === 'boolean') {
        const valueA = a[sortField] as boolean;
        const valueB = b[sortField] as boolean;
        if (sortDirection === 'asc') {
          return valueA === valueB ? 0 : valueA ? -1 : 1;
        } else {
          return valueA === valueB ? 0 : valueA ? 1 : -1;
        }
      }
      
      // Handle number comparison
      if (typeof a[sortField] === 'number' && typeof b[sortField] === 'number') {
        const valueA = a[sortField] as number;
        const valueB = b[sortField] as number;
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
      
      // Default return if types don't match or are null/undefined
      return 0;
    });
    
    setFilteredBooks(filtered);
  }, [libraryBooks, searchQuery, selectedCategory, availabilityFilter, sortField, sortDirection]);

  // Function to handle book checkout
  const handleCheckout = (bookId: string) => {
    const book = libraryBooks.find(b => b.id === bookId);
    if (book) {
      setCurrentBook(book);
      setIsCheckoutOpen(true);
    }
  };
  
  // Function to handle submitting checkout
  const handleCheckoutSubmit = () => {
    if (!currentBook || !checkoutDetails.borrowerEmail || !checkoutDetails.dueDate) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Update book
    const updatedBooks = libraryBooks.map(book => {
      if (book.id === currentBook.id) {
        const availableCopies = book.availableCopies ? book.availableCopies - 1 : 0;
        return {
          ...book,
          available: availableCopies > 0,
          borrowedBy: checkoutDetails.borrowerEmail,
          dueDate: checkoutDetails.dueDate,
          availableCopies
        };
      }
      return book;
    });
    
    // Create activity record
    const newActivity: LibraryActivity = {
      id: `act${Date.now()}`,
      type: "borrow",
      book: currentBook.title,
      user: `${checkoutDetails.borrowerEmail}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: checkoutDetails.dueDate
    };
    
    // Update state
    setLibraryBooks(updatedBooks);
    setRecentActivities([newActivity, ...recentActivities]);
    setIsCheckoutOpen(false);
    setCheckoutDetails({ borrowerEmail: "", dueDate: "" });
    toast.success(`Book checked out to ${checkoutDetails.borrowerEmail}`);
  };
  
  // Function to handle book return
  const handleReturn = (bookId: string) => {
    const book = libraryBooks.find(b => b.id === bookId);
    if (book) {
      setCurrentBook(book);
      setIsReturnBookOpen(true);
    }
  };
  
  // Function to confirm book return
  const handleReturnConfirm = () => {
    if (!currentBook) return;
    
    // Update book
    const updatedBooks = libraryBooks.map(book => {
      if (book.id === currentBook.id) {
        const availableCopies = book.availableCopies ? book.availableCopies + 1 : 1;
        return {
          ...book,
          available: true,
          borrowedBy: null,
          dueDate: null,
          availableCopies
        };
      }
      return book;
    });
    
    // Create activity record
    const newActivity: LibraryActivity = {
      id: `act${Date.now()}`,
      type: "return",
      book: currentBook.title,
      user: currentBook.borrowedBy || "Unknown",
      date: new Date().toISOString().split('T')[0],
      dueDate: null
    };
    
    // Update state
    setLibraryBooks(updatedBooks);
    setRecentActivities([newActivity, ...recentActivities]);
    setIsReturnBookOpen(false);
    toast.success(`Book marked as returned`);
  };
  
  // Function to handle edit book
  const handleEditBook = (bookId: string) => {
    const book = libraryBooks.find(b => b.id === bookId);
    if (book) {
      setCurrentBook(book);
      setNewBook(book);
      setIsEditBookOpen(true);
    }
  };
  
  // Function to handle saving edited book
  const handleEditSave = () => {
    if (!currentBook || !newBook.title || !newBook.author) {
      toast.error("Title and author are required");
      return;
    }
    
    // Update book
    const updatedBooks =
