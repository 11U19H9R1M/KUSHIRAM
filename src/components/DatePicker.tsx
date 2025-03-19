
import { useState, useEffect } from "react";
import { addYears, format, addMonths, addDays, isBefore } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
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
import { cn } from "@/lib/utils";

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

const DatePicker = ({ date, onDateChange }: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const today = new Date();

  const handleQuickOptionSelect = (option: string) => {
    const selectedOption = quickOptions.find((opt) => opt.label === option);
    if (selectedOption) {
      onDateChange(selectedOption.getValue());
    }
  };

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Select unlock date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Select
            onValueChange={handleQuickOptionSelect}
          >
            <SelectTrigger className="w-full rounded-t-md rounded-b-none border-b">
              <SelectValue placeholder="Quick select" />
            </SelectTrigger>
            <SelectContent>
              {quickOptions.map((option) => (
                <SelectItem key={option.label} value={option.label}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
            disabled={(day) => isBefore(day, today)}
            className="rounded-t-none border-t-0"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
