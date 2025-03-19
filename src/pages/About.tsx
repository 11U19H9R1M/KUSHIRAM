
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Info, Lock, Users, Image, Clock } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            className="max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <div className="flex items-center mb-6">
                <Info className="w-6 h-6 mr-3 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">About TimeVault</h1>
              </div>
              <p className="text-lg text-muted-foreground mb-12">
                TimeVault is a digital time capsule platform that lets you preserve moments and memories for the future.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="glass-morphism p-8 rounded-xl mb-12">
                <h2 className="text-2xl font-semibold mb-6">Our Story</h2>
                <p className="mb-4">
                  TimeVault was born from a simple idea: what if we could capture moments exactly as they are and 
                  revisit them years later? In our fast-paced digital world, memories often get lost in endless 
                  social media feeds and cloud storage.
                </p>
                <p className="mb-4">
                  We wanted to create a space where memories could be intentionally preserved, not just stored. 
                  A place where you can send messages to your future self, share milestones with loved ones, 
                  and rediscover forgotten moments at exactly the right time.
                </p>
                <p>
                  Whether it's a graduation, wedding, birth of a child, or just a perfect ordinary day, TimeVault 
                  helps you preserve these moments in a meaningful way, to be unlocked and experienced again when 
                  the time is right.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card className="glass-card hover:shadow-lg transition-all-300">
                  <CardContent className="p-6">
                    <div className="mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Create</h3>
                    <p className="text-muted-foreground">
                      Fill your capsule with photos, videos, messages, and more. Customize it your way.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="glass-card hover:shadow-lg transition-all-300">
                  <CardContent className="p-6">
                    <div className="mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Seal</h3>
                    <p className="text-muted-foreground">
                      Set an unlock date, from days to decades in the future. Your memories are securely stored.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="glass-card hover:shadow-lg transition-all-300">
                  <CardContent className="p-6">
                    <div className="mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Rediscover</h3>
                    <p className="text-muted-foreground">
                      When the time comes, unlock your capsule and experience your memories as if they were new.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-semibold mb-6">Demo Guide</h2>
              <div className="glass-morphism p-8 rounded-xl mb-12">
                <ol className="list-decimal ml-5 space-y-4">
                  <li>
                    <strong>Create an account</strong> - Sign up to start creating your own time capsules.
                  </li>
                  <li>
                    <strong>Create a capsule</strong> - Click "Create New Capsule" and fill in details like title, description, and unlock date.
                  </li>
                  <li>
                    <strong>Add content</strong> - Upload photos, videos, or write messages to your future self.
                  </li>
                  <li>
                    <strong>Invite contributors</strong> - Optionally invite friends and family to add their own memories.
                  </li>
                  <li>
                    <strong>Seal your capsule</strong> - Finalize your capsule and set it to unlock at a future date.
                  </li>
                  <li>
                    <strong>Wait and rediscover</strong> - When the unlock date arrives, you'll receive a notification to open your capsule.
                  </li>
                </ol>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-semibold mb-6">Our Creators</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="glass-morphism p-6 rounded-xl flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-primary/20">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80" 
                      alt="Kushiram Ram Charan" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">Kushiram Ram Charan</h3>
                  <p className="text-primary/80 mb-3">Lead Developer & Co-founder</p>
                  <p className="text-muted-foreground">
                    Passionate about creating technology that connects people with their memories in meaningful ways.
                  </p>
                </div>
                
                <div className="glass-morphism p-6 rounded-xl flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-primary/20">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80" 
                      alt="Darshan" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">Darshan</h3>
                  <p className="text-primary/80 mb-3">UX Designer & Co-founder</p>
                  <p className="text-muted-foreground">
                    Focused on creating intuitive and beautiful user experiences that make preserving memories a joy.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-center mt-12">
              <Button asChild size="lg" className="rounded-full px-8 glass-primary-button">
                <Link to="/create">
                  Start Creating Your Capsules
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
