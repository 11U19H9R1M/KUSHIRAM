
import { Archive, Calendar, Clock, Image, Lock, Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature = ({ icon, title, description }: FeatureProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="p-4 md:p-6 rounded-xl border border-border bg-card hover:bg-card/80 transition-all duration-200 hover:shadow-md">
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 md:mb-4">
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-medium mb-1 md:mb-2">{title}</h3>
      <p className="text-sm md:text-base text-muted-foreground">{description}</p>
    </div>
  );
};

const Features = () => {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-secondary/30">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3 md:mb-4">Preserve What Matters</h2>
          <p className="text-base md:text-lg text-muted-foreground">
            TimeVault offers elegant, intuitive tools to create meaningful digital time capsules.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          <Feature
            icon={<Calendar className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
            title="Schedule Unlocking"
            description="Set exact dates for your capsules to unlock, from days to decades in the future."
          />
          <Feature
            icon={<Image className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
            title="Rich Media Support"
            description="Add photos, videos, and text messages to create complete memories."
          />
          <Feature
            icon={<Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
            title="Collaborative Capsules"
            description="Invite friends and family to contribute their memories to shared capsules."
          />
          <Feature
            icon={<Lock className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
            title="Private & Secure"
            description="Your memories are encrypted and only accessible when you choose."
          />
          <Feature
            icon={<Clock className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
            title="Countdown Timers"
            description="Watch in anticipation as the unlock date for your capsules approaches."
          />
          <Feature
            icon={<Archive className="w-5 h-5 md:w-6 md:h-6 text-primary" />}
            title="Elegant Experience"
            description="Enjoy a beautiful, thoughtfully designed unlocking experience."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
