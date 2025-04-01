
import { useState } from "react";
import { Tag, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

interface SmartTagsProps {
  initialTags?: string[];
  onChange?: (tags: string[]) => void;
  suggestedTags?: string[];
  maxTags?: number;
}

const SmartTags = ({ 
  initialTags = [], 
  onChange, 
  suggestedTags = [
    "Midterm", "Final Exam", "Project", "Assignment", "Notes",
    "Computer Science", "Mathematics", "Physics", "Chemistry", "Engineering",
    "Research", "Thesis", "Dissertation", "Lab Report", "Case Study",
    "Spring 2024", "Fall 2023", "Important", "Reference"
  ],
  maxTags = 10
}: SmartTagsProps) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState("");
  
  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    
    if (!trimmedTag || tags.includes(trimmedTag) || tags.length >= maxTags) {
      return;
    }
    
    const newTags = [...tags, trimmedTag];
    setTags(newTags);
    setInputValue("");
    
    if (onChange) {
      onChange(newTags);
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    
    if (onChange) {
      onChange(newTags);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      handleAddTag(inputValue);
    }
  };
  
  // Filter suggested tags that aren't already selected
  const availableSuggestions = suggestedTags.filter(tag => !tags.includes(tag));
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-2 text-primary" />
          <span className="text-sm font-medium">Smart Tags</span>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 px-2 glass-button">
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Add Tags</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 glass-morphism" align="end">
            <div className="space-y-4">
              <div>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a new tag..."
                    className="glass-input h-8 text-sm"
                  />
                  <Button 
                    size="sm"
                    className="h-8"
                    onClick={() => handleAddTag(inputValue)}
                    disabled={!inputValue || tags.length >= maxTags}
                  >
                    Add
                  </Button>
                </div>
                
                {tags.length >= maxTags && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum of {maxTags} tags reached
                  </p>
                )}
              </div>
              
              {availableSuggestions.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium mb-2">Suggested Tags:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {availableSuggestions.slice(0, 15).map((suggestion) => (
                      <Badge 
                        key={suggestion} 
                        variant="outline"
                        className="cursor-pointer hover:bg-secondary transition-colors"
                        onClick={() => handleAddTag(suggestion)}
                      >
                        {suggestion}
                        <Plus className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex flex-wrap gap-1.5">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Badge 
              key={tag}
              className="glassmorphism px-2 py-1 text-xs flex items-center group hover:bg-secondary/20 transition-all duration-300"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 rounded-full hover:bg-secondary/30 p-0.5"
              >
                <X className="h-3 w-3 opacity-70 group-hover:opacity-100 transition-opacity" />
              </button>
            </Badge>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">
            No tags added yet. Tags help organize and discover content easily.
          </p>
        )}
      </div>
    </div>
  );
};

export default SmartTags;
