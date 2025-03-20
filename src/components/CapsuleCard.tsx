
import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Calendar, FileText, Lock, LockOpen, Users, BookOpen, University, FileUp, Clock, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { motion } from "framer-motion";

interface CapsuleCardProps {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  createdAt: Date | string;
  unlockDate: Date | string;
  isUnlocked: boolean;
  documentType?: string;
  courseCode?: string;
  department?: string;
  isConfidential?: boolean;
}

const CapsuleCard = ({
  id,
  title,
  description,
  coverImage,
  createdAt,
  unlockDate,
  isUnlocked,
  documentType = "examPaper",
  courseCode = "",
  department = "",
  isConfidential = true,
}: CapsuleCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Convert string dates to Date objects if they're not already
  const createdAtDate = createdAt instanceof Date ? createdAt : new Date(createdAt);
  const unlockDateObj = unlockDate instanceof Date ? unlockDate : new Date(unlockDate);
  
  const isUnlockable = isUnlocked || new Date() >= unlockDateObj;
  
  const timeUntilUnlock = formatDistanceToNow(unlockDateObj, { addSuffix: true });

  const getDocumentIcon = () => {
    switch(documentType) {
      case "examPaper":
        return <FileText className="w-12 h-12 text-primary/40 transition-all duration-500 group-hover:text-primary/60 transform-gpu group-hover:scale-110" />;
      case "transcript":
        return <University className="w-12 h-12 text-primary/40 transition-all duration-500 group-hover:text-primary/60 transform-gpu group-hover:scale-110" />;
      case "research":
        return <BookOpen className="w-12 h-12 text-primary/40 transition-all duration-500 group-hover:text-primary/60 transform-gpu group-hover:scale-110" />;
      default:
        return <FileUp className="w-12 h-12 text-primary/40 transition-all duration-500 group-hover:text-primary/60 transform-gpu group-hover:scale-110" />;
    }
  };

  const getDocumentTypeLabel = () => {
    switch(documentType) {
      case "examPaper": return "Exam Paper";
      case "answerKey": return "Answer Key";
      case "transcript": return "Transcript";
      case "admission": return "Admission Doc";
      case "financial": return "Financial Record";
      case "research": return "Research Paper";
      case "accreditation": return "Accreditation";
      case "meeting": return "Meeting Minutes";
      case "placement": return "Placement Record";
      case "personal": return "Personal Data";
      default: return "Document";
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Link 
        to={`/capsule/${id}`}
        className="group block rounded-xl border border-border/50 overflow-hidden glass-card transition-all duration-500 hover:shadow-xl transform-gpu"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[3/2] bg-accent/30 overflow-hidden">
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter group-hover:brightness-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/40 to-background/60 backdrop-blur-sm">
              <motion.div 
                animate={{ 
                  rotate: isHovered ? [0, 5, -5, 0] : 0,
                  scale: isHovered ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                {getDocumentIcon()}
              </motion.div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <HoverCard openDelay={100} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Badge 
                  variant={isUnlockable ? "default" : "secondary"}
                  className="flex items-center gap-1 glass-badge transition-all duration-300 group-hover:shadow-md"
                >
                  {isUnlockable ? (
                    <>
                      <LockOpen className="w-3 h-3 animate-pulse" />
                      <span>Accessible</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      <span>Restricted</span>
                    </>
                  )}
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent className="glass-morphism border-border/20">
                {isUnlockable ? (
                  <p className="text-sm">This document is now accessible for viewing!</p>
                ) : (
                  <p className="text-sm">This document will be released {timeUntilUnlock}</p>
                )}
              </HoverCardContent>
            </HoverCard>
            
            {isConfidential && (
              <Badge variant="outline" className="flex items-center gap-1 glass-badge bg-destructive/10 text-destructive border-destructive/20">
                <Shield className="w-3 h-3" />
                <span>Confidential</span>
              </Badge>
            )}
            
            <Badge variant="outline" className="flex items-center gap-1 glass-badge">
              <FileText className="w-3 h-3" />
              <span>{getDocumentTypeLabel()}</span>
            </Badge>
          </div>
        </div>
        
        <div className="p-5 backdrop-blur-sm bg-background/60 transition-all duration-300 group-hover:bg-background/80">
          <motion.h3 
            className="text-lg font-medium line-clamp-1 group-hover:text-primary transition-colors duration-300"
            animate={{ 
              color: isHovered ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
            }}
            transition={{ duration: 0.3 }}
          >
            {title}
          </motion.h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 transition-colors duration-300 group-hover:text-foreground">{description}</p>
          
          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted-foreground">
            <motion.div 
              className="flex items-center gap-1 transition-all duration-300 group-hover:text-primary/80"
              whileHover={{ scale: 1.05 }}
            >
              <Clock className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
              <span>{isUnlockable ? "Released" : `Releases ${timeUntilUnlock}`}</span>
            </motion.div>
            
            {courseCode && (
              <motion.div 
                className="flex items-center gap-1 transition-all duration-300 group-hover:text-primary/80"
                whileHover={{ scale: 1.05 }}
              >
                <BookOpen className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
                <span>{courseCode}</span>
              </motion.div>
            )}
            
            {department && (
              <motion.div 
                className="flex items-center gap-1 transition-all duration-300 group-hover:text-primary/80"
                whileHover={{ scale: 1.05 }}
              >
                <University className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
                <span>{department}</span>
              </motion.div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CapsuleCard;
