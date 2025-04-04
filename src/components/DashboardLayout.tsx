
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResponsiveSidebar from "@/components/ResponsiveSidebar";
import { Button } from "@/components/ui/button";
import { Menu, ChevronLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
      {!isMobile && (
        <div className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-16'}`}>
          {/* This is just a spacer div to reserve space for the fixed sidebar */}
        </div>
      )}
      
      <ResponsiveSidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 pt-16 md:pt-20 pb-16 md:pb-20">
          <div className="container px-4 md:px-6">
            {!isMobile && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mb-4 -ml-2"
              >
                {sidebarOpen ? (
                  <ChevronLeft className="h-4 w-4 mr-2" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
                {sidebarOpen && <span>Collapse sidebar</span>}
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
