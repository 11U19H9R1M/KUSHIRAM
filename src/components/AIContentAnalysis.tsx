
import { useState, useRef, useEffect } from "react";
import { Brain, Loader2, PieChart, ArrowRight, ThumbsUp, ThumbsDown, Globe, MessageSquare, Fingerprint, Zap, Lightbulb, Tag, Database, Info, BarChart3, Shuffle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface TaxonomyNode {
  id: string;
  name: string;
  level: 'primary' | 'secondary' | 'tertiary';
  confidence: number;
  children?: TaxonomyNode[];
}

interface OntologyMatch {
  code: string;
  name: string;
  match: number;
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
  const [activeTab, setActiveTab] = useState("content-analysis");
  const [taxonomy, setTaxonomy] = useState<TaxonomyNode[]>([]);
  const [ontologyMatches, setOntologyMatches] = useState<OntologyMatch[]>([]);
  const [tagStatistics, setTagStatistics] = useState({
    primary: 0,
    secondary: 0,
    tertiary: 0,
    ontologyMatch: 0
  });
  
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
      
      // Generate mock taxonomy data
      const mockTaxonomy: TaxonomyNode[] = [
        {
          id: '1',
          name: 'Computer Science',
          level: 'primary',
          confidence: 95,
          children: [
            {
              id: '1-1',
              name: 'Machine Learning',
              level: 'secondary',
              confidence: 92,
              children: [
                {
                  id: '1-1-1',
                  name: 'Reinforcement Learning',
                  level: 'tertiary',
                  confidence: 88,
                },
                {
                  id: '1-1-2',
                  name: 'Neural Networks',
                  level: 'tertiary',
                  confidence: 94,
                }
              ]
            },
            {
              id: '1-2',
              name: 'Algorithms',
              level: 'secondary',
              confidence: 85,
            }
          ]
        },
        {
          id: '2',
          name: 'Mathematics',
          level: 'primary',
          confidence: 88,
          children: [
            {
              id: '2-1',
              name: 'Probability Theory',
              level: 'secondary',
              confidence: 90,
            },
            {
              id: '2-2',
              name: 'Linear Algebra',
              level: 'secondary',
              confidence: 87,
            }
          ]
        }
      ];
      
      // Generate mock ontology matches
      const mockOntologyMatches: OntologyMatch[] = [
        { code: 'H.3.3', name: 'Information Search and Retrieval', match: 98 },
        { code: 'I.2.6', name: 'Learning', match: 92 },
        { code: 'I.2.1', name: 'Applications and Expert Systems', match: 87 },
      ];
      
      // Generate mock tag statistics
      const mockTagStatistics = {
        primary: 2,
        secondary: 4,
        tertiary: 2,
        ontologyMatch: 92
      };
      
      setInsights(mockInsights);
      setTaxonomy(mockTaxonomy);
      setOntologyMatches(mockOntologyMatches);
      setTagStatistics(mockTagStatistics);
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

  // Recursive function to render taxonomy nodes
  const renderTaxonomyNode = (node: TaxonomyNode, depth = 0) => {
    const paddingLeft = depth * 1.5;
    
    return (
      <div key={node.id} className="mb-2">
        <div 
          className={`flex justify-between items-center py-1.5 px-2 rounded ${
            node.level === 'primary' 
              ? 'bg-primary/10 font-medium' 
              : node.level === 'secondary'
                ? 'bg-primary/5'
                : ''
          }`}
          style={{ paddingLeft: `${paddingLeft}rem` }}
        >
          <div className="flex items-center gap-1.5">
            {node.level === 'primary' && <Tag className="h-3.5 w-3.5 text-primary" />}
            <span>{node.name}</span>
            {node.level === 'primary' && (
              <Badge className="ml-2" variant="outline">Primary</Badge>
            )}
            {node.level === 'secondary' && (
              <Badge className="ml-2" variant="outline">Secondary</Badge>
            )}
          </div>
          <Badge variant="outline">{node.confidence}%</Badge>
        </div>
        
        {node.children && node.children.map(child => renderTaxonomyNode(child, depth + 1))}
      </div>
    );
  };
  
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
      
      {analyzed && (
        <Collapsible open={!isCollapsed}>
          <CollapsibleContent>
            <Tabs defaultValue="content-analysis" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="w-full justify-start mb-4 overflow-x-auto flex-nowrap glass-morphism">
                <TabsTrigger value="content-analysis" className="flex items-center gap-1.5">
                  <Brain className="h-4 w-4" />
                  <span className="hidden sm:inline">Content Analysis</span>
                  <span className="sm:hidden">Analysis</span>
                </TabsTrigger>
                <TabsTrigger value="taxonomy" className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4" />
                  <span className="hidden sm:inline">Taxonomy</span>
                  <span className="sm:hidden">Tags</span>
                </TabsTrigger>
                <TabsTrigger value="ontology" className="flex items-center gap-1.5">
                  <Database className="h-4 w-4" />
                  <span className="hidden sm:inline">Ontology Mapping</span>
                  <span className="sm:hidden">Ontology</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="content-analysis" className="space-y-6">
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
              </TabsContent>
              
              <TabsContent value="taxonomy" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="border border-border rounded-lg p-4 bg-card/50">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      Hierarchical Taxonomy
                      <Badge variant="outline" className="ml-auto">TF-IDF + BERT</Badge>
                    </h4>
                    
                    <div className="max-h-[400px] overflow-y-auto pr-2">
                      {taxonomy.map(node => renderTaxonomyNode(node))}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <Button variant="outline" size="sm" className="text-xs h-8">
                          <Shuffle className="h-3.5 w-3.5 mr-1.5" />
                          Reorder Tags
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-8">
                          <Check className="h-3.5 w-3.5 mr-1.5" />
                          Accept All
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border border-border rounded-lg p-4 bg-card/50">
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-blue-500" />
                        Ontology Mapping
                        <Badge variant="outline" className="ml-auto">ACM Computing</Badge>
                      </h4>
                      
                      <div className="space-y-2.5">
                        {ontologyMatches.map((match, index) => (
                          <div key={index} className="p-2 rounded bg-background/70 border border-border/50">
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                        {match.code}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                      <p className="text-xs">Click to view ACM Classification definition</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <span className="text-sm">{match.name}</span>
                              </div>
                              <Badge variant="outline">{match.match}% Match</Badge>
                            </div>
                            <Progress value={match.match} className="h-1.5" />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border border-border rounded-lg p-4 bg-card/50">
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-indigo-500" />
                        Tag Statistics
                      </h4>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Primary Tags</span>
                            <span>{tagStatistics.primary} detected</span>
                          </div>
                          <Progress value={tagStatistics.primary * 20} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Secondary Tags</span>
                            <span>{tagStatistics.secondary} detected</span>
                          </div>
                          <Progress value={tagStatistics.secondary * 15} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Tertiary Tags</span>
                            <span>{tagStatistics.tertiary} detected</span>
                          </div>
                          <Progress value={tagStatistics.tertiary * 12} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Ontology Match</span>
                            <span>{tagStatistics.ontologyMatch}%</span>
                          </div>
                          <Progress value={tagStatistics.ontologyMatch} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-border">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          <Info className="h-3.5 w-3.5 mr-1.5" />
                          View Tag Statistics Dashboard
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-border rounded-lg bg-blue-50/30 dark:bg-blue-950/30 text-sm">
                  <h5 className="font-medium flex items-center gap-1.5 mb-1.5">
                    <Info className="h-4 w-4 text-blue-500" />
                    Dynamic Tag Refinement
                  </h5>
                  <p className="text-muted-foreground text-xs">
                    The AI taxonomy system learns from your corrections. Drag and drop tags to reposition, 
                    or right-click to edit/remove. Your changes improve future tagging accuracy for all documents.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="ontology" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="border border-border rounded-lg p-4 bg-card/50">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Database className="h-4 w-4 text-primary" />
                      ACM Computing Classification
                      <Badge variant="outline" className="ml-auto">Connected</Badge>
                    </h4>
                    
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      <div className="p-2.5 rounded bg-background/70 border border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">H.3 Information Storage and Retrieval</span>
                          <Badge variant="outline">Primary</Badge>
                        </div>
                        
                        <div className="ml-4 space-y-2 border-l-2 border-primary/20 pl-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">H.3.3 Information Search and Retrieval</span>
                            <Badge variant="outline">98% Match</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">H.3.1 Content Analysis and Indexing</span>
                            <Badge variant="outline">85% Match</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2.5 rounded bg-background/70 border border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">I.2 Artificial Intelligence</span>
                          <Badge variant="outline">Secondary</Badge>
                        </div>
                        
                        <div className="ml-4 space-y-2 border-l-2 border-primary/20 pl-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">I.2.6 Learning</span>
                            <Badge variant="outline">92% Match</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">I.2.1 Applications and Expert Systems</span>
                            <Badge variant="outline">87% Match</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2.5 rounded bg-background/70 border border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">G.3 Probability and Statistics</span>
                          <Badge variant="outline">Tertiary</Badge>
                        </div>
                        
                        <div className="ml-4 space-y-2 border-l-2 border-primary/20 pl-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">G.3.2 Probabilistic algorithms</span>
                            <Badge variant="outline">75% Match</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border border-border rounded-lg p-4 bg-card/50">
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-blue-500" />
                        Available Ontologies
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="flex items-center p-2 rounded bg-background/70 border border-primary/20">
                          <Check className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm">ACM Computing</span>
                        </div>
                        <div className="flex items-center p-2 rounded bg-background/70 border border-border">
                          <span className="h-4 w-4 mr-2" />
                          <span className="text-sm">IEEE Taxonomy</span>
                        </div>
                        <div className="flex items-center p-2 rounded bg-background/70 border border-border">
                          <span className="h-4 w-4 mr-2" />
                          <span className="text-sm">UNESCO SKOS</span>
                        </div>
                        <div className="flex items-center p-2 rounded bg-background/70 border border-border">
                          <span className="h-4 w-4 mr-2" />
                          <span className="text-sm">OECD Fields</span>
                        </div>
                        <div className="flex items-center p-2 rounded bg-background/70 border border-border">
                          <span className="h-4 w-4 mr-2" />
                          <span className="text-sm">MeSH</span>
                        </div>
                        <div className="flex items-center p-2 rounded bg-background/70 border border-border">
                          <span className="h-4 w-4 mr-2" />
                          <span className="text-sm">Custom (Institution)</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                        <Button variant="outline" size="sm" className="text-xs">
                          Connect New Ontology
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          Import Custom
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border border-border rounded-lg p-4 bg-card/50">
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <PieChart className="h-4 w-4 text-green-500" />
                        Ontology Visualization
                      </h4>
                      
                      <div className="h-48 flex items-center justify-center bg-background/50 rounded border border-border/50 p-4">
                        <div className="text-center text-muted-foreground">
                          <p className="text-xs">Click "Generate Visualization" to create an interactive sunburst chart</p>
                          <Button variant="outline" size="sm" className="mt-2 text-xs">
                            Generate Visualization
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="pt-2 flex flex-wrap justify-between items-center gap-3 mt-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/10">
                  <Globe className="h-3 w-3 mr-1" />
                  Multilingual Analysis
                </Badge>
                <Badge className="bg-primary/10">
                  <Zap className="h-3 w-3 mr-1" />
                  Citation Validation
                </Badge>
                <Badge className="bg-primary/10">
                  <Tag className="h-3 w-3 mr-1" />
                  Hierarchical Taxonomy
                </Badge>
              </div>
              
              <div className="flex justify-end">
                <Button variant="link" size="sm" className="text-primary">
                  View Detailed Report
                  <PieChart className="h-4 w-4 ml-1" />
                </Button>
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
