
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Bell, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface ReminderDialogProps {
  documentTitle: string;
  unlockDate: Date;
  children: React.ReactNode;
}

const ReminderDialog = ({ documentTitle, unlockDate, children }: ReminderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [reminderType, setReminderType] = useState("onDay");
  const [customDate, setCustomDate] = useState<Date | undefined>(
    new Date(unlockDate.getTime() - 24 * 60 * 60 * 1000) // Default to 1 day before
  );
  const [email, setEmail] = useState("");

  const handleSetReminder = () => {
    // In a real app, this would send the reminder data to a backend
    // For this demo, we'll just show a success message
    
    let reminderMessage = "";
    if (reminderType === "onDay") {
      reminderMessage = `on ${format(unlockDate, "PPP")}`;
    } else if (reminderType === "dayBefore") {
      reminderMessage = `one day before ${format(unlockDate, "PPP")}`;
    } else if (reminderType === "custom" && customDate) {
      reminderMessage = `on ${format(customDate, "PPP")}`;
    }
    
    toast.success(
      <div className="flex flex-col space-y-1">
        <span className="font-medium">Reminder set successfully!</span>
        <span className="text-sm text-muted-foreground">
          We'll remind you about "{documentTitle}" {reminderMessage}
        </span>
        {email && <span className="text-sm text-muted-foreground">Notification will be sent to: {email}</span>}
      </div>,
      {
        duration: 5000,
        icon: <Bell className="h-5 w-5 text-primary" />,
      }
    );
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass-morphism">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Set Document Reminder
          </DialogTitle>
          <DialogDescription>
            Get notified when "{documentTitle}" is released.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <FormLabel>Reminder Type</FormLabel>
            <RadioGroup 
              value={reminderType} 
              onValueChange={setReminderType}
              className="flex flex-col space-y-2"
            >
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="onDay" />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">
                  On release day ({format(unlockDate, "PPP")})
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="dayBefore" />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">
                  Day before release ({format(new Date(unlockDate.getTime() - 24 * 60 * 60 * 1000), "PPP")})
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="custom" />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">
                  Custom date
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </div>
          
          {reminderType === "custom" && (
            <div className="space-y-2">
              <FormLabel>Choose Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal glass-button",
                      !customDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {customDate ? format(customDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 glass-morphism">
                  <CalendarComponent
                    mode="single"
                    selected={customDate}
                    onSelect={setCustomDate}
                    initialFocus
                    disabled={{ after: unlockDate }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
          
          <div className="space-y-2">
            <FormLabel>Email (optional)</FormLabel>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input"
            />
            <FormDescription>
              We'll send you a reminder notification
            </FormDescription>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="glass-primary-button" onClick={handleSetReminder}>
            <Bell className="mr-2 h-4 w-4" />
            Set Reminder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderDialog;
