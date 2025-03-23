
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, Calendar, MapPin, Users, Award, BookOpen, School, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import GraduationTimeline from "@/components/GraduationTimeline";
import GraduationGallery from "@/components/GraduationGallery";
import AchievementSection from "@/components/AchievementSection";

const GraduationMemories = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-accent/10">
      <Header />
      <main className="flex-1 pt-24 pb-20">
        <div className="container px-4 md:px-6">
          <Button asChild variant="ghost" className="mb-8 hover:bg-background/50">
            <Link to="/" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <motion.div 
            className="max-w-5xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                <GraduationCap className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Graduation Memories</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Preserve, celebrate, and relive the journey of your academic achievements and memories.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-12">
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Search your memories..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="glass-input pl-10"
                />
                <div className="absolute left-3 top-3 text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-16">
              <GraduationTimeline />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-16">
              <h2 className="text-2xl font-semibold mb-8 flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Graduation Gallery
              </h2>
              <GraduationGallery />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-16">
              <h2 className="text-2xl font-semibold mb-8 flex items-center">
                <Award className="mr-2 h-5 w-5 text-primary" />
                Academic Achievements
              </h2>
              <AchievementSection />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-16">
              <Card className="glass-morphism overflow-hidden">
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <School className="mr-2 h-5 w-5 text-primary" />
                    Create a Graduation Memory Capsule
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Store your graduation memories, photos, and personal reflections in a secure time capsule.
                    Set it to unlock at a future date for a nostalgic trip down memory lane.
                  </p>
                  
                  <form className="space-y-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium mb-2">Capsule Title</label>
                      <Input id="title" placeholder="My Graduation Day 2024" className="glass-input" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium mb-2">Graduation Date</label>
                        <Input id="date" type="date" className="glass-input" />
                      </div>
                      <div>
                        <label htmlFor="institution" className="block text-sm font-medium mb-2">Institution</label>
                        <Input id="institution" placeholder="University Name" className="glass-input" />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="memories" className="block text-sm font-medium mb-2">Personal Reflection</label>
                      <Textarea id="memories" placeholder="Share your graduation experience, emotions, achievements..." className="glass-input min-h-[150px]" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Upload Memories</label>
                      <div className="border-2 border-dashed border-border rounded-md p-8 text-center cursor-pointer hover:bg-accent/20 transition-colors">
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3 text-muted-foreground"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
                          <p className="text-sm text-muted-foreground mb-1">Drag and drop files here, or click to browse</p>
                          <p className="text-xs text-muted-foreground">Supports images, videos, and documents</p>
                        </div>
                        <input type="file" multiple className="hidden" />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="unlock-date" className="block text-sm font-medium mb-2">Set Unlock Date</label>
                      <Input id="unlock-date" type="date" className="glass-input" />
                      <p className="text-xs text-muted-foreground mt-1">Your memories will be sealed until this date</p>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button className="glass-primary-button">
                        Create Graduation Memory Capsule
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GraduationMemories;
