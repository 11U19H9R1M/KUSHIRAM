
import { useEffect, useState } from "react";
import { Search, AlertTriangle, RefreshCw, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface PlagiarismDetectorProps {
  files: File[];
  onPlagiarismDetected?: (result: {
    isDuplicate: boolean;
    similarity: number;
    fileName: string;
  }) => void;
}

interface FileHash {
  name: string;
  hash: string;
  type: string;
}

const PlagiarismDetector = ({ files, onPlagiarismDetected }: PlagiarismDetectorProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    fileName: string;
    isDuplicate: boolean;
    similarity: number;
  }[]>([]);
  const [fileHashes, setFileHashes] = useState<FileHash[]>([]);

  // Function to calculate simple hash of file content
  const calculateFileHash = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const content = e.target.result;
          // Simple hash for demo purposes
          let hash = 0;
          const str = String(content);
          for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
          }
          resolve(hash.toString(16));
        } else {
          resolve("");
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  // Check for plagiarism across files
  const checkForPlagiarism = async () => {
    if (files.length === 0) return;
    
    setIsChecking(true);
    setProgress(0);
    
    // Get local storage for previously uploaded files
    const storedHashes = localStorage.getItem("timeVaultFileHashes");
    const previousHashes: FileHash[] = storedHashes ? JSON.parse(storedHashes) : [];
    
    const newResults = [];
    const newHashes = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Only check PDFs and documents
      if (!file.type.includes("pdf") && 
          !file.type.includes("doc") && 
          !file.type.includes("application/vnd.openxmlformats-officedocument")) {
        setProgress(((i + 1) / files.length) * 100);
        continue;
      }
      
      // Calculate hash for current file
      const hash = await calculateFileHash(file);
      newHashes.push({ name: file.name, hash, type: file.type });
      
      // Check if this file matches any previous hash
      const matches = previousHashes.filter(prevFile => 
        // Compare hashes
        prevFile.hash === hash && 
        // Different file name (to avoid matching the same file)
        prevFile.name !== file.name
      );
      
      const similarity = matches.length > 0 ? 100 : 0;
      const isDuplicate = similarity > 80;
      
      // Create result
      const result = {
        fileName: file.name,
        isDuplicate,
        similarity
      };
      
      newResults.push(result);
      
      // Notify parent component if plagiarism detected
      if (isDuplicate && onPlagiarismDetected) {
        onPlagiarismDetected(result);
      }
      
      // Update progress
      setProgress(((i + 1) / files.length) * 100);
      
      // Small delay to visualize progress
      await new Promise(r => setTimeout(r, 200));
    }
    
    // Save results
    setResults(newResults);
    
    // Store new hashes in localStorage
    const combinedHashes = [...previousHashes, ...newHashes];
    // De-duplicate hashes by name+hash
    const uniqueHashes = combinedHashes.filter((hash, index, self) => 
      index === self.findIndex(h => h.hash === hash.hash && h.name === hash.name)
    );
    localStorage.setItem("timeVaultFileHashes", JSON.stringify(uniqueHashes));
    setFileHashes(newHashes);
    
    setIsChecking(false);
    setProgress(100);
  };

  // Run check when files change
  useEffect(() => {
    if (files.length > 0) {
      checkForPlagiarism();
    }
  }, [files]);

  // No UI if no files
  if (files.length === 0) return null;

  const duplicateCount = results.filter(r => r.isDuplicate).length;

  return (
    <div className="rounded-md border border-border p-4 bg-background/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Plagiarism Detection</h3>
        </div>
        
        <Badge variant={duplicateCount > 0 ? "destructive" : "outline"}>
          {isChecking ? (
            <span className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Checking
            </span>
          ) : duplicateCount > 0 ? (
            <span className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {duplicateCount} Duplicate{duplicateCount > 1 ? "s" : ""}
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              No Duplicates
            </span>
          )}
        </Badge>
      </div>
      
      {isChecking ? (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Checking for duplicates...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      ) : results.some(r => r.isDuplicate) ? (
        <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Duplicate Documents Detected</AlertTitle>
          <AlertDescription>
            {results.filter(r => r.isDuplicate).map((result, i) => (
              <div key={i} className="text-sm mt-1">
                "{result.fileName}" - {result.similarity}% similar to existing document
              </div>
            ))}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="text-sm text-muted-foreground">
          No duplicates detected among {files.filter(f => 
            f.type.includes("pdf") || 
            f.type.includes("doc") || 
            f.type.includes("application/vnd.openxmlformats-officedocument")
          ).length} document{files.length > 1 ? "s" : ""}.
        </div>
      )}
      
      <div className="text-xs text-muted-foreground mt-2">
        Note: This feature checks for exact duplicates across PDF and document files.
      </div>
    </div>
  );
};

export default PlagiarismDetector;
