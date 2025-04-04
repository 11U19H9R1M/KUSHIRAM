
import { useState, useRef, useEffect } from "react";
import { Brain, Loader2, PieChart, ArrowRight, ThumbsUp, ThumbsDown, Globe, MessageSquare, Fingerprint, Zap, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AIContentAnalysisProps {
  content: string;
  title?: string;
  mediaCount?: number;
}

interface Insight {
  label: string;
  value: number;
  color: string;
  tooltip: string;
}

const AIContentAnalysis = ({ content, title = "Content", mediaCount = 0 }: AIContentAnalysisProps) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean>>({});
  const [collaborators, setCollaborators] = useState(0);
  const [comments, setComments] = useState(0);
  
  const isMobile = () => window.innerWidth < 768;
  
  // Simulate AI analysis
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
          color: "text-blue-500",
          tooltip: "Measures how well the content aligns with academic standards and curriculum requirements."
        },
        { 
          label: "Knowledge Depth", 
          value: Math.min(100, Math.max(40, contentLength / 20)), 
          color: "text-green-500",
          tooltip: "Evaluates the depth and thoroughness of subject knowledge demonstrated in the content."
        },
        { 
          label: "Content Uniqueness", 
          value: Math.min(100, Math.max(60, (wordCount / 10) + (mediaCount * 5))), 
          color: "text-purple-500",
          tooltip: "Assesses originality against our academic database with 5-language cross-checking."
        },
        { 
          label: "Educational Value", 
          value: Math.min(100, Math.max(55, 70 + (contentLength % 25))), 
          color: "text-amber-500",
          tooltip: "Measures potential educational impact and learning outcomes."
        },
        { 
          label: "Argument Coherence", 
          value: Math.min(92, Math.max(65, 75 + (wordCount % 15))), 
          color: "text-emerald-500",
          tooltip: "Analyzes logical flow and structural integrity of arguments using BERT-based NLP models."
        },
        { 
          label: "Citation Validity", 
          value: Math.min(98, Math.max(60, 85 + (contentLength % 10))), 
          color: "text-indigo-500",
          tooltip: "Verifies citation accuracy and completeness against academic standards."
        },
      ];
      
      setInsights(mockInsights);
      setAnalyzing(false);
      setAnalyzed(true);
      
      // Simulate collaboration activity
      setCollaborators(Math.floor(Math.random() * 3) + 1);
      setComments(Math.floor(Math.random() * 8) + 2);
    }, 2500);
  };

  // Handle feedback on insights
  const giveFeedback = (insightLabel: string, isPositive: boolean) => {
    setFeedbackGiven(prev => ({
      ...prev,
      [insightLabel]: isPositive
    }));
    
    // In a real app, this would send feedback to the AI model
    console.log(`Feedback for ${insightLabel}: ${isPositive ? 'Positive' : 'Negative'}`);
  };
  
  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (isMobile()) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    
    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="glassmorphism rounded-xl p-4 md:p-6 shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">AI Content Analysis</h3>
          
          <div className="ml-auto md:ml-2 flex space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="ml-2 hidden md:flex">
                    <Globe className="h-3 w-3 mr-1" />
                    5-Language Support
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Analyzes content in English, Spanish, French, German, and Mandarin</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {collaborators > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="hidden md:flex">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      {collaborators} Active
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{collaborators} collaborators viewing this document</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
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
        
        {analyzed && (
          <div className="flex gap-2">
            <div className="hidden md:flex">
              <Button variant="outline" size="sm" className="mr-2" onClick={() => setViewMode('mobile')}>
                Mobile
              </Button>
              <Button variant="outline" size="sm" className="mr-2" onClick={() => setViewMode('tablet')}>
                Tablet
              </Button>
              <Button variant="outline" size="sm" onClick={() => setViewMode('desktop')}>
                Desktop
              </Button>
            </div>
            
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="md:hidden"
              >
                {isCollapsed ? 'Expand' : 'Collapse'}
              </Button>
            </CollapsibleTrigger>
          </div>
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
        <Collapsible open={!isCollapsed}>
          <CollapsibleContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {insights.map((insight, index) => (
                  <div key={index} className="space-y-2 p-3 bg-background/40 rounded-lg border border-border">
                    <div className="flex justify-between items-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={`text-sm font-medium ${insight.color} flex items-center cursor-help`}>
                              {insight.label}
                              <Lightbulb className="h-3 w-3 ml-1 opacity-70" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">{insight.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Badge variant="outline">{insight.value}%</Badge>
                    </div>
                    <Progress value={insight.value} className="h-2" />
                    <div className="flex justify-end space-x-1 pt-1">
                      {feedbackGiven[insight.label] === undefined ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0" 
                            onClick={() => giveFeedback(insight.label, true)}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0" 
                            onClick={() => giveFeedback(insight.label, false)}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">Feedback recorded</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-4 border border-border rounded-lg bg-background/40">
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <Fingerprint className="h-4 w-4 mr-1.5 text-primary" />
                  Document Analysis Flowchart
                </h4>
                
                <div className={`relative h-24 md:h-40 mb-4 rounded-lg bg-muted/40 flex items-center justify-center overflow-hidden ${viewMode === 'mobile' ? 'max-w-[320px] mx-auto' : viewMode === 'tablet' ? 'max-w-[600px] mx-auto' : 'w-full'}`}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-70">
                    <svg viewBox="0 0 300 80" className="w-full h-full max-w-md">
                      <path d="M20,40 L60,40" stroke="currentColor" strokeWidth="2" />
                      <circle cx="20" cy="40" r="10" fill="rgba(var(--primary))" fillOpacity="0.2" stroke="currentColor" />
                      <text x="20" y="44" textAnchor="middle" fontSize="8" fill="currentColor">Intro</text>
                      
                      <path d="M80,40 L120,40" stroke="currentColor" strokeWidth="2" />
                      <circle cx="70" cy="40" r="10" fill="rgba(var(--primary))" fillOpacity="0.2" stroke="currentColor" />
                      <text x="70" y="44" textAnchor="middle" fontSize="8" fill="currentColor">Thesis</text>
                      
                      <path d="M140,40 L180,40" stroke="currentColor" strokeWidth="2" />
                      <circle cx="130" cy="40" r="10" fill="rgba(var(--primary))" fillOpacity="0.3" stroke="currentColor" />
                      <text x="130" y="44" textAnchor="middle" fontSize="8" fill="currentColor">Args</text>
                      
                      <path d="M200,40 L240,40" stroke="currentColor" strokeWidth="2" />
                      <circle cx="190" cy="40" r="10" fill="rgba(var(--primary))" fillOpacity="0.7" stroke="currentColor" strokeWidth="2" />
                      <text x="190" y="44" textAnchor="middle" fontSize="8" fill="currentColor">Evidence</text>
                      
                      <circle cx="250" cy="40" r="10" fill="rgba(var(--primary))" fillOpacity="0.2" stroke="currentColor" />
                      <text x="250" y="44" textAnchor="middle" fontSize="8" fill="currentColor">Conclusion</text>
                      
                      <path d="M190,50 L190,60 L120,60" stroke="currentColor" strokeWidth="2" strokeDasharray="2" />
                      <path d="M120,60 L120,50" stroke="currentColor" strokeWidth="2" strokeDasharray="2" />
                    </svg>
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xs text-center opacity-90 px-4">
                      Interactive flowchart shows argument structure with AI-detected connections
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <h5 className="text-xs font-medium mb-1.5 flex items-center">
                      <Zap className="h-3.5 w-3.5 mr-1 text-amber-500" />
                      Key Strengths
                    </h5>
                    <ul className="text-xs text-muted-foreground space-y-1.5">
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Strong evidence supporting main arguments (citation quality: 94%)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Comprehensive coverage of subject matter with minimal gaps</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-medium mb-1.5 flex items-center">
                      <Zap className="h-3.5 w-3.5 mr-1 text-blue-500" />
                      Improvement Areas
                    </h5>
                    <ul className="text-xs text-muted-foreground space-y-1.5">
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Consider adding more visual elements to enhance retention</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Paragraph 3 lacks strong transition to subsequent content</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-3 border-t border-border pt-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-medium">{comments} Collaboration Comments</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">View All</Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 flex flex-wrap justify-between items-center gap-3">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-primary/10">
                    <Globe className="h-3 w-3 mr-1" />
                    Multilingual Analysis
                  </Badge>
                  <Badge className="bg-primary/10">
                    <Zap className="h-3 w-3 mr-1" />
                    Citation Validation
                  </Badge>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="link" size="sm" className="text-primary">
                    View Detailed Report
                    <PieChart className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
      
      {analyzed && isCollapsed && (
        <div className="py-3 px-4 border border-border rounded-md bg-background/40 md:hidden">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Content Analysis Summary</span>
            <Badge variant="outline">
              {Math.round(insights.reduce((sum, insight) => sum + insight.value, 0) / insights.length)}% Overall
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Tap "Expand" to view detailed analysis and collaborative insights
          </p>
        </div>
      )}
    </div>
  );
};

export default AIContentAnalysis;
