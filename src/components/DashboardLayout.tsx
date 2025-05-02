import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isFaculty = user?.role === "faculty" || user?.role === "admin";
  const isStudent = user?.role === "student";
  const isLibrarian = user?.role === "librarian";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link to="/dashboard" className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block">Academic Vault</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                to="/dashboard"
                className={`transition-colors hover:text-foreground/80 ${location.pathname === '/dashboard' ? 'text-foreground' : 'text-foreground/60'}`}
              >
                Dashboard
              </Link>
              
              {/* Faculty-specific navigation */}
              {isFaculty && (
                <Link
                  to="/faculty-assignments"
                  className={`transition-colors hover:text-foreground/80 ${location.pathname === '/faculty-assignments' ? 'text-foreground' : 'text-foreground/60'}`}
                >
                  Assignments
                </Link>
              )}
              
              {/* Student-specific navigation */}
              {isStudent && (
                <Link
                  to="/student-assignments"
                  className={`transition-colors hover:text-foreground/80 ${location.pathname === '/student-assignments' ? 'text-foreground' : 'text-foreground/60'}`}
                >
                  Assignments
                </Link>
              )}
              
              <Link
                to="/time-vault"
                className={`transition-colors hover:text-foreground/80 ${location.pathname === '/time-vault' ? 'text-foreground' : 'text-foreground/60'}`}
              >
                Time Vault
              </Link>
              <Link
                to="/library"
                className={`transition-colors hover:text-foreground/80 ${location.pathname === '/library' ? 'text-foreground' : 'text-foreground/60'}`}
              >
                Library
              </Link>
              {/* Conditional links based on user role */}
              {isLibrarian && (
                <Link
                  to="/librarian"
                  className={`transition-colors hover:text-foreground/80 ${location.pathname === '/librarian' ? 'text-foreground' : 'text-foreground/60'}`}
                >
                  Librarian Tools
                </Link>
              )}
            </nav>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Sheet>
              <SheetTrigger className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-64">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate through the application
                  </SheetDescription>
                </SheetHeader>
                <nav className="grid gap-4 py-4">
                  <Link
                    to="/dashboard"
                    className={`flex items-center space-x-2 rounded-md p-2 hover:bg-secondary ${location.pathname === '/dashboard' ? 'bg-secondary text-foreground' : 'text-foreground/60'}`}
                  >
                    <span>Dashboard</span>
                  </Link>
                  {isFaculty && (
                    <Link
                      to="/faculty-assignments"
                      className={`flex items-center space-x-2 rounded-md p-2 hover:bg-secondary ${location.pathname === '/faculty-assignments' ? 'bg-secondary text-foreground' : 'text-foreground/60'}`}
                    >
                      <span>Assignments</span>
                    </Link>
                  )}
                  {isStudent && (
                    <Link
                      to="/student-assignments"
                      className={`flex items-center space-x-2 rounded-md p-2 hover:bg-secondary ${location.pathname === '/student-assignments' ? 'bg-secondary text-foreground' : 'text-foreground/60'}`}
                    >
                      <span>Assignments</span>
                    </Link>
                  )}
                  <Link
                    to="/time-vault"
                    className={`flex items-center space-x-2 rounded-md p-2 hover:bg-secondary ${location.pathname === '/time-vault' ? 'bg-secondary text-foreground' : 'text-foreground/60'}`}
                  >
                    <span>Time Vault</span>
                  </Link>
                  <Link
                    to="/library"
                    className={`flex items-center space-x-2 rounded-md p-2 hover:bg-secondary ${location.pathname === '/library' ? 'bg-secondary text-foreground' : 'text-foreground/60'}`}
                  >
                    <span>Library</span>
                  </Link>
                  {isLibrarian && (
                    <Link
                      to="/librarian"
                      className={`flex items-center space-x-2 rounded-md p-2 hover:bg-secondary ${location.pathname === '/librarian' ? 'bg-secondary text-foreground' : 'text-foreground/60'}`}
                    >
                      <span>Librarian Tools</span>
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 data-[state=open]:bg-muted">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImage} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/profile" className="w-full h-full block">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/settings" className="w-full h-full block">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container py-6">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardLayout;
