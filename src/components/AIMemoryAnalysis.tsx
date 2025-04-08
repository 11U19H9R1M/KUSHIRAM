
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Sparkles, ChevronDown, ChevronUp, ShieldCheck, Zap, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface Insight {
  title: string;
  description: string;
  icon: JSX.Element;
}

const AIMemoryAnalysis = () => {
  const [memory, setMemory] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<Insight[] | null>(null);
  const [expanded, setExpanded] = useState(true);
  
  const sampleInsights: Insight[] = [
    {
      title: "Emotional Sentiment",
      description: "Your graduation memories are predominantly positive, with themes of pride, accomplishment, and gratitude appearing most frequently.",
      icon: <span className="text-yellow-500">😊</span>
    },
    {
      title: "Key Relationships",
      description: "Your memories highlight strong connections with professors and classmates, suggesting these relationships were fundamental to your academic experience.",
      icon: <span className="text-pink-500">❤️</span>
    },
    {
      title: "Growth Narrative",
      description: "A clear progression from uncertainty to confidence appears in your memories, showing significant personal growth throughout your academic journey.",
      icon: <span className="text-green-500">🌱</span>
    },
    {
      title: "Future Aspirations",
      description: "Your reflections contain numerous references to future goals, indicating graduation was seen as a stepping stone rather than a destination.",
      icon: <span className="text-blue-500">🚀</span>
    }
  ];
  
  const simulateAnalysis = () => {
    if (!memory.trim()) return;
    
    setAnalyzing(true);
    setResults(null);
    
    // Simulate AI processing time
    setTimeout(() => {
      setAnalyzing(false);
      setResults(sampleInsights);
    }, 2500);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-indigo-950/50 via-background/70 to-background/90 backdrop-blur-md">
        <CardContent className="p-0">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
            
            <div className="p-4 md:p-6 relative z-10">
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-2 shadow-lg">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg md:text-xl font-medium bg-gradient-to-r from-indigo-300 to-purple-200 bg-clip-text text-transparent">AI Memory Analysis</h3>
                      <Badge variant="outline" className="bg-indigo-500/20 border-indigo-500/30">Beta</Badge>
                    </div>
                    <div className="flex items-center mt-0.5">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <Star className="h-3 w-3 text-yellow-300/50" />
                      <span className="text-xs text-muted-foreground ml-1">4.2/5</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setExpanded(!expanded)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {expanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-muted-foreground mb-6 text-sm md:text-base">
                      Our AI can analyze your graduation memories to extract meaningful insights, 
                      highlight patterns, and identify the emotions and themes that defined your academic journey.
                    </p>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                        Enter your graduation memories or reflections
                      </label>
                      <Textarea
                        value={memory}
                        onChange={(e) => setMemory(e.target.value)}
                        placeholder="Describe your graduation day, academic journey, or any memories you'd like to analyze..."
                        className="min-h-[120px] border-indigo-500/20 bg-background/50 focus-visible:ring-indigo-500/50 resize-none"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 bg-indigo-500/10 p-2 rounded-md">
                      <ShieldCheck className="h-3 w-3 text-indigo-400" />
                      <span>Your memories are private and processed securely with end-to-end encryption</span>
                    </div>
                    
                    <div className="flex justify-end mb-6">
                      <Button 
                        onClick={simulateAnalysis} 
                        disabled={analyzing || !memory.trim()} 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md"
                      >
                        {analyzing ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing Memories...
                          </>
                        ) : (
                          <>
                            <Zap className="mr-2 h-4 w-4" />
                            Analyze Memories
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {results && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="border border-indigo-500/20 rounded-lg p-4 md:p-6 bg-gradient-to-br from-indigo-900/20 to-background/80"
                      >
                        <h4 className="font-medium mb-4 flex items-center gap-2 text-indigo-200">
                          <Sparkles className="h-4 w-4 text-indigo-400" />
                          Memory Analysis Results
                        </h4>
                        
                        <div className="space-y-4 md:space-y-5">
                          {results.map((insight, index) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.15 }}
                              className="flex gap-3 p-3 rounded-md hover:bg-indigo-500/10 transition-colors"
                            >
                              <div className="mt-0.5 text-lg md:text-xl">{insight.icon}</div>
                              <div>
                                <h5 className="font-medium text-sm md:text-base">{insight.title}</h5>
                                <p className="text-muted-foreground text-xs md:text-sm">{insight.description}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="mt-6 text-center">
                          <Button 
                            variant="outline" 
                            className="text-xs border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300"
                          >
                            Save this analysis to your memory capsule
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AIMemoryAnalysis;
