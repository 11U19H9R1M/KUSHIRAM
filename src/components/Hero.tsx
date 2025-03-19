
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-28 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/60 via-background to-background" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-accent/40 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary border border-border text-xs font-medium mb-2 animate-fade-down">
            <Clock className="w-3 h-3 mr-1" />
            <span>Preserve today's moments for tomorrow</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight md:leading-tight lg:leading-tight animate-fade-up">
            Your memories, <br className="hidden sm:block" /> 
            <span className="text-primary">sealed in time</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-4 md:mt-6 animate-fade-up [animation-delay:200ms]">
            Create digital time capsules filled with memories, thoughts, and media.
            Lock them away and rediscover them exactly when you want in the future.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-up [animation-delay:400ms]">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/create">
                Create Your First Capsule
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="relative mt-16 md:mt-24 max-w-5xl mx-auto animate-fade-up [animation-delay:600ms]">
        <div className="aspect-[16/9] rounded-xl overflow-hidden border border-border shadow-xl">
          <div className="w-full h-full bg-secondary/50 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80" 
              alt="Time capsule preview" 
              className="w-full h-full object-cover"
              loading="lazy" 
            />
          </div>
        </div>
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 glassmorphism rounded-xl p-6 max-w-md w-full shadow-lg">
          <h3 className="text-lg font-medium">Graduation Memories 2023</h3>
          <p className="text-sm text-muted-foreground mt-1">Unlocks on: May 15, 2028</p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">JD</div>
            <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs">AS</div>
            <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs">MK</div>
            <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs">+2</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
