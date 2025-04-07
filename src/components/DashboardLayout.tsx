
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResponsiveSidebar from "@/components/ResponsiveSidebar";
import { Button } from "@/components/ui/button";
import { Menu, ChevronLeft, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  
  // On mobile, sidebar is closed by default
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background to-accent/10">
      {/* Sidebar spacer for desktop with transition */}
      {!isMobile && (
        <div 
          className={cn(
            "transition-all duration-300 ease-in-out",
            sidebarOpen ? "w-64" : "w-16"
          )}
        >
          {/* This is just a spacer div to reserve space for the fixed sidebar */}
        </div>
      )}
      
      {/* Mobile overlay when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Pass sidebarOpen state to the ResponsiveSidebar */}
      <ResponsiveSidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 pt-16 md:pt-20 pb-16 md:pb-20">
          <div className="container px-4 md:px-6">
            {/* Desktop sidebar toggle button */}
            {!isMobile && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mb-4 -ml-2"
              >
                {sidebarOpen ? (
                  <>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    <span>Collapse sidebar</span>
                  </>
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            )}
            
            {/* Mobile menu button */}
            {isMobile && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mb-4 -ml-2 fixed top-4 left-4 z-50 bg-background/50 backdrop-blur-md rounded-full p-2 h-auto"
                aria-label={sidebarOpen ? "Close menu" : "Open menu"}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
            
            {children || <Outlet />}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
