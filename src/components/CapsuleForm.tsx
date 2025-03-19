
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, CalendarIcon, File, Image, Trash, Lock, Bell, Users, Star } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { generateUniqueId } from "@/lib/utils";

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
  
  // Advanced options
  const [isPrivate, setIsPrivate] = useState(false);
  const [allowContributors, setAllowContributors] = useState(false);
  const [sendReminders, setSendReminders] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");
  const [customTheme, setCustomTheme] = useState("default");

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
    
    try {
      // Generate a new unique ID for the capsule
      const capsuleId = generateUniqueId();
      
      // Create a new capsule object
      const newCapsule = {
        id: capsuleId,
        title,
        description,
        coverImage: previewUrls.length > 0 ? previewUrls[0] : undefined,
        createdAt: new Date(),
        unlockDate: unlockDate || new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        isUnlocked: false,
        contributorCount: allowContributors ? 1 : 0,
        isPrivate,
        allowContributors,
        sendReminders,
        isFeatured,
        location,
        tags: tags.split(',').map(tag => tag.trim()),
        customTheme,
        message,
        mediaFiles: previewUrls.map((url, index) => ({
          id: `file-${index}`,
          url,
          type: files[index].type.startsWith('image/') ? 'image' : 'video',
          name: files[index].name
        }))
      };
      
      // In a real app, this would be an API call to save the data to a database
      // For now, we'll store it in localStorage so it persists between page refreshes
      const storedCapsules = localStorage.getItem('timeCapsules');
      const capsules = storedCapsules ? JSON.parse(storedCapsules) : [];
      capsules.push(newCapsule);
      localStorage.setItem('timeCapsules', JSON.stringify(capsules));
      
      // Show success message
      toast.success("Time capsule created successfully!");
      
      // Redirect to dashboard
      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error creating time capsule:", error);
      toast.error("Failed to create time capsule. Please try again.");
      setIsSubmitting(false);
    }
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
            className="mt-1.5 glass-input"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What's this time capsule about?"
            className="mt-1.5 min-h-[100px] glass-input"
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
                    "w-full justify-start text-left font-normal glass-button",
                    !unlockDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {unlockDate ? format(unlockDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 glass-morphism">
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
            className="mt-1.5 min-h-[150px] glass-input"
          />
        </div>
        
        {/* Media Upload */}
        <div>
          <Label>Media</Label>
          <div className="mt-1.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-md overflow-hidden border border-border glass-card">
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
              <div className="aspect-square rounded-md border border-dashed border-border glass-card flex flex-col items-center justify-center hover:bg-secondary/30 transition-colors">
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

        {/* Advanced Options */}
        <div className="bg-background/50 backdrop-blur-sm rounded-lg border border-border p-4 mt-6">
          <h3 className="font-medium mb-4">Advanced Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="private" checked={isPrivate} onCheckedChange={setIsPrivate} />
              <Label htmlFor="private" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Private Capsule
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="contributors" checked={allowContributors} onCheckedChange={setAllowContributors} />
              <Label htmlFor="contributors" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Allow Contributors
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="reminders" checked={sendReminders} onCheckedChange={setSendReminders} />
              <Label htmlFor="reminders" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Send Reminders
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
              <Label htmlFor="featured" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Feature on Timeline
              </Label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g., New York City"
                className="mt-1.5 glass-input"
              />
            </div>
            
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="e.g., graduation, 2023, memories"
                className="mt-1.5 glass-input"
              />
            </div>
            
            <div>
              <Label htmlFor="theme">Theme</Label>
              <select
                id="theme"
                value={customTheme}
                onChange={e => setCustomTheme(e.target.value)}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-ring mt-1.5"
              >
                <option value="default">Default</option>
                <option value="nostalgic">Nostalgic</option>
                <option value="futuristic">Futuristic</option>
                <option value="minimalist">Minimalist</option>
                <option value="retro">Retro</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => navigate("/dashboard")} className="glass-button">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="glass-primary-button">
          {isSubmitting ? "Creating..." : "Create Time Capsule"}
        </Button>
      </div>
    </form>
  );
};

export default CapsuleForm;
