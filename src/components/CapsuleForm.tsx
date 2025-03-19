
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, CalendarIcon, File, Image, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CapsuleForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unlockDate, setUnlockDate] = useState<Date | undefined>(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) // Default to 1 year from now
  );
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
      
      // Create preview URLs for the files
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviewUrls = [...previewUrls];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index]);
    
    newFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    setFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, we would upload files and save data to a database here
    // For now, we'll just simulate a submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="My Time Capsule"
            required
            className="mt-1.5"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What's this time capsule about?"
            className="mt-1.5 min-h-[100px]"
          />
        </div>
        
        <div>
          <Label htmlFor="unlock-date">Unlock Date</Label>
          <div className="mt-1.5">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !unlockDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {unlockDate ? format(unlockDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={unlockDate}
                  onSelect={setUnlockDate}
                  initialFocus
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Write a message to your future self..."
            className="mt-1.5 min-h-[150px]"
          />
        </div>
        
        <div>
          <Label>Media</Label>
          <div className="mt-1.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-md overflow-hidden border border-border bg-accent">
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <label className="cursor-pointer">
              <div className="aspect-square rounded-md border border-dashed border-border bg-secondary/50 flex flex-col items-center justify-center hover:bg-secondary transition-colors">
                <Image className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm font-medium">Add Media</span>
                <span className="text-xs text-muted-foreground">Images or videos</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                />
              </div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => navigate("/dashboard")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Time Capsule"}
        </Button>
      </div>
    </form>
  );
};

export default CapsuleForm;
