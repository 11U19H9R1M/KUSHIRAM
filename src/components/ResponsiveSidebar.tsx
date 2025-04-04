
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, Menu, X, FileText, 
  BookOpen, Award, Brain, 
  Settings, User, LogOut,
  Bell, Calendar, Plus 
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/hooks/useTheme";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const ResponsiveSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { theme } = useTheme();

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location, isMobile]);

  // Close sidebar when ESC key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // Auto-close on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("responsive-sidebar");
      const toggle = document.getElementById("sidebar-toggle");
      if (
        isOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        toggle &&
        !toggle.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const menuSections: MenuSection[] = [
    {
      title: "Main",
      items: [
        { icon: Home, label: "Dashboard", path: "/dashboard" },
        { icon: FileText, label: "My Documents", path: "/documents" },
        { icon: BookOpen, label: "Create Capsule", path: "/create" },
        { icon: Calendar, label: "Schedule", path: "/schedule" },
      ]
    },
    {
      title: "Academic",
      items: [
        { icon: Award, label: "Achievements", path: "/achievements" },
        { icon: Brain, label: "AI Analysis", path: "/analysis" },
      ]
    },
    {
      title: "Account",
      items: [
        { icon: User, label: "Profile", path: "/profile" },
        { icon: Settings, label: "Settings", path: "/settings" },
        { icon: LogOut, label: "Sign Out", path: "/logout" },
      ]
    }
  ];

  // Main mobile toggle button
  const toggleButton = (
    <Button
      id="sidebar-toggle"
      variant="ghost"
      size="icon"
      onClick={() => setIsOpen(!isOpen)}
      className={`fixed left-4 top-4 z-50 ${!isMobile ? 'hidden' : ''}`}
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </Button>
  );

  // Render a menu item
  const renderMenuItem = (item: MenuItem) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;
    
    const menuItem = (
      <Link
        to={item.path}
        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
          isActive 
            ? 'bg-primary/20 text-primary font-medium'
            : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
        }`}
      >
        <Icon className="h-4 w-4" />
        {(!isMobile || isOpen) && <span>{item.label}</span>}
      </Link>
    );

    // Add tooltips only in desktop collapsed state
    if (!isMobile && !isOpen) {
      return (
        <TooltipProvider key={item.path}>
          <Tooltip>
            <TooltipTrigger asChild>
              {menuItem}
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <div key={item.path}>
        {menuItem}
      </div>
    );
  };

  return (
    <>
      {toggleButton}
      
      <aside
        id="responsive-sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex flex-col 
          ${isMobile 
            ? `w-[250px] shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
            : `w-${isOpen ? '[200px]' : '[64px]'} transition-width duration-300`
          }
          ${theme === 'dark' ? 'bg-gray-900/90' : 'bg-white/90'} 
          backdrop-blur-lg border-r border-border/50`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
          {(!isMobile || isOpen) ? (
            <h2 className="font-bold text-lg">TimeVault</h2>
          ) : (
            <span className="font-bold text-lg">TV</span>
          )}
          
          {!isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              <Menu className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {menuSections.map((section, index) => (
            <div key={index}>
              {(!isMobile || isOpen) && (
                <h3 className="text-xs font-medium text-muted-foreground px-3 mb-2">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map(renderMenuItem)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-3 border-t border-border/50">
          <Button 
            className={`w-full justify-start gap-2 ${!isOpen && !isMobile ? 'px-2' : ''}`}
            size={!isOpen && !isMobile ? "icon" : "default"}
          >
            <Plus className="h-4 w-4" />
            {(!isMobile || isOpen) && <span>New Capsule</span>}
          </Button>
        </div>
        
        {(!isMobile || isOpen) && (
          <div className="p-3 border-t border-border/50 flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium mr-3">
              JD
            </div>
            <div className="overflow-hidden">
              <p className="font-medium truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">john.doe@example.com</p>
            </div>
          </div>
        )}
      </aside>
      
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Main content padding */}
      <div 
        className={`transition-all duration-300 ${
          !isMobile ? (isOpen ? 'pl-[200px]' : 'pl-[64px]') : ''
        }`}
      >
        {/* Your page content goes here */}
      </div>
    </>
  );
};

export default ResponsiveSidebar;
