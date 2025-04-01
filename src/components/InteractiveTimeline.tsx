
import { useState } from "react";
import { Clock, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
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
    <div className="glassmorphism rounded-xl p-4 md:p-6 shadow-lg">
      <h3 className="text-lg font-medium mb-4 md:mb-6 flex items-center">
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
        
        {/* Timeline dots - smaller on mobile */}
        <div className={`flex justify-between relative ${isMobile ? 'mb-8' : 'mb-12'}`}>
          {timelineEvents.map((event, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={cn(
                "z-10 rounded-full transition-all duration-300",
                isMobile ? "w-6 h-6 p-0" : "w-8 h-8 p-0", 
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
        
        {/* Event details - adjust padding for mobile */}
        <div className="bg-background/50 rounded-lg p-4 md:p-6 backdrop-blur-sm border border-border min-h-[120px] md:min-h-[150px]">
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-2 md:gap-4 mb-3 md:mb-4">
            <div>
              <h4 className="font-medium text-base md:text-lg">{currentEvent.title}</h4>
              <p className="text-xs md:text-sm text-muted-foreground">
                {formatDate(currentEvent.date)}
              </p>
            </div>
            <Badge 
              variant={currentEvent.completed ? "default" : "outline"}
              className={cn(
                "capitalize text-xs md:text-sm ml-auto md:ml-0",
                currentEvent.completed ? "bg-green-600/20 text-green-600" : ""
              )}
            >
              {currentEvent.completed ? "Complete" : "Upcoming"}
            </Badge>
          </div>
          
          <p className="text-xs md:text-sm">{currentEvent.description}</p>
          
          <div className="flex justify-between mt-4 md:mt-6">
            <Button
              variant="ghost"
              size={isMobile ? "sm" : "default"}
              className="text-xs md:text-sm h-8 md:h-10"
              onClick={handlePrev}
              disabled={activeIndex === 0}
            >
              <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              Prev
            </Button>
            <Button
              variant="ghost"
              size={isMobile ? "sm" : "default"}
              className="text-xs md:text-sm h-8 md:h-10"
              onClick={handleNext}
              disabled={activeIndex === timelineEvents.length - 1}
            >
              Next
              <ChevronRight className="h-3 w-3 md:h-4 md:w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTimeline;
