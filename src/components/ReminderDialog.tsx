
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format, addDays, addWeeks, addMonths, subDays } from "date-fns";
import { CalendarIcon, BellRing, Bell, Mail, MessageSquare, Clock, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { cn, getResponsiveClasses } from "@/lib/utils";

interface ReminderDialogProps {
  unlockDate: Date;
  children: React.ReactNode;
}

const ReminderDialog = ({ unlockDate, children }: ReminderDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(unlockDate.getTime() - 24 * 60 * 60 * 1000) // Default to 1 day before unlock
  );
  const [isOpen, setIsOpen] = useState(false);
  const [notificationType, setNotificationType] = useState("email");
  const [enableBrowserNotif, setEnableBrowserNotif] = useState(true);
  const [activeTab, setActiveTab] = useState("quick");

  const handleSetReminder = () => {
    if (!selectedDate) {
      toast.error("Please select a reminder date");
      return;
    }

    // Save reminder logic would go here in a real app
    const reminderType = notificationType === "email" ? "Email" : "SMS";
    const browserText = enableBrowserNotif ? " and browser" : "";
    
    toast.success(`Reminder set for ${format(selectedDate, "PPP")}. You'll receive ${reminderType}${browserText} notifications.`, {
      icon: <BellRing className="h-4 w-4" />,
      duration: 4000
    });
    
    setIsOpen(false);
  };

  const quickSelectDate = (type: string) => {
    if (type === "day") {
      setSelectedDate(addDays(new Date(), 1));
    } else if (type === "week") {
      setSelectedDate(addWeeks(new Date(), 1));
    } else if (type === "month") {
      setSelectedDate(addMonths(new Date(), 1));
    } else if (type === "before") {
      setSelectedDate(subDays(unlockDate, 1));
    } else if (type === "before-week") {
      setSelectedDate(subDays(unlockDate, 7));
    } else if (type === "before-month") {
      setSelectedDate(subDays(unlockDate, 30));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className={getResponsiveClasses(
        "sm:max-w-[400px] glass-morphism border-white/20 shadow-xl",
        "sm:max-w-[450px]",
        "md:max-w-[500px]"
      )}>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BellRing className="h-5 w-5 mr-2 text-primary" />
            Set a Reminder
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <Tabs defaultValue="quick" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="quick">
                <Clock className="h-4 w-4 mr-2 hidden sm:inline" />
                Quick Select
              </TabsTrigger>
              <TabsTrigger value="calendar">
                <CalendarDays className="h-4 w-4 mr-2 hidden sm:inline" />
                Calendar
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="quick" className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label>Relative to Today</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10 p-2 flex items-center justify-center"
                    onClick={() => quickSelectDate("day")}
                  >
                    Tomorrow
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10 p-2 flex items-center justify-center"
                    onClick={() => quickSelectDate("week")}
                  >
                    Next Week
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10 p-2 flex items-center justify-center"
                    onClick={() => quickSelectDate("month")}
                  >
                    Next Month
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Before Unlock Date</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10 p-2 flex items-center justify-center"
                    onClick={() => quickSelectDate("before")}
                  >
                    Day Before
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10 p-2 flex items-center justify-center"
                    onClick={() => quickSelectDate("before-week")}
                  >
                    Week Before
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/10 p-2 flex items-center justify-center"
                    onClick={() => quickSelectDate("before-month")}
                  >
                    Month Before
                  </Badge>
                </div>
              </div>
              
              {selectedDate && (
                <div className="flex items-center justify-between bg-primary/10 p-2 rounded-md">
                  <Label>Selected Date:</Label>
                  <span className="font-medium">{format(selectedDate, "PPP")}</span>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="calendar" className="pt-4 space-y-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    disabled={(date) => date < new Date() || date > unlockDate}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </TabsContent>
          </Tabs>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notification-type">Notification Method</Label>
              <div className="grid grid-cols-3 gap-2">
                <Badge 
                  variant={notificationType === "email" ? "default" : "outline"} 
                  className="cursor-pointer p-2 flex items-center justify-center"
                  onClick={() => setNotificationType("email")}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Badge>
                <Badge 
                  variant={notificationType === "sms" ? "default" : "outline"} 
                  className="cursor-pointer p-2 flex items-center justify-center"
                  onClick={() => setNotificationType("sms")}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  SMS
                </Badge>
                <Badge 
                  variant={notificationType === "both" ? "default" : "outline"} 
                  className="cursor-pointer p-2 flex items-center justify-center"
                  onClick={() => setNotificationType("both")}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Both
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between glass-card-enhanced p-3 rounded-lg">
              <Label htmlFor="browser-notif" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Browser Notifications
              </Label>
              <Switch
                id="browser-notif"
                checked={enableBrowserNotif}
                onCheckedChange={setEnableBrowserNotif}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full sm:w-auto glass-button">
            Cancel
          </Button>
          <Button onClick={handleSetReminder} className="w-full sm:w-auto glass-primary-button">
            <BellRing className="h-4 w-4 mr-2" />
            Set Reminder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderDialog;
