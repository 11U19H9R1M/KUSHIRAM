
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  Library, 
  GraduationCap, 
  FileVideo, 
  Plus, 
  Settings, 
  LogOut,
  Archive,
  CheckSquare
} from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const ResponsiveSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  // Update sidebar state based on screen size
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Get current path for active state
  const path = location.pathname;

  // Define menu items based on user role
  const getMenuItems = (role: UserRole | undefined) => {
    const baseItems = [
      {
        label: "Dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
        href: role ? getDashboardPath(role) : "/dashboard",
        active: path === "/dashboard" || 
                path === "/faculty-dashboard" || 
                path === "/student-dashboard" || 
                path === "/admin-dashboard"
      },
      {
        label: "Library",
        icon: <Library className="h-5 w-5" />,
        href: "/library",
        active: path === "/library"
      },
      {
        label: "Time Vault",
        icon: <FileVideo className="h-5 w-5" />,
        href: "/time-vault",
        active: path === "/time-vault"
      },
      {
        label: "Graduation Memories",
        icon: <GraduationCap className="h-5 w-5" />,
        href: "/graduation-memories",
        active: path === "/graduation-memories"
      }
    ];
    
    // Add role-specific items
    if (role === "faculty" || role === "admin") {
      baseItems.splice(1, 0, {
        label: "Create Capsule",
        icon: <Plus className="h-5 w-5" />,
        href: "/create",
        active: path === "/create"
      });
    }
    
    if (role === "librarian") {
      baseItems.splice(1, 0, {
        label: "Library Management",
        icon: <CheckSquare className="h-5 w-5" />,
        href: "/librarian",
        active: path === "/librarian"
      });
    }
    
    return baseItems;
  };

  const getDashboardPath = (role: UserRole): string => {
    switch (role) {
      case "faculty":
        return "/faculty-dashboard";
      case "student":
        return "/student-dashboard";
      case "admin":
        return "/admin-dashboard";
      case "librarian":
        return "/librarian";
      default:
        return "/dashboard";
    }
  };

  const menuItems = user ? getMenuItems(user.role) : [];

  return (
    <aside 
      className={cn(
        "fixed top-0 left-0 z-40 h-full bg-card border-r border-border pt-16 transition-all duration-300 ease-in-out",
        isMobile ? (sidebarOpen ? "w-64" : "w-0 -translate-x-full") : (sidebarOpen ? "w-64" : "w-16"),
      )}
    >
      <div className={cn("h-full flex flex-col", !sidebarOpen && !isMobile && "items-center")}>
        <div className={cn("px-3 py-4", !sidebarOpen && !isMobile && "px-0")}>
          <Link 
            to="/" 
            className={cn(
              "flex items-center mb-6 px-2", 
              !sidebarOpen && !isMobile && "justify-center px-0"
            )}
          >
            <Archive className="h-6 w-6 text-primary" />
            {(sidebarOpen || isMobile) && (
              <span className="ml-2 text-xl font-semibold">TimeVault</span>
            )}
          </Link>
          
          <ScrollArea className="h-[calc(100vh-13rem)]">
            <nav className="space-y-1 px-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={cn(
                    "flex items-center rounded-md py-2 px-3 text-sm font-medium transition-colors",
                    item.active
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted hover:text-primary",
                    !sidebarOpen && !isMobile && "justify-center px-2"
                  )}
                >
                  <span className="flex items-center justify-center">
                    {item.icon}
                  </span>
                  {(sidebarOpen || isMobile) && <span className="ml-3">{item.label}</span>}
                </Link>
              ))}
            </nav>
          </ScrollArea>
        </div>
        
        <div className="mt-auto p-4 border-t border-border">
          {user && (
            <div className={cn("flex items-center mb-4", !sidebarOpen && !isMobile && "justify-center")}>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {user.name?.substring(0, 1).toUpperCase() || "U"}
              </div>
              {(sidebarOpen || isMobile) && (
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className={cn("w-full justify-start", !sidebarOpen && !isMobile && "justify-center px-0")}
              size="sm"
              asChild
            >
              <Link to="/about">
                <Settings className="h-4 w-4" />
                {(sidebarOpen || isMobile) && <span className="ml-2">Settings</span>}
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className={cn("w-full justify-start", !sidebarOpen && !isMobile && "justify-center px-0")}
              size="sm"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              {(sidebarOpen || isMobile) && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ResponsiveSidebar;
