
import { useState } from "react";
import { Clock, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  date: Date | string;
  title: string;
  description?: string;
  type?: 'creation' | 'milestone' | 'unlock';
  completed?: boolean;
}

interface InteractiveTimelineProps {
  events: TimelineEvent[];
}

const InteractiveTimeline = ({ events = [] }: InteractiveTimelineProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handleNext = () => {
    setActiveIndex((prev) => Math.min(prev + 1, events.length - 1));
  };
  
  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };
  
  // If no events are provided, show sample timeline
  const timelineEvents = events.length > 0 ? events : [
    {
      date: '2023-09-15',
      title: 'Capsule Created',
      description: 'Initial creation of the time capsule',
      type: 'creation',
      completed: true,
    },
    {
      date: '2023-12-01',
      title: 'First Milestone',
      description: 'Added graduation photos and messages',
      type: 'milestone',
      completed: true,
    },
    {
      date: '2024-03-28',
      title: 'New Content Added',
      description: 'Last additions before sealing',
      type: 'milestone',
      completed: false,
    },
    {
      date: '2028-05-15',
      title: 'Unlocks',
      description: 'Time capsule becomes available',
      type: 'unlock',
      completed: false,
    },
  ];
  
  const currentEvent = timelineEvents[activeIndex];
  
  // Format date to display
  const formatDate = (dateString: string | Date) => {
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get icon based on event type
  const getEventIcon = (type: string = 'milestone') => {
    switch (type) {
      case 'creation':
        return <Calendar className="h-5 w-5" />;
      case 'unlock':
        return <Clock className="h-5 w-5" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-current" />;
    }
  };
  
  return (
    <div className="glassmorphism rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-medium mb-6 flex items-center">
        <Clock className="h-5 w-5 mr-2 text-primary" />
        Capsule Timeline
      </h3>
      
      <div className="relative">
        {/* Timeline track */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-muted">
          <div 
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
            style={{ 
              width: `${(activeIndex / (timelineEvents.length - 1)) * 100}%` 
            }}
          />
        </div>
        
        {/* Timeline dots */}
        <div className="flex justify-between relative mb-12">
          {timelineEvents.map((event, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={cn(
                "z-10 rounded-full w-8 h-8 p-0 transition-all duration-300",
                index === activeIndex ? "scale-125 shadow-lg" : "",
                event.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
              onClick={() => setActiveIndex(index)}
            >
              <span className="sr-only">{event.title}</span>
              {getEventIcon(event.type)}
            </Button>
          ))}
        </div>
        
        {/* Event details */}
        <div className="bg-background/50 rounded-lg p-6 backdrop-blur-sm border border-border min-h-[150px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium">{currentEvent.title}</h4>
              <p className="text-sm text-muted-foreground">
                {formatDate(currentEvent.date)}
              </p>
            </div>
            <Badge 
              variant={currentEvent.completed ? "default" : "outline"}
              className={cn(
                "capitalize",
                currentEvent.completed ? "bg-green-600/20 text-green-600" : ""
              )}
            >
              {currentEvent.completed ? "Complete" : "Upcoming"}
            </Badge>
          </div>
          
          <p className="text-sm">{currentEvent.description}</p>
          
          <div className="flex justify-between mt-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrev}
              disabled={activeIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              disabled={activeIndex === timelineEvents.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTimeline;
