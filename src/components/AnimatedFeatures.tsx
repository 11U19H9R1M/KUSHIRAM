
import { useState } from "react";
import { motion } from "framer-motion";
import { Archive, Calendar, Clock, Image, Lock, Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="h-full"
    >
      <div 
        className="h-full p-4 md:p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        <div 
          className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 md:mb-4 transition-all duration-300 ${isHovered ? 'bg-primary/20' : ''}`}
        >
          <motion.div 
            animate={{ rotate: isHovered ? 360 : 0 }} 
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>
        </div>
        <h3 className="text-lg md:text-xl font-medium mb-1 md:mb-2">{title}</h3>
        <p className="text-sm md:text-base text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
};

const AnimatedFeatures = () => {
  return (
    <section className="py-12 md:py-20 lg:py-32 bg-secondary/30">
      <div className="container px-4 md:px-6">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-10 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3 md:mb-4">Preserve What Matters</h2>
          <p className="text-base md:text-lg text-muted-foreground">
            TimeVault offers elegant, intuitive tools to create meaningful digital time capsules.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          <FeatureCard
            icon={<Calendar className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
            title="Schedule Unlocking"
            description="Set exact dates for your capsules to unlock, from days to decades in the future."
            delay={1}
          />
          <FeatureCard
            icon={<Image className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
            title="Rich Media Support"
            description="Add photos, videos, and text messages to create complete memories."
            delay={2}
          />
          <FeatureCard
            icon={<Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
            title="Collaborative Capsules"
            description="Invite friends and family to contribute their memories to shared capsules."
            delay={3}
          />
          <FeatureCard
            icon={<Lock className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
            title="Private & Secure"
            description="Your memories are encrypted and only accessible when you choose."
            delay={4}
          />
          <FeatureCard
            icon={<Clock className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
            title="Countdown Timers"
            description="Watch in anticipation as the unlock date for your capsules approaches."
            delay={5}
          />
          <FeatureCard
            icon={<Archive className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
            title="Elegant Experience"
            description="Enjoy a beautiful, thoughtfully designed unlocking experience."
            delay={6}
          />
        </div>
      </div>
    </section>
  );
};

export default AnimatedFeatures;
