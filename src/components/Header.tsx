
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Archive, LogIn, Menu, Plus, User, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <Archive className="w-6 h-6 text-primary transition-transform duration-200 group-hover:scale-110" />
          <span className="font-medium text-lg sm:text-xl tracking-tight">TimeVault</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <NavLink to="/" current={location.pathname}>Home</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" current={location.pathname}>My Capsules</NavLink>
              <NavLink to="/about" current={location.pathname}>About</NavLink>
            </>
          )}
        </nav>

        {/* Authentication Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <Button asChild variant="ghost" size="sm" className="rounded-full">
                <Link to="/create">
                  <Plus className="w-4 h-4 mr-2" />
                  New Capsule
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.profileImage} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user?.name?.substring(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user?.name}</span>
                      <span className="text-xs text-muted-foreground mt-1">{user?.email}</span>
                      <span className="text-xs font-normal mt-1 px-2 py-1 bg-secondary rounded-full inline-block w-fit capitalize">
                        {user?.role}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/create">Create Capsule</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="rounded-full">
                <Link to="/signup">
                  Sign up
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center space-x-2">
                  <Archive className="w-5 h-5 text-primary" />
                  <span>TimeVault</span>
                </div>
              </SheetTitle>
            </SheetHeader>
            <div className="py-4 flex flex-col space-y-3 mt-4">
              <Link 
                to="/" 
                className={`px-2 py-2 rounded-md ${location.pathname === "/" ? "bg-primary/10 text-primary" : ""}`}
                onClick={closeMenu}
              >
                Home
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`px-2 py-2 rounded-md ${location.pathname === "/dashboard" ? "bg-primary/10 text-primary" : ""}`}
                    onClick={closeMenu}
                  >
                    My Capsules
                  </Link>
                  <Link 
                    to="/create" 
                    className={`px-2 py-2 rounded-md ${location.pathname === "/create" ? "bg-primary/10 text-primary" : ""}`}
                    onClick={closeMenu}
                  >
                    Create Capsule
                  </Link>
                  <Link 
                    to="/about" 
                    className={`px-2 py-2 rounded-md ${location.pathname === "/about" ? "bg-primary/10 text-primary" : ""}`}
                    onClick={closeMenu}
                  >
                    About
                  </Link>
                  
                  <div className="border-t border-border my-2 pt-2">
                    {user && (
                      <div className="px-2 py-2 mb-2">
                        <div className="flex items-center space-x-3 mb-2">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user.profileImage} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                        <div className="text-xs font-normal mt-1 px-2 py-1 bg-secondary rounded-full inline-block capitalize">
                          {user.role}
                        </div>
                      </div>
                    )}
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                      className="w-full mt-2"
                    >
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="border-t border-border my-2 pt-2 space-y-2">
                  <Button asChild className="w-full" onClick={closeMenu}>
                    <Link to="/login">Log in</Link>
                  </Button>
                  <Button asChild className="w-full" variant="secondary" onClick={closeMenu}>
                    <Link to="/signup">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  current: string;
  children: React.ReactNode;
}

const NavLink = ({ to, current, children }: NavLinkProps) => {
  const isActive = current === to;
  
  return (
    <Link 
      to={to} 
      className={`relative py-2 font-medium text-sm transition-all duration-200 hover:text-primary ${
        isActive ? "text-primary" : "text-muted-foreground"
      }`}
    >
      {children}
      <span 
        className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full transition-all duration-200 transform origin-left ${
          isActive ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </Link>
  );
};

export default Header;
