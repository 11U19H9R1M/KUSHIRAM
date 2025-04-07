
import { useState } from "react";
import { addYears, format, addMonths, addDays, isBefore } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown, Clock, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn, getResponsiveClasses } from "@/lib/utils";

interface DatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

const quickOptions = [
  { label: "In 1 year", getValue: () => addYears(new Date(), 1) },
  { label: "In 5 years", getValue: () => addYears(new Date(), 5) },
  { label: "In 10 years", getValue: () => addYears(new Date(), 10) },
  { label: "Next month", getValue: () => addMonths(new Date(), 1) },
  { label: "Next week", getValue: () => addDays(new Date(), 7) },
];

const customOptions = [
  { label: "After Graduation", value: "graduation" },
  { label: "Next Semester", value: "semester" },
  { label: "Academic Year End", value: "academic-year" },
  { label: "Career Milestone", value: "career" },
  { label: "Custom Date...", value: "custom" },
];

const DatePicker = ({ date, onDateChange }: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("quick");
  const today = new Date();

  const handleQuickOptionSelect = (option: string) => {
    const selectedOption = quickOptions.find((opt) => opt.label === option);
    if (selectedOption) {
      onDateChange(selectedOption.getValue());
      setOpen(false);
    }
  };

  const handleCustomOptionSelect = (option: string) => {
    switch (option) {
      case "graduation":
        // Approximately 4 years from now (typical graduation timeframe)
        onDateChange(addYears(new Date(), 4));
        break;
      case "semester":
        // Approximately 4-5 months (a semester)
        onDateChange(addMonths(new Date(), 5));
        break;
      case "academic-year":
        // Typical academic year end (around June)
        const currentYear = new Date().getFullYear();
        const nextJune = new Date(currentYear + 1, 5, 15); // June is month 5 (0-based)
        onDateChange(nextJune);
        break;
      case "career":
        // Career milestone (approx 10 years)
        onDateChange(addYears(new Date(), 10));
        break;
      case "custom":
        // Leave popup open for manual selection
        return;
      default:
        break;
    }
    
    if (option !== "custom") {
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal glass-input",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="flex-grow truncate">
              {date ? format(date, "PPP") : "Select unlock date"}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={getResponsiveClasses(
          "w-auto p-0 glass-morphism border-white/20",
          "sm:w-[340px]",
          "md:w-[400px]"
        )} align="start">
          <Tabs defaultValue="quick" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="quick" className="text-xs sm:text-sm">
                <Clock className="h-3 w-3 mr-1 sm:mr-2 hidden sm:inline" />
                Quick Select
              </TabsTrigger>
              <TabsTrigger value="academic" className="text-xs sm:text-sm">
                <CalendarDays className="h-3 w-3 mr-1 sm:mr-2 hidden sm:inline" />
                Academic
              </TabsTrigger>
              <TabsTrigger value="calendar" className="text-xs sm:text-sm">
                <CalendarIcon className="h-3 w-3 mr-1 sm:mr-2 hidden sm:inline" />
                Calendar
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="quick" className="p-2 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {quickOptions.map((option) => (
                  <Badge 
                    key={option.label}
                    variant="outline" 
                    className="glass-card cursor-pointer hover:bg-primary/10 p-2 flex items-center justify-center"
                    onClick={() => handleQuickOptionSelect(option.label)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="academic" className="p-2 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {customOptions.map((option) => (
                  <Badge 
                    key={option.value}
                    variant="outline" 
                    className="glass-card cursor-pointer hover:bg-primary/10 p-2 flex items-center justify-center"
                    onClick={() => handleCustomOptionSelect(option.value)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="calendar" className="p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  onDateChange(newDate);
                  setOpen(false);
                }}
                initialFocus
                disabled={(day) => isBefore(day, today)}
                className="rounded-t-none pointer-events-auto p-3"
              />
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
