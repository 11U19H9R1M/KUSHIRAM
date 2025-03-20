
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative pt-28 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/60 via-background to-background" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        
        {/* Animated particles */}
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-primary/80 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-primary/80 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-primary/80 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <motion.div 
          className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/80 backdrop-blur-sm border border-border text-xs font-medium mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Sparkles className="w-3 h-3 mr-1 text-primary" />
            <span>Preserve today's moments for tomorrow</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight md:leading-tight lg:leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Your memories, <br className="hidden sm:block" /> 
            <span className="text-gradient-primary">sealed in time</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-4 md:mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Create digital time capsules filled with memories, thoughts, and media.
            Lock them away and rediscover them exactly when you want in the future.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <Button asChild size="lg" className="rounded-full px-8 glass-primary-button">
              <Link to="/create">
                Create Your First Capsule
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 glass-button">
              <Link to="/about">Learn More</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        className="relative mt-16 md:mt-24 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="aspect-[16/9] rounded-xl overflow-hidden border border-border shadow-xl group">
          <div className="w-full h-full bg-secondary/50 flex items-center justify-center overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80" 
              alt="Time capsule preview" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter group-hover:brightness-110"
              loading="lazy" 
            />
          </div>
        </div>
        <motion.div 
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 glass-floating rounded-xl p-6 max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Graduation Memories 2023</h3>
              <p className="text-sm text-muted-foreground">Unlocks on: May 15, 2028</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">JD</div>
            <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs">AS</div>
            <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs">MK</div>
            <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs">+2</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
