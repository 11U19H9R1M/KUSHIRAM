
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bomb, Clock, FileText, Upload, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelfDestructingDocuments() {
  const [file, setFile] = useState<File | null>(null);
  const [destructTimer, setDestructTimer] = useState("24");
  const [destructType, setDestructType] = useState("hours");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Calculate expiration time for display
      const timeValue = parseInt(destructTimer);
      const expirationTime = new Date();
      
      if (destructType === "hours") {
        expirationTime.setHours(expirationTime.getHours() + timeValue);
      } else if (destructType === "days") {
        expirationTime.setDate(expirationTime.getDate() + timeValue);
      } else if (destructType === "minutes") {
        expirationTime.setMinutes(expirationTime.getMinutes() + timeValue);
      }
      
      // Format the expiration date for display
      const formattedExpiration = expirationTime.toLocaleString();
      
      toast.success(
        <div className="space-y-2">
          <p>Self-destructing document uploaded!</p>
          <p className="text-xs opacity-90">File will be deleted on: {formattedExpiration}</p>
        </div>
      );
      
      // Reset form
      setFile(null);
      setDestructTimer("24");
      setDestructType("hours");
      
    } catch (error) {
      toast.error("Upload failed. Please try again.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-red-950/40 via-background/70 to-background/90 backdrop-blur-md">
        <CardHeader className="relative pb-2">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-full p-2 shadow-lg">
              <Bomb className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="bg-gradient-to-r from-red-300 to-orange-200 bg-clip-text text-transparent">
                Self-Destructing Documents
              </CardTitle>
              <CardDescription>
                Create exam materials that auto-delete after a specified time
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-gradient-to-r from-red-900/20 to-orange-900/20">
              <p className="text-sm text-gray-300 mb-2">
                Prevent document leaks and ensure exam security by uploading materials that will automatically
                be deleted after your specified time period.
              </p>
              <div className="flex items-center gap-2 text-xs text-red-300">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>These documents cannot be recovered after deletion</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="fileUpload" className="block text-sm font-medium">
                Upload Document
              </label>
              
              <div className="border-2 border-dashed border-red-500/20 rounded-lg p-4 text-center hover:bg-red-500/5 transition-colors cursor-pointer">
                <Input
                  id="fileUpload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center justify-center">
                  <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                  {file ? (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Click to select or drop a file</p>
                      <p className="text-xs text-muted-foreground">Supports PDF, DOCX, and PPTX</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="timer" className="block text-sm font-medium mb-1 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-red-400" />
                  Auto-delete after
                </label>
                <Input
                  id="timer"
                  type="number"
                  min="1"
                  value={destructTimer}
                  onChange={e => setDestructTimer(e.target.value)}
                  className="border-red-500/20 bg-background/50 focus-visible:ring-red-500/50"
                />
              </div>
              
              <div>
                <label htmlFor="timerUnit" className="block text-sm font-medium mb-1">
                  Time Unit
                </label>
                <Select 
                  value={destructType} 
                  onValueChange={setDestructType}
                >
                  <SelectTrigger id="timerUnit" className="border-red-500/20 bg-background/50 focus-visible:ring-red-500/50">
                    <SelectValue placeholder="Select time unit" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-red-500/20">
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-4">
          <Button 
            onClick={handleUpload} 
            disabled={isUploading || !file} 
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
          >
            {isUploading ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                <span>Uploading...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>Upload Self-Destructing Document</span>
              </div>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
