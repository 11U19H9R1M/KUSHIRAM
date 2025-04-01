
import { useState } from "react";
import { Brain, Loader2, PieChart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface AIContentAnalysisProps {
  content: string;
  title?: string;
  mediaCount?: number;
}

const AIContentAnalysis = ({ content, title = "Content", mediaCount = 0 }: AIContentAnalysisProps) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [insights, setInsights] = useState<{ label: string; value: number; color: string }[]>([]);
  
  const runAnalysis = () => {
    setAnalyzing(true);
    
    // Simulating AI analysis
    setTimeout(() => {
      // Generate some mock insights based on content
      const contentLength = content.length;
      const wordCount = content.split(/\s+/).filter(Boolean).length;
      
      // Mock insights generation - in a real app, this would be an AI API call
      const mockInsights = [
        { 
          label: "Academic Relevance", 
          value: Math.min(95, Math.max(50, 65 + (title?.length || 0) % 30)), 
          color: "text-blue-500"
        },
        { 
          label: "Knowledge Depth", 
          value: Math.min(100, Math.max(40, contentLength / 20)), 
          color: "text-green-500" 
        },
        { 
          label: "Content Uniqueness", 
          value: Math.min(100, Math.max(60, (wordCount / 10) + (mediaCount * 5))), 
          color: "text-purple-500" 
        },
        { 
          label: "Educational Value", 
          value: Math.min(100, Math.max(55, 70 + (contentLength % 25))), 
          color: "text-amber-500" 
        },
      ];
      
      setInsights(mockInsights);
      setAnalyzing(false);
      setAnalyzed(true);
    }, 2500);
  };
  
  return (
    <div className="glassmorphism rounded-xl p-6 shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">AI Content Analysis</h3>
        </div>
        {!analyzed && (
          <Button 
            variant="outline" 
            size="sm" 
            className="glass-button"
            onClick={runAnalysis}
            disabled={analyzing}
          >
            {analyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze Content
                <Brain className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
      
      {analyzing && (
        <div className="py-6 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <p className="text-center text-muted-foreground mb-4">
            Analyzing content and generating academic insights...
          </p>
          <Progress value={45} className="w-full max-w-xs" />
        </div>
      )}
      
      {analyzed && insights.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${insight.color}`}>{insight.label}</span>
                  <Badge variant="outline">{insight.value}%</Badge>
                </div>
                <Progress value={insight.value} className="h-2" />
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-medium mb-2">Key Insights:</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Content shows strong alignment with academic curriculum standards.</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Consider adding more visual elements to enhance retention.</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>Material is suitable for advanced learning objectives.</span>
              </li>
            </ul>
          </div>
          
          <div className="flex justify-end">
            <Button variant="link" size="sm" className="text-primary">
              View Detailed Report
              <PieChart className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIContentAnalysis;
