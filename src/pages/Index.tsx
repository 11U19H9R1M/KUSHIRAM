
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AnimatedFeatures from "@/components/AnimatedFeatures";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { formatTimeLeft } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Capsule {
  id: string;
  title: string;
  unlockDate: string | Date;
  coverImage?: string;
}

const Index = () => {
  const [upcomingCapsules, setUpcomingCapsules] = useState<Capsule[]>([]);
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!isAuthenticated) return;
    
    // Load capsules from localStorage
    const loadCapsules = () => {
      try {
        const storedCapsules = localStorage.getItem('timeCapsules');
        if (storedCapsules) {
          const parsedCapsules = JSON.parse(storedCapsules);
          
          // Find the next few capsules to be unlocked
          const now = new Date();
          const upcoming = parsedCapsules
            .filter((capsule: any) => new Date(capsule.unlockDate) > now)
            .sort((a: any, b: any) => new Date(a.unlockDate).getTime() - new Date(b.unlockDate).getTime())
            .slice(0, 3);
          
          setUpcomingCapsules(upcoming);
        }
      } catch (error) {
        console.error("Error loading capsules:", error);
      }
    };
    
    loadCapsules();
    
    // Refresh timer every minute
    const interval = setInterval(() => {
      setUpcomingCapsules(prev => [...prev]);
    }, 60000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Showing loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show landing page to unauthenticated users
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <AnimatedFeatures />
        
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground">
                Create your TimeVault account today and start preserving your important moments.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link to="/signup">
                    Create an Account
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                  <Link to="/login">
                    <LogIn className="mr-2 w-4 h-4" />
                    Sign In
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
