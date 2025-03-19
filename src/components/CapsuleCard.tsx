
import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Archive, Calendar, Lock, LockOpen, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CapsuleCardProps {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  createdAt: Date | string;
  unlockDate: Date | string;
  isUnlocked: boolean;
  contributorCount: number;
}

const CapsuleCard = ({
  id,
  title,
  description,
  coverImage,
  createdAt,
  unlockDate,
  isUnlocked,
  contributorCount,
}: CapsuleCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Convert string dates to Date objects if they're not already
  const createdAtDate = createdAt instanceof Date ? createdAt : new Date(createdAt);
  const unlockDateObj = unlockDate instanceof Date ? unlockDate : new Date(unlockDate);
  
  const isUnlockable = isUnlocked || new Date() >= unlockDateObj;
  
  const timeUntilUnlock = formatDistanceToNow(unlockDateObj, { addSuffix: true });
  
  return (
    <Link 
      to={`/capsule/${id}`}
      className="group block rounded-xl border border-border/50 overflow-hidden glass-card transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/2] bg-accent/30 overflow-hidden">
        {coverImage ? (
          <img 
            src={coverImage} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/30 backdrop-blur-sm">
            <Archive className="w-12 h-12 text-primary/40" />
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <Badge 
            variant={isUnlockable ? "default" : "secondary"}
            className="flex items-center gap-1 glass-badge"
          >
            {isUnlockable ? (
              <>
                <LockOpen className="w-3 h-3" />
                <span>Unlocked</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3" />
                <span>Locked</span>
              </>
            )}
          </Badge>
        </div>
      </div>
      
      <div className="p-5 backdrop-blur-sm bg-background/60">
        <h3 className="text-lg font-medium line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        
        <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{isUnlockable ? "Unlocked" : `Unlocks ${timeUntilUnlock}`}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{contributorCount} contributor{contributorCount !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CapsuleCard;
