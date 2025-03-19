
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Archive, Plus, User } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all-300 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <Archive className="w-6 h-6 text-primary transition-transform-200 group-hover:scale-110" />
          <span className="font-medium text-xl tracking-tight">TimeVault</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" current={location.pathname}>Home</NavLink>
          <NavLink to="/dashboard" current={location.pathname}>My Capsules</NavLink>
          <NavLink to="/about" current={location.pathname}>About</NavLink>
        </nav>

        <div className="flex items-center space-x-3">
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link to="/dashboard">
              <User className="w-5 h-5" />
            </Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link to="/create">
              <Plus className="w-4 h-4 mr-2" />
              New Capsule
            </Link>
          </Button>
        </div>
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
      className={`relative py-2 font-medium text-sm transition-all-200 hover:text-primary ${
        isActive ? "text-primary" : "text-muted-foreground"
      }`}
    >
      {children}
      <span 
        className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full transition-all-200 transform origin-left ${
          isActive ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </Link>
  );
};

export default Header;
