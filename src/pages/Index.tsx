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
import { ArrowRight, Clock, Sparkles, Calendar, Lock, FileText } from "lucide-react";

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
          <section className="py-20 md:py-28 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-60" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-40" />
            </div>
            
            <div className="container px-4 md:px-6 relative">
              <motion.div 
                className="text-center max-w-3xl mx-auto mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-sm font-medium mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  <span>Upcoming Unlocks</span>
                </motion.div>
                
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Your Memories, <span className="text-primary">Waiting to be Rediscovered</span>
                </motion.h2>
                
                <motion.p 
                  className="text-lg text-muted-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Here are your next time capsules scheduled to be unlocked. The anticipation is part of the experience.
                </motion.p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {upcomingCapsules.map((capsule, index) => (
                  <motion.div 
                    key={capsule.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
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
                            <div className="w-full h-full bg-gradient-to-br from-secondary/40 to-background/60 flex items-center justify-center">
                              <motion.div
                                animate={{ 
                                  rotate: [0, 2, -2, 0],
                                }}
                                transition={{ 
                                  duration: 10, 
                                  repeat: Infinity,
                                  repeatType: "reverse" 
                                }}
                              >
                                <Lock className="w-12 h-12 text-secondary-foreground opacity-30" />
                              </motion.div>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
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
              
              <motion.div 
                className="text-center mt-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button asChild variant="outline" size="lg" className="rounded-full px-8 glass-button">
                  <Link to="/dashboard">
                    View All Your Capsules
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </section>
        )}
        
        {/* Timeline Section */}
        <section className="py-20 bg-accent/5">
          <div className="container px-4 md:px-6">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-sm font-medium mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Sparkles className="w-4 h-4 mr-2 text-primary" />
                <span>How It Works</span>
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Your Journey Through Time</h2>
              
              <p className="text-lg text-muted-foreground">
                Creating and experiencing time capsules is a journey that connects your present to your future.
              </p>
            </motion.div>
            
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border" />
              
              {/* Timeline steps */}
              {[
                { 
                  title: "Create", 
                  description: "Fill your capsule with memories, documents, photos, and messages.", 
                  icon: <FileText className="w-6 h-6" />,
                  delay: 0
                },
                { 
                  title: "Secure", 
                  description: "Set a future date when your capsule will be available to open.", 
                  icon: <Lock className="w-6 h-6" />,
                  delay: 0.2
                },
                { 
                  title: "Wait", 
                  description: "Let time pass while your memories remain safely preserved.", 
                  icon: <Clock className="w-6 h-6" />,
                  delay: 0.4
                },
                { 
                  title: "Rediscover", 
                  description: "When the time comes, unlock and relive your past memories.", 
                  icon: <Sparkles className="w-6 h-6" />,
                  delay: 0.6
                }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  className="relative flex items-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: step.delay }}
                >
                  <div className={`w-1/2 pr-8 ${index % 2 === 0 ? 'text-right' : 'order-1 pl-8 pr-0'}`}>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  
                  <motion.div 
                    className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center z-10 bg-primary text-primary-foreground"
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.3, delay: step.delay + 0.2 }}
                  >
                    {step.icon}
                  </motion.div>
                  
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pl-8 order-1' : 'text-right pr-8'}`} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
