
import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Calendar, FileText, Lock, LockOpen, Users, BookOpen, University, FileUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

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
    <Link 
      to={`/capsule/${id}`}
      className="group block rounded-xl border border-border/50 overflow-hidden glass-card transition-all duration-500 hover:shadow-xl transform-gpu hover:-translate-y-1"
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
          <div className="w-full h-full flex items-center justify-center bg-secondary/30 backdrop-blur-sm">
            {getDocumentIcon()}
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <HoverCard>
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
              <Lock className="w-3 h-3" />
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
        <h3 className="text-lg font-medium line-clamp-1 group-hover:text-primary transition-colors duration-300">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2 transition-colors duration-300 group-hover:text-foreground">{description}</p>
        
        <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1 transition-all duration-300 group-hover:text-primary/80">
            <Calendar className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
            <span>{isUnlockable ? "Released" : `Releases ${timeUntilUnlock}`}</span>
          </div>
          
          {courseCode && (
            <div className="flex items-center gap-1 transition-all duration-300 group-hover:text-primary/80">
              <BookOpen className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
              <span>{courseCode}</span>
            </div>
          )}
          
          {department && (
            <div className="flex items-center gap-1 transition-all duration-300 group-hover:text-primary/80">
              <University className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
              <span>{department}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CapsuleCard;
