
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Award, BookOpen, School, MapPin, Calendar } from "lucide-react";

const GraduationTimeline = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const timelineEvents = [
    {
      id: 1,
      date: "September 2020",
      title: "Freshman Year",
      description: "Started my journey in Computer Science at University of Technology.",
      icon: <School className="h-5 w-5" />,
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      id: 2,
      date: "June 2021",
      title: "Dean's List",
      description: "Made it to the Dean's List with a 3.8 GPA for the academic year.",
      icon: <Award className="h-5 w-5" />,
      color: "bg-yellow-500/10 text-yellow-500"
    },
    {
      id: 3,
      date: "March 2022",
      title: "Research Project",
      description: "Collaborated on a machine learning research project with Prof. Johnson.",
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-green-500/10 text-green-500"
    },
    {
      id: 4,
      date: "December 2023",
      title: "Senior Thesis",
      description: "Completed my senior thesis on AI applications in healthcare.",
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      id: 5,
      date: "May 2024",
      title: "Graduation Day",
      description: "Graduated with honors in Computer Science. A day to remember forever!",
      icon: <GraduationCap className="h-5 w-5" />,
      color: "bg-primary/10 text-primary"
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-8 flex items-center">
        <Calendar className="mr-2 h-5 w-5 text-primary" />
        Academic Journey Timeline
      </h2>
      
      <div ref={ref} className="relative">
        {/* Vertical line */}
        <div className="absolute top-0 bottom-0 left-[15px] md:left-1/2 w-0.5 bg-border md:-translate-x-1/2" />
        
        {timelineEvents.map((event, index) => (
          <motion.div 
            key={event.id}
            className={`relative flex flex-col md:flex-row gap-8 mb-12 ${
              index % 2 === 0 ? 'md:flex-row-reverse' : ''
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            {/* Timeline node */}
            <div className="absolute left-0 md:left-1/2 w-8 h-8 rounded-full bg-background border-4 border-primary/50 md:-translate-x-1/2 z-10 shadow-lg" />
            
            {/* Content */}
            <div className="ml-12 md:ml-0 md:w-1/2 md:px-8">
              <Card className="glass-card hover:shadow-lg transition-all duration-300 overflow-hidden">
                <CardContent className="p-6">
                  <Badge className={`mb-3 ${event.color}`}>
                    <span className="flex items-center gap-1">
                      {event.icon}
                      {event.date}
                    </span>
                  </Badge>
                  <h3 className="text-xl font-medium mb-2">{event.title}</h3>
                  <p className="text-muted-foreground">{event.description}</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GraduationTimeline;
