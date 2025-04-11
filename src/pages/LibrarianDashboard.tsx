
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
  Library, UserCheck, ClipboardCheck, Printer, ArrowLeft, RotateCcw, CheckSquare,
  ArrowUp, ArrowDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

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
    const updatedBooks = libraryBooks.map(book => {
      if (book.id === currentBook.id) {
        return {
          ...book,
          ...newBook,
          id: book.id // Ensure ID doesn't change
        } as LibraryBook;
      }
      return book;
    });
    
    // Create activity record
    const newActivity: LibraryActivity = {
      id: `act${Date.now()}`,
      type: "edit",
      book: newBook.title || "",
      user: user?.name || "Library Admin",
      date: new Date().toISOString().split('T')[0],
      dueDate: null,
      notes: "Updated book information"
    };
    
    // Update state
    setLibraryBooks(updatedBooks);
    setRecentActivities([newActivity, ...recentActivities]);
    setIsEditBookOpen(false);
    toast.success(`Book updated successfully`);
  };
  
  // Function to handle opening delete confirmation
  const handleDeleteBook = (bookId: string) => {
    const book = libraryBooks.find(b => b.id === bookId);
    if (book) {
      setCurrentBook(book);
      setIsDeleteBookOpen(true);
    }
  };
  
  // Function to confirm book deletion
  const handleDeleteConfirm = () => {
    if (!currentBook) return;
    
    // Remove book
    const updatedBooks = libraryBooks.filter(book => book.id !== currentBook.id);
    
    // Create activity record
    const newActivity: LibraryActivity = {
      id: `act${Date.now()}`,
      type: "delete",
      book: currentBook.title,
      user: user?.name || "Library Admin",
      date: new Date().toISOString().split('T')[0],
      dueDate: null,
      notes: "Book removed from library"
    };
    
    // Update state
    setLibraryBooks(updatedBooks);
    setRecentActivities([newActivity, ...recentActivities]);
    setIsDeleteBookOpen(false);
    toast.success(`Book removed from library`);
  };
  
  // Function to handle adding a new book
  const handleAddBook = () => {
    // Reset form
    setNewBook({
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
    
    // Open dialog
    setIsAddBookOpen(true);
  };
  
  // Function to save new book
  const handleAddBookSave = () => {
    if (!newBook.title || !newBook.author) {
      toast.error("Title and author are required");
      return;
    }
    
    // Create new book
    const newBookWithId = {
      ...newBook,
      id: `book${Date.now()}`,
      available: true,
      borrowedBy: null,
      dueDate: null,
      totalCopies: newBook.totalCopies || 1,
      availableCopies: newBook.availableCopies || 1
    } as LibraryBook;
    
    // Create activity record
    const newActivity: LibraryActivity = {
      id: `act${Date.now()}`,
      type: "add",
      book: newBook.title || "",
      user: user?.name || "Library Admin",
      date: new Date().toISOString().split('T')[0],
      dueDate: null,
      notes: "Added new book to library"
    };
    
    // Update state
    setLibraryBooks([newBookWithId, ...libraryBooks]);
    setRecentActivities([newActivity, ...recentActivities]);
    setIsAddBookOpen(false);
    toast.success(`Book added successfully`);
  };
  
  // Function to view book details
  const handleViewDetails = (bookId: string) => {
    const book = libraryBooks.find(b => b.id === bookId);
    if (book) {
      setDetailBook(book);
      setIsDetailViewOpen(true);
    }
  };
  
  // Function to handle form changes for new/edit book
  const handleBookFormChange = (field: keyof LibraryBook, value: any) => {
    setNewBook(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Function to toggle book selection for bulk actions
  const toggleBookSelection = (bookId: string) => {
    setSelectedBooks(prev => {
      if (prev.includes(bookId)) {
        return prev.filter(id => id !== bookId);
      } else {
        return [...prev, bookId];
      }
    });
  };
  
  // Function to handle bulk actions
  const handleBulkAction = () => {
    if (selectedBooks.length === 0) {
      toast.error("No books selected");
      return;
    }
    
    setIsBulkActionOpen(true);
  };
  
  // Function to execute bulk action
  const executeBulkAction = () => {
    if (bulkAction === "") {
      toast.error("Please select an action");
      return;
    }
    
    let updatedBooks = [...libraryBooks];
    const newActivities: LibraryActivity[] = [];
    
    if (bulkAction === "delete") {
      // Delete selected books
      updatedBooks = libraryBooks.filter(book => !selectedBooks.includes(book.id));
      
      // Create activity records
      selectedBooks.forEach(bookId => {
        const book = libraryBooks.find(b => b.id === bookId);
        if (book) {
          newActivities.push({
            id: `act${Date.now()}_${bookId}`,
            type: "delete",
            book: book.title,
            user: user?.name || "Library Admin",
            date: new Date().toISOString().split('T')[0],
            dueDate: null,
            notes: "Book removed as part of bulk action"
          });
        }
      });
      
      toast.success(`${selectedBooks.length} books removed from library`);
    }
    
    // Update state
    setLibraryBooks(updatedBooks);
    setRecentActivities([...newActivities, ...recentActivities]);
    setIsBulkActionOpen(false);
    setBulkAction("");
    setSelectedBooks([]);
  };

  // Function to apply advanced search
  const handleAdvancedSearch = () => {
    let filtered = libraryBooks;
    
    if (advancedSearch.title) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(advancedSearch.title.toLowerCase())
      );
    }
    
    if (advancedSearch.author) {
      filtered = filtered.filter(book => 
        book.author.toLowerCase().includes(advancedSearch.author.toLowerCase())
      );
    }
    
    if (advancedSearch.subject) {
      filtered = filtered.filter(book => 
        book.subject.toLowerCase().includes(advancedSearch.subject.toLowerCase())
      );
    }
    
    if (advancedSearch.category && advancedSearch.category !== "all") {
      filtered = filtered.filter(book => 
        book.category === advancedSearch.category
      );
    }
    
    if (advancedSearch.isbn) {
      filtered = filtered.filter(book => 
        book.isbn && book.isbn.includes(advancedSearch.isbn)
      );
    }
    
    if (advancedSearch.publisher) {
      filtered = filtered.filter(book => 
        book.publisher && book.publisher.toLowerCase().includes(advancedSearch.publisher.toLowerCase())
      );
    }
    
    if (advancedSearch.yearFrom && !isNaN(Number(advancedSearch.yearFrom))) {
      filtered = filtered.filter(book => 
        book.publishYear && Number(book.publishYear) >= Number(advancedSearch.yearFrom)
      );
    }
    
    if (advancedSearch.yearTo && !isNaN(Number(advancedSearch.yearTo))) {
      filtered = filtered.filter(book => 
        book.publishYear && Number(book.publishYear) <= Number(advancedSearch.yearTo)
      );
    }
    
    setFilteredBooks(filtered);
    setIsAdvancedSearchOpen(false);
    toast.success(`Found ${filtered.length} matching books`);
  };
  
  // Function to reset advanced search
  const handleResetSearch = () => {
    setAdvancedSearch({
      title: "",
      author: "",
      subject: "",
      category: "",
      isbn: "",
      publisher: "",
      yearFrom: "",
      yearTo: ""
    });
    
    setFilteredBooks(libraryBooks);
    setIsAdvancedSearchOpen(false);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      
      <main className="flex-grow container px-4 py-8 mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Library Management</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage books, track borrowing, and monitor library activities
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <Button onClick={handleAddBook} className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-1 h-4 w-4" /> Add Book
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleBulkAction}
              disabled={selectedBooks.length === 0}
              className={selectedBooks.length > 0 ? "border-blue-600 text-blue-600" : ""}
            >
              <CheckSquare className="mr-1 h-4 w-4" /> 
              Bulk Actions {selectedBooks.length > 0 && `(${selectedBooks.length})`}
            </Button>
          </div>
        </div>
        
        {/* Library Tabs */}
        <Tabs defaultValue="books" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="books">
              <Book className="mr-2 h-4 w-4" /> Books Inventory
            </TabsTrigger>
            <TabsTrigger value="activities">
              <History className="mr-2 h-4 w-4" /> Recent Activities
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="mr-2 h-4 w-4" /> Reports
            </TabsTrigger>
          </TabsList>
          
          {/* Books Tab */}
          <TabsContent value="books" className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search books by title, author, or subject..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
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
                
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger className="w-[180px]">
                    <BookOpenCheck className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Books</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="borrowed">Borrowed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  onClick={() => setIsAdvancedSearchOpen(true)}
                >
                  <ListFilter className="mr-2 h-4 w-4" />
                  Advanced
                </Button>
              </div>
            </div>
            
            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.length > 0 ? filteredBooks.map((book, index) => (
                <Card 
                  key={book.id} 
                  className={`border overflow-hidden transition-all duration-300 ${book.coverColor} ${
                    animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="line-clamp-1 text-lg font-bold">
                          {book.title}
                        </CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {book.author}
                        </CardDescription>
                      </div>
                      <Checkbox
                        checked={selectedBooks.includes(book.id)}
                        onCheckedChange={() => toggleBookSelection(book.id)}
                        aria-label={`Select ${book.title}`}
                      />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Subject:</span>
                        <span className="text-sm font-medium">{book.subject}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Category:</span>
                        <span className="text-sm font-medium">{book.category}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                        <Badge variant={book.available ? "outline" : "secondary"}>
                          {book.available ? "Available" : "Borrowed"}
                        </Badge>
                      </div>
                      
                      {!book.available && book.dueDate && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Due:</span>
                          <span className="text-sm font-medium">{book.dueDate}</span>
                        </div>
                      )}
                      
                      {book.totalCopies && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Copies:</span>
                          <span className="text-sm font-medium">
                            {book.availableCopies} / {book.totalCopies}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-wrap gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewDetails(book.id)}
                    >
                      <Book className="h-4 w-4 mr-1" /> Details
                    </Button>
                    {book.available ? (
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => handleCheckout(book.id)}
                      >
                        <BookMarked className="h-4 w-4 mr-1" /> Checkout
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => handleReturn(book.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" /> Return
                      </Button>
                    )}
                    <div className="flex ml-auto gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => handleEditBook(book.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">No books found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                    Try adjusting your search or filter criteria, or add some new books to your library.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={handleResetSearch}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Activities Tab */}
          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <History className="mr-2 h-5 w-5" /> Recent Library Activities
                </CardTitle>
                <CardDescription>
                  Track book checkouts, returns, and other library management activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivities.map(activity => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`
                              ${activity.type === 'borrow' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                              ${activity.type === 'return' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}
                              ${activity.type === 'overdue' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : ''}
                              ${activity.type === 'renew' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : ''}
                              ${activity.type === 'edit' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : ''}
                              ${activity.type === 'add' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' : ''}
                              ${activity.type === 'delete' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300' : ''}
                            `}
                          >
                            {activity.type === 'borrow' && <BookMarked className="mr-1 h-3 w-3 inline" />}
                            {activity.type === 'return' && <RefreshCw className="mr-1 h-3 w-3 inline" />}
                            {activity.type === 'overdue' && <AlertCircle className="mr-1 h-3 w-3 inline" />}
                            {activity.type === 'renew' && <RotateCcw className="mr-1 h-3 w-3 inline" />}
                            {activity.type === 'edit' && <Edit className="mr-1 h-3 w-3 inline" />}
                            {activity.type === 'add' && <Plus className="mr-1 h-3 w-3 inline" />}
                            {activity.type === 'delete' && <Trash2 className="mr-1 h-3 w-3 inline" />}
                            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{activity.book}</TableCell>
                        <TableCell>{activity.user}</TableCell>
                        <TableCell>{activity.date}</TableCell>
                        <TableCell>{activity.dueDate || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" /> Books Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Books:</span>
                      <Badge variant="secondary">{libraryBooks.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Available:</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {libraryBooks.filter(b => b.available).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Borrowed:</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {libraryBooks.filter(b => !b.available).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Engineering Books:</span>
                      <Badge variant="outline">
                        {libraryBooks.filter(b => b.category === "Engineering").length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Computer Science:</span>
                      <Badge variant="outline">
                        {libraryBooks.filter(b => b.category === "Computer Science").length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <DownloadCloud className="mr-2 h-4 w-4" /> Export Report
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Users className="mr-2 h-5 w-5" /> Borrower Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Student Borrowers:</span>
                      <Badge variant="secondary">
                        {recentActivities.filter(a => a.type === "borrow" && a.user.includes("student")).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Faculty Borrowers:</span>
                      <Badge variant="secondary">
                        {recentActivities.filter(a => a.type === "borrow" && a.user.includes("faculty")).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Checkouts:</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {libraryBooks.filter(b => !b.available).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Overdue Items:</span>
                      <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        {recentActivities.filter(a => a.type === "overdue").length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <DownloadCloud className="mr-2 h-4 w-4" /> Export Report
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="mr-2 h-5 w-5" /> Activity Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Today's Checkouts:</span>
                      <Badge variant="secondary">
                        {recentActivities.filter(a => 
                          a.type === "borrow" && 
                          a.date === new Date().toISOString().split('T')[0]
                        ).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Today's Returns:</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {recentActivities.filter(a => 
                          a.type === "return" && 
                          a.date === new Date().toISOString().split('T')[0]
                        ).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>New Books Added:</span>
                      <Badge variant="outline" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                        {recentActivities.filter(a => a.type === "add").length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Books Updated:</span>
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        {recentActivities.filter(a => a.type === "edit").length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <DownloadCloud className="mr-2 h-4 w-4" /> Export Report
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Dialogs */}
      
      {/* Add Book Dialog */}
      <Dialog open={isAddBookOpen} onOpenChange={setIsAddBookOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
            <DialogDescription>
              Enter the details of the book you want to add to the library.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                value={newBook.title || ""}
                onChange={e => handleBookFormChange("title", e.target.value)}
                placeholder="Book title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Author <span className="text-red-500">*</span></Label>
              <Input
                id="author"
                value={newBook.author || ""}
                onChange={e => handleBookFormChange("author", e.target.value)}
                placeholder="Author name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={newBook.subject || ""}
                onChange={e => handleBookFormChange("subject", e.target.value)}
                placeholder="Subject area"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={newBook.category} 
                onValueChange={value => handleBookFormChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {bookCategories.filter(c => c.id !== "all").map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={newBook.isbn || ""}
                onChange={e => handleBookFormChange("isbn", e.target.value)}
                placeholder="ISBN"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="publishYear">Publication Year</Label>
              <Input
                id="publishYear"
                value={newBook.publishYear || ""}
                onChange={e => handleBookFormChange("publishYear", e.target.value)}
                placeholder="Year"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Select 
                value={newBook.publisher} 
                onValueChange={value => handleBookFormChange("publisher", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select publisher" />
                </SelectTrigger>
                <SelectContent>
                  {publishers.map(publisher => (
                    <SelectItem key={publisher} value={publisher}>
                      {publisher}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select 
                value={newBook.location} 
                onValueChange={value => handleBookFormChange("location", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {libraryLocations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalCopies">Total Copies</Label>
              <Input
                id="totalCopies"
                type="number"
                min="1"
                value={newBook.totalCopies || 1}
                onChange={e => handleBookFormChange("totalCopies", parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverColor">Cover Color</Label>
              <Select 
                value={newBook.coverColor} 
                onValueChange={value => handleBookFormChange("coverColor", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bg-blue-100 dark:bg-blue-900/30">Blue</SelectItem>
                  <SelectItem value="bg-green-100 dark:bg-green-900/30">Green</SelectItem>
                  <SelectItem value="bg-red-100 dark:bg-red-900/30">Red</SelectItem>
                  <SelectItem value="bg-yellow-100 dark:bg-yellow-900/30">Yellow</SelectItem>
                  <SelectItem value="bg-purple-100 dark:bg-purple-900/30">Purple</SelectItem>
                  <SelectItem value="bg-pink-100 dark:bg-pink-900/30">Pink</SelectItem>
                  <SelectItem value="bg-orange-100 dark:bg-orange-900/30">Orange</SelectItem>
                  <SelectItem value="bg-teal-100 dark:bg-teal-900/30">Teal</SelectItem>
                  <SelectItem value="bg-slate-100 dark:bg-slate-900/30">Gray</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 col-span-full">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newBook.description || ""}
                onChange={e => handleBookFormChange("description", e.target.value)}
                placeholder="Book description"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddBookOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBookSave}>
              Add Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Book Dialog */}
      <Dialog open={isEditBookOpen} onOpenChange={setIsEditBookOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>
              Update the details of this book.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="edit-title"
                value={newBook.title || ""}
                onChange={e => handleBookFormChange("title", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-author">Author <span className="text-red-500">*</span></Label>
              <Input
                id="edit-author"
                value={newBook.author || ""}
                onChange={e => handleBookFormChange("author", e.target.value)}
              />
            </div>
            
            {/* Similar fields as Add Book dialog */}
            <div className="space-y-2">
              <Label htmlFor="edit-subject">Subject</Label>
              <Input
                id="edit-subject"
                value={newBook.subject || ""}
                onChange={e => handleBookFormChange("subject", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select 
                value={newBook.category} 
                onValueChange={value => handleBookFormChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {bookCategories.filter(c => c.id !== "all").map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-isbn">ISBN</Label>
              <Input
                id="edit-isbn"
                value={newBook.isbn || ""}
                onChange={e => handleBookFormChange("isbn", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-publishYear">Publication Year</Label>
              <Input
                id="edit-publishYear"
                value={newBook.publishYear || ""}
                onChange={e => handleBookFormChange("publishYear", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-publisher">Publisher</Label>
              <Select 
                value={newBook.publisher} 
                onValueChange={value => handleBookFormChange("publisher", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select publisher" />
                </SelectTrigger>
                <SelectContent>
                  {publishers.map(publisher => (
                    <SelectItem key={publisher} value={publisher}>
                      {publisher}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Select 
                value={newBook.location} 
                onValueChange={value => handleBookFormChange("location", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {libraryLocations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-totalCopies">Total Copies</Label>
              <Input
                id="edit-totalCopies"
                type="number"
                min="1"
                value={newBook.totalCopies || 1}
                onChange={e => handleBookFormChange("totalCopies", parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-coverColor">Cover Color</Label>
              <Select 
                value={newBook.coverColor} 
                onValueChange={value => handleBookFormChange("coverColor", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bg-blue-100 dark:bg-blue-900/30">Blue</SelectItem>
                  <SelectItem value="bg-green-100 dark:bg-green-900/30">Green</SelectItem>
                  <SelectItem value="bg-red-100 dark:bg-red-900/30">Red</SelectItem>
                  <SelectItem value="bg-yellow-100 dark:bg-yellow-900/30">Yellow</SelectItem>
                  <SelectItem value="bg-purple-100 dark:bg-purple-900/30">Purple</SelectItem>
                  <SelectItem value="bg-pink-100 dark:bg-pink-900/30">Pink</SelectItem>
                  <SelectItem value="bg-orange-100 dark:bg-orange-900/30">Orange</SelectItem>
                  <SelectItem value="bg-teal-100 dark:bg-teal-900/30">Teal</SelectItem>
                  <SelectItem value="bg-slate-100 dark:bg-slate-900/30">Gray</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 col-span-full">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={newBook.description || ""}
                onChange={e => handleBookFormChange("description", e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditBookOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Book Details Dialog */}
      <Dialog open={isDetailViewOpen} onOpenChange={setIsDetailViewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book Details</DialogTitle>
          </DialogHeader>
          
          {detailBook && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg mb-4 ${detailBook.coverColor}`}>
                <h2 className="text-2xl font-bold">{detailBook.title}</h2>
                <p className="text-lg">{detailBook.author}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</p>
                  <p>{detailBook.category}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Subject</p>
                  <p>{detailBook.subject}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ISBN</p>
                  <p>{detailBook.isbn || "N/A"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Publication Year</p>
                  <p>{detailBook.publishYear || "N/A"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Publisher</p>
                  <p>{detailBook.publisher || "N/A"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                  <p>{detailBook.location || "N/A"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                  <Badge variant={detailBook.available ? "outline" : "secondary"}>
                    {detailBook.available ? "Available" : "Borrowed"}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Copies</p>
                  <p>{detailBook.availableCopies} / {detailBook.totalCopies || 1}</p>
                </div>
                
                {!detailBook.available && (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Borrowed By</p>
                      <p>{detailBook.borrowedBy}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Due Date</p>
                      <p>{detailBook.dueDate}</p>
                    </div>
                  </>
                )}
                
                <div className="col-span-2 space-y-1 mt-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
                  <p className="text-sm">{detailBook.description || "No description available."}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {detailBook && detailBook.available ? (
              <Button onClick={() => {
                setIsDetailViewOpen(false);
                handleCheckout(detailBook.id);
              }}>
                <BookMarked className="mr-2 h-4 w-4" /> Checkout
              </Button>
            ) : detailBook && (
              <Button onClick={() => {
                setIsDetailViewOpen(false);
                handleReturn(detailBook.id);
              }}>
                <RefreshCw className="mr-2 h-4 w-4" /> Return
              </Button>
            )}
            
            <Button variant="outline" onClick={() => setIsDetailViewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Checkout Book</DialogTitle>
            <DialogDescription>
              Enter borrower details to check out "{currentBook?.title}".
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="borrowerEmail">Borrower Email <span className="text-red-500">*</span></Label>
              <Input
                id="borrowerEmail"
                value={checkoutDetails.borrowerEmail}
                onChange={e => setCheckoutDetails(prev => ({ ...prev, borrowerEmail: e.target.value }))}
                placeholder="user@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date <span className="text-red-500">*</span></Label>
              <Input
                id="dueDate"
                type="date"
                value={checkoutDetails.dueDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setCheckoutDetails(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
            
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <BookOpen className="h-4 w-4 mt-0.5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Book Information</h3>
                  <p className="mt-1">Available copies: {currentBook?.availableCopies}</p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCheckoutSubmit}>
              Checkout Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Return Book Dialog */}
      <Dialog open={isReturnBookOpen} onOpenChange={setIsReturnBookOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Return Book</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this book as returned?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
              <p><strong>Title:</strong> {currentBook?.title}</p>
              <p><strong>Borrowed by:</strong> {currentBook?.borrowedBy}</p>
              <p><strong>Due date:</strong> {currentBook?.dueDate}</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReturnBookOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReturnConfirm}>
              Confirm Return
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Book Dialog */}
      <Dialog open={isDeleteBookOpen} onOpenChange={setIsDeleteBookOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this book from the library? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-red-800 dark:text-red-200">
              <p><strong>Title:</strong> {currentBook?.title}</p>
              <p><strong>Author:</strong> {currentBook?.author}</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteBookOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete Book
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Action Dialog */}
      <Dialog open={isBulkActionOpen} onOpenChange={setIsBulkActionOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Bulk Actions</DialogTitle>
            <DialogDescription>
              Select an action to perform on {selectedBooks.length} selected books.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bulkAction">Action</Label>
              <Select value={bulkAction} onValueChange={value => setBulkAction(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delete">Delete Books</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3 text-sm text-amber-800 dark:text-amber-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Warning</h3>
                  <p className="mt-1">This action will affect {selectedBooks.length} books and cannot be undone.</p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkActionOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant={bulkAction === "delete" ? "destructive" : "default"}
              onClick={executeBulkAction}
              disabled={bulkAction === ""}
            >
              {bulkAction === "delete" ? "Delete Books" : "Apply Action"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Advanced Search Dialog */}
      <Dialog open={isAdvancedSearchOpen} onOpenChange={setIsAdvancedSearchOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Advanced Search</DialogTitle>
            <DialogDescription>
              Refine your search with multiple criteria.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="search-title">Title</Label>
              <Input
                id="search-title"
                value={advancedSearch.title}
                onChange={e => setAdvancedSearch(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Search by title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="search-author">Author</Label>
              <Input
                id="search-author"
                value={advancedSearch.author}
                onChange={e => setAdvancedSearch(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Search by author"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="search-subject">Subject</Label>
              <Input
                id="search-subject"
                value={advancedSearch.subject}
                onChange={e => setAdvancedSearch(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Search by subject"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="search-category">Category</Label>
              <Select 
                value={advancedSearch.category} 
                onValueChange={value => setAdvancedSearch(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {bookCategories.filter(c => c.id !== "all").map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="search-isbn">ISBN</Label>
              <Input
                id="search-isbn"
                value={advancedSearch.isbn}
                onChange={e => setAdvancedSearch(prev => ({ ...prev, isbn: e.target.value }))}
                placeholder="Search by ISBN"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="search-publisher">Publisher</Label>
              <Input
                id="search-publisher"
                value={advancedSearch.publisher}
                onChange={e => setAdvancedSearch(prev => ({ ...prev, publisher: e.target.value }))}
                placeholder="Search by publisher"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="search-yearFrom">From Year</Label>
              <Input
                id="search-yearFrom"
                value={advancedSearch.yearFrom}
                onChange={e => setAdvancedSearch(prev => ({ ...prev, yearFrom: e.target.value }))}
                placeholder="From year"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="search-yearTo">To Year</Label>
              <Input
                id="search-yearTo"
                value={advancedSearch.yearTo}
                onChange={e => setAdvancedSearch(prev => ({ ...prev, yearTo: e.target.value }))}
                placeholder="To year"
              />
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleResetSearch}>
              Reset
            </Button>
            <Button onClick={handleAdvancedSearch}>
              Search
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default LibrarianDashboard;
