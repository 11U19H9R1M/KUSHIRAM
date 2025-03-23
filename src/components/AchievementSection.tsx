
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, BookOpen, Trophy, Medal, Sparkles, Zap, Share2 } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface Achievement {
  id: number;
  title: string;
  date: string;
  category: string;
  description: string;
  icon: JSX.Element;
  color: string;
}

const AchievementSection = () => {
  const [filter, setFilter] = useState<string>("all");
  
  const achievements: Achievement[] = [
    {
      id: 1,
      title: "Dean's List Recognition",
      date: "2021-2024",
      category: "Academic Excellence",
      description: "Maintained top 10% standing in the department for all semesters.",
      icon: <Award className="h-8 w-8" />,
      color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    },
    {
      id: 2,
      title: "Research Publication",
      date: "March 2023",
      category: "Research",
      description: "Co-authored paper published in the Journal of Computer Science Research.",
      icon: <BookOpen className="h-8 w-8" />,
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    },
    {
      id: 3,
      title: "Hackathon Winner",
      date: "October 2022",
      category: "Competition",
      description: "First place in the University Annual Hackathon for innovative AI solution.",
      icon: <Trophy className="h-8 w-8" />,
      color: "bg-green-500/10 text-green-500 border-green-500/20"
    },
    {
      id: 4,
      title: "Leadership Award",
      date: "May 2023",
      category: "Leadership",
      description: "Recognized for exceptional leadership as Computer Science Club President.",
      icon: <Medal className="h-8 w-8" />,
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    },
    {
      id: 5,
      title: "Academic Scholarship",
      date: "2021-2024",
      category: "Academic Excellence",
      description: "Full merit scholarship for outstanding academic performance.",
      icon: <Sparkles className="h-8 w-8" />,
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20"
    },
    {
      id: 6,
      title: "Programming Competition",
      date: "April 2022",
      category: "Competition",
      description: "Second place in the Regional Coding Championship.",
      icon: <Zap className="h-8 w-8" />,
      color: "bg-red-500/10 text-red-500 border-red-500/20"
    }
  ];
  
  const filteredAchievements = filter === "all" 
    ? achievements 
    : achievements.filter(a => a.category === filter);
  
  const categories = ["all", ...new Set(achievements.map(a => a.category))];
  
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(category => (
          <Badge 
            key={category}
            variant={filter === category ? "default" : "outline"}
            className="cursor-pointer capitalize"
            onClick={() => setFilter(category)}
          >
            {category === "all" ? "All Achievements" : category}
          </Badge>
        ))}
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {filteredAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full glass-card hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-full ${achievement.color} flex items-center justify-center`}>
                    {achievement.icon}
                  </div>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share achievement</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <h3 className="text-lg font-medium mb-2">{achievement.title}</h3>
                <p className="text-muted-foreground mb-4 text-sm">{achievement.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  <Badge variant="outline" className={achievement.color}>
                    {achievement.category}
                  </Badge>
                  <Badge variant="outline">
                    {achievement.date}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="mt-8 text-center">
        <p className="text-muted-foreground">Want to add a new achievement to your collection?</p>
        <button className="text-primary font-medium mt-2 flex items-center gap-2 mx-auto">
          <Award className="h-4 w-4" />
          Add New Achievement
        </button>
      </div>
    </div>
  );
};

export default AchievementSection;
