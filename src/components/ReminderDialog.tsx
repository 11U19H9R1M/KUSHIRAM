
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { format, addDays, addWeeks, addMonths } from "date-fns";
import { CalendarIcon, BellRing } from "lucide-react";
import { toast } from "sonner";

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
      setSelectedDate(new Date(unlockDate.getTime() - 24 * 60 * 60 * 1000));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass-morphism">
        <DialogHeader>
          <DialogTitle>Set a Reminder</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="reminder-date">Reminder Date</Label>
            <div className="flex gap-2 mb-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => quickSelectDate("day")}
              >
                Tomorrow
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => quickSelectDate("week")}
              >
                Next Week
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => quickSelectDate("before")}
              >
                Day Before
              </Button>
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  id="reminder-date"
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
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notification-type">Notification Type</Label>
            <Select value={notificationType} onValueChange={setNotificationType}>
              <SelectTrigger id="notification-type">
                <SelectValue placeholder="Select notification type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="browser-notif">Enable Browser Notifications</Label>
            <Switch
              id="browser-notif"
              checked={enableBrowserNotif}
              onCheckedChange={setEnableBrowserNotif}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSetReminder}>
            Set Reminder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderDialog;
