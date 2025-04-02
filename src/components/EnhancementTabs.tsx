
import { useState } from "react";
import { 
  FileText, 
  Brain, 
  Search, 
  Code, 
  Tag, 
  RefreshCw, 
  ArrowRight, 
  BarChart, 
  Globe, 
  Check, 
  Image,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const EnhancementTabs = () => {
  const [activeFeature, setActiveFeature] = useState("content-analysis");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  const handleAnalysis = () => {
    setIsAnalyzing(true);
    setProgressValue(0);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgressValue((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass-morphism border-white/20 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>AI-Powered Document Enhancement</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Advanced analysis and optimization tools powered by machine learning
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <Tabs value={activeFeature} onValueChange={setActiveFeature}>
          <div className="px-6 pt-3 pb-1 overflow-x-auto scrollbar-thin">
            <TabsList className="bg-background/40 h-auto p-1 w-full md:w-fit">
              <TabsTrigger value="content-analysis" className="flex items-center gap-1.5 py-2 data-[state=active]:bg-primary/20">
                <FileText className="h-4 w-4" />
                <span className="hidden md:inline">Content Analysis</span>
                <span className="md:hidden">Content</span>
              </TabsTrigger>
              <TabsTrigger value="auto-tagging" className="flex items-center gap-1.5 py-2 data-[state=active]:bg-primary/20">
                <Tag className="h-4 w-4" />
                <span className="hidden md:inline">Auto-Tagging</span>
                <span className="md:hidden">Tags</span>
              </TabsTrigger>
              <TabsTrigger value="plagiarism" className="flex items-center gap-1.5 py-2 data-[state=active]:bg-primary/20">
                <Search className="h-4 w-4" />
                <span className="hidden md:inline">Plagiarism Detection</span>
                <span className="md:hidden">Plagiarism</span>
              </TabsTrigger>
              <TabsTrigger value="format" className="flex items-center gap-1.5 py-2 data-[state=active]:bg-primary/20">
                <RefreshCw className="h-4 w-4" />
                <span className="hidden md:inline">Format Optimization</span>
                <span className="md:hidden">Format</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="pt-4 pb-6">
            {/* Content Analysis Tab */}
            <TabsContent value="content-analysis" className="mt-0">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        Contextual Coherence Engine
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Our BERT-based NLP models analyze semantic flow, argument structure, and logical consistency
                        in your academic documents, flagging potential issues.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="border border-border rounded-lg p-3 bg-card/50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <span className="font-medium">Citation Gaps</span>
                          </div>
                          <Badge variant="outline">BERT</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Identifies claims requiring additional citations or evidence based on academic standards.
                        </p>
                      </div>
                      
                      <div className="border border-border rounded-lg p-3 bg-card/50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <BarChart className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">Argument Analysis</span>
                          </div>
                          <Badge variant="outline">GPT-4</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Evaluates the strength and flow of arguments throughout your document.
                        </p>
                      </div>
                      
                      <div className="border border-border rounded-lg p-3 bg-card/50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-green-500" />
                            <span className="font-medium">Multilingual Support</span>
                          </div>
                          <Badge variant="outline">50+ Languages</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Analyze documents in over 50 languages with our advanced multilingual models.
                        </p>
                      </div>
                      
                      <div className="border border-border rounded-lg p-3 bg-card/50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span className="font-medium">Style Compliance</span>
                          </div>
                          <Badge variant="outline">APA/MLA/Chicago</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Ensures adherence to academic writing styles and citation formats.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-72 lg:w-96 space-y-4">
                    <div className="bg-background/50 backdrop-blur-sm rounded-lg border border-border p-4">
                      <h4 className="text-sm font-medium mb-3">Analysis Confidence</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Coherence</span>
                            <span>87%</span>
                          </div>
                          <Progress value={87} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Citation Validity</span>
                            <span>92%</span>
                          </div>
                          <Progress value={92} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Argument Strength</span>
                            <span>78%</span>
                          </div>
                          <Progress value={78} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Style Compliance</span>
                            <span>95%</span>
                          </div>
                          <Progress value={95} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={handleAnalysis}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing Content...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Analyze Content
                        </>
                      )}
                    </Button>
                    
                    {isAnalyzing && (
                      <Progress value={progressValue} className="h-2 mt-2" />
                    )}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-medium mb-2">Real-Time Collaborative Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Invite collaborators to analyze documents together in real-time, with version diffing and change tracking.
                  </p>
                  <Button variant="link" size="sm" className="pl-0 mt-1 h-auto text-primary flex items-center">
                    Learn more about collaborative features
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Auto-Tagging Tab */}
            <TabsContent value="auto-tagging" className="mt-0">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Tag className="h-5 w-5 text-primary" />
                        Hierarchical Taxonomy Generation
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Our hybrid TF-IDF and BERT embedding approach assigns semantic tags and builds nested hierarchies 
                        to categorize your academic content with unmatched precision.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="border border-border rounded-lg p-4 bg-card/50">
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <Tag className="h-4 w-4 text-primary" />
                          Suggested Taxonomy
                        </h4>
                        
                        <div className="text-sm space-y-3">
                          <div>
                            <div className="flex items-center mb-1">
                              <span className="font-medium">Computer Science</span>
                              <Badge className="ml-2" variant="outline">Primary</Badge>
                            </div>
                            <div className="pl-5 space-y-1.5 border-l border-border ml-1.5">
                              <div className="flex items-center">
                                <span className="font-medium">Machine Learning</span>
                                <Badge className="ml-2" variant="outline">Secondary</Badge>
                              </div>
                              <div className="pl-4 border-l border-border ml-1.5">
                                <span>Reinforcement Learning</span>
                              </div>
                              <div className="pl-4 border-l border-border ml-1.5">
                                <span>Neural Networks</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center mb-1">
                              <span className="font-medium">Mathematics</span>
                            </div>
                            <div className="pl-5 space-y-1.5 border-l border-border ml-1.5">
                              <div>
                                <span>Probability Theory</span>
                              </div>
                              <div>
                                <span>Linear Algebra</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border border-border rounded-lg p-4 bg-card/50">
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <Globe className="h-4 w-4 text-blue-500" />
                          Ontology Mapping
                        </h4>
                        
                        <div className="text-sm space-y-3">
                          <div className="flex items-center justify-between p-2 rounded bg-background/70 mb-2">
                            <div className="flex items-center">
                              <span>ACM Computing Classification</span>
                            </div>
                            <Badge variant="outline">Connected</Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>H.3.3 Information Search and Retrieval</span>
                              <Badge variant="outline">98% Match</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>I.2.6 Learning</span>
                              <Badge variant="outline">92% Match</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>I.2.1 Applications and Expert Systems</span>
                              <Badge variant="outline">87% Match</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-72 lg:w-96 space-y-4">
                    <div className="bg-background/50 backdrop-blur-sm rounded-lg border border-border p-4">
                      <h4 className="text-sm font-medium mb-3">Tag Statistics</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Primary Tags</span>
                            <span>2 detected</span>
                          </div>
                          <Progress value={40} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Secondary Tags</span>
                            <span>5 detected</span>
                          </div>
                          <Progress value={70} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Tertiary Tags</span>
                            <span>8 detected</span>
                          </div>
                          <Progress value={90} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Ontology Match</span>
                            <span>92%</span>
                          </div>
                          <Progress value={92} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={handleAnalysis}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating Tags...
                        </>
                      ) : (
                        <>
                          <Tag className="h-4 w-4 mr-2" />
                          Generate Smart Tags
                        </>
                      )}
                    </Button>
                    
                    {isAnalyzing && (
                      <Progress value={progressValue} className="h-2 mt-2" />
                    )}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-medium mb-2">Dynamic Tag Refinement</h3>
                  <p className="text-sm text-muted-foreground">
                    Train custom tag models by correcting AI suggestions, creating a personalized tagging system for your institution.
                  </p>
                  <Button variant="link" size="sm" className="pl-0 mt-1 h-auto text-primary flex items-center">
                    Learn more about tag customization
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Plagiarism Detection Tab */}
            <TabsContent value="plagiarism" className="mt-0">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Search className="h-5 w-5 text-primary" />
                        Advanced Plagiarism Detection
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Our cross-lingual plagiarism system can detect similarities across 30+ languages,
                        identify AI-generated content, and check code submissions for unauthorized copying.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="border border-border rounded-lg p-3 bg-card/50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">Cross-Lingual Detection</span>
                          </div>
                          <Badge variant="outline">mBERT</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Detects paraphrased content across 30+ languages using multilingual embeddings.
                        </p>
                      </div>
                      
                      <div className="border border-border rounded-lg p-3 bg-card/50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-amber-500" />
                            <span className="font-medium">AI Content Detection</span>
                          </div>
                          <Badge variant="outline">RoBERTa</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Identifies AI-generated or machine-translated plagiarism with high accuracy.
                        </p>
                      </div>
                      
                      <div className="border border-border rounded-lg p-3 bg-card/50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Code className="h-4 w-4 text-green-500" />
                            <span className="font-medium">Code Similarity</span>
                          </div>
                          <Badge variant="outline">AST Analysis</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Detects similar code structures even when variable names and formatting differ.
                        </p>
                      </div>
                      
                      <div className="border border-border rounded-lg p-3 bg-card/50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <BarChart className="h-4 w-4 text-primary" />
                            <span className="font-medium">Interactive Reports</span>
                          </div>
                          <Badge variant="outline">Heatmap</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Visual heatmaps showing similarity percentages by document section.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-72 lg:w-96 space-y-4">
                    <div className="bg-background/50 backdrop-blur-sm rounded-lg border border-border p-4">
                      <h4 className="text-sm font-medium mb-3">Plagiarism Risk Score</h4>
                      
                      <div className="relative h-32 w-32 mx-auto mb-4">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-2xl font-bold">17%</div>
                        </div>
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle 
                            cx="50" cy="50" r="45" 
                            fill="none" 
                            stroke="currentColor" 
                            stroke-width="8"
                            stroke-opacity="0.1"
                            className="text-primary"
                          />
                          <circle 
                            cx="50" cy="50" r="45" 
                            fill="none" 
                            stroke="currentColor" 
                            stroke-width="8"
                            stroke-dasharray="282.6"
                            stroke-dashoffset="234.6"
                            className="text-primary"
                          />
                        </svg>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Direct matches</span>
                            <span>5%</span>
                          </div>
                          <Progress value={5} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Paraphrased content</span>
                            <span>12%</span>
                          </div>
                          <Progress value={12} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>AI-generated text</span>
                            <span>0%</span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={handleAnalysis}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Checking Originality...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Check Originality
                        </>
                      )}
                    </Button>
                    
                    {isAnalyzing && (
                      <Progress value={progressValue} className="h-2 mt-2" />
                    )}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-medium mb-2">Real-Time Originality Reports</h3>
                  <p className="text-sm text-muted-foreground">
                    Get side-by-side comparisons with flagged sources from academic repositories like arXiv and JSTOR.
                  </p>
                  <Button variant="link" size="sm" className="pl-0 mt-1 h-auto text-primary flex items-center">
                    View sample originality report
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Format Optimization Tab */}
            <TabsContent value="format" className="mt-0">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <RefreshCw className="h-5 w-5 text-primary" />
                        Adaptive Styling Engine
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Our format optimization tools automatically convert between document formats while
                        preserving complex elements like equations and tables, and ensure accessibility compliance.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="border border-border rounded-lg p-3 bg-card/50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">Format Conversion</span>
                          </div>
                          <Badge variant="outline">Pandoc</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Convert between LaTeX, Word, Markdown, and HTML while preserving complex formatting.
                        </p>
                      </div>
                      
                      <div className="border border-border rounded-lg p-3 bg-card/50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-amber-500" />
                            <span className="font-medium">Accessibility Compliance</span>
                          </div>
                          <Badge variant="outline">WCAG 2.1</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Ensure documents meet accessibility standards with automated checks and fixes.
                        </p>
                      </div>
                      
                      <div className="border border-border rounded-lg p-3 bg-card/50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Image className="h-4 w-4 text-green-500" />
                            <span className="font-medium">AI Image Captioning</span>
                          </div>
                          <Badge variant="outline">BLIP-2</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Automatically generate descriptive alt text for figures and tables.
                        </p>
                      </div>
                      
                      <div className="border border-border rounded-lg p-3 bg-card/50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="font-medium">Template Application</span>
                          </div>
                          <Badge variant="outline">Institutional</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Apply university-specific formatting templates and citation styles automatically.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-72 lg:w-96 space-y-4">
                    <div className="bg-background/50 backdrop-blur-sm rounded-lg border border-border p-4">
                      <h4 className="text-sm font-medium mb-3">Format Preview</h4>
                      
                      <div className="border border-border rounded bg-background/70 p-3 mb-4 h-40 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-xs">Upload a document to see format preview</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span>Target format:</span>
                          <Badge>LaTeX</Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Template:</span>
                          <Badge variant="outline">University Thesis</Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Citation style:</span>
                          <Badge variant="outline">APA 7th Edition</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={handleAnalysis}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Optimizing Format...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Optimize Format
                        </>
                      )}
                    </Button>
                    
                    {isAnalyzing && (
                      <Progress value={progressValue} className="h-2 mt-2" />
                    )}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-medium mb-2">Responsive Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    See how your document will look on different devices with our responsive preview engine.
                  </p>
                  <Button variant="link" size="sm" className="pl-0 mt-1 h-auto text-primary flex items-center">
                    Learn more about format optimization
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <div className="px-6 pb-6">
          <div className="w-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                <Brain className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-1">AI Processing Information</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  All document analysis is performed securely using end-to-end encryption. Your data is never stored permanently 
                  and is only processed for the duration of the analysis.
                </p>
                <div className="mt-2 flex gap-2">
                  <Badge variant="outline" className="bg-blue-100/50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                    GDPR Compliant
                  </Badge>
                  <Badge variant="outline" className="bg-blue-100/50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                    FERPA Compliant
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnhancementTabs;
