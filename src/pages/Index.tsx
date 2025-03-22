
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AnimatedFeatures from "@/components/AnimatedFeatures";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { formatTimeLeft } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";

interface Capsule {
  id: string;
  title: string;
  unlockDate: string | Date;
  coverImage?: string;
}

const Index = () => {
  const [upcomingCapsules, setUpcomingCapsules] = useState<Capsule[]>([]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
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
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <AnimatedFeatures />
        
        {upcomingCapsules.length > 0 && (
          <section className="py-20 md:py-28">
            <div className="container px-4 md:px-6">
              <motion.div 
                className="text-center max-w-3xl mx-auto mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Upcoming Unlocks</h2>
                <p className="text-lg text-muted-foreground">
                  Here are your next time capsules scheduled to be unlocked. The anticipation is part of the experience.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upcomingCapsules.map((capsule, index) => (
                  <motion.div 
                    key={capsule.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link to={`/capsule/${capsule.id}`}>
                      <Card className="overflow-hidden glass-card hover:shadow-lg transition-all duration-300 group">
                        <div className="aspect-[3/2] relative overflow-hidden">
                          {capsule.coverImage ? (
                            <img 
                              src={capsule.coverImage} 
                              alt={capsule.title} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            />
                          ) : (
                            <div className="w-full h-full bg-secondary/50 flex items-center justify-center">
                              <Clock className="w-10 h-10 text-secondary-foreground opacity-30" />
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-white font-medium truncate">{capsule.title}</h3>
                              <div className="bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium px-2 py-1 rounded-full">
                                {formatTimeLeft(capsule.unlockDate)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                  <Link to="/dashboard">
                    View All Your Capsules
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
