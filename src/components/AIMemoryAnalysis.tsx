
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Sparkles, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <Card className="glass-morphism border-primary/20 overflow-hidden">
      <CardContent className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full p-2">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-medium">AI Memory Analysis</h3>
          </div>
          
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
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
              <p className="text-muted-foreground mb-6">
                Our AI can analyze your graduation memories to extract meaningful insights, 
                highlight patterns, and identify the emotions and themes that defined your academic journey.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Enter your graduation memories or reflections
                </label>
                <Textarea
                  value={memory}
                  onChange={(e) => setMemory(e.target.value)}
                  placeholder="Describe your graduation day, academic journey, or any memories you'd like to analyze..."
                  className="min-h-[150px] glass-input"
                />
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                <ShieldCheck className="h-3 w-3" />
                <span>Your memories are private and processed securely</span>
              </div>
              
              <div className="flex justify-end mb-6">
                <Button 
                  onClick={simulateAnalysis} 
                  disabled={analyzing || !memory.trim()} 
                  className="glass-primary-button"
                >
                  {analyzing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
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
                  className="border rounded-lg p-4 bg-card/50"
                >
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Memory Analysis Results
                  </h4>
                  
                  <div className="space-y-4">
                    {results.map((insight, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex gap-3"
                      >
                        <div className="mt-1 text-lg">{insight.icon}</div>
                        <div>
                          <h5 className="font-medium text-sm">{insight.title}</h5>
                          <p className="text-muted-foreground text-sm">{insight.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button variant="link" className="text-xs text-primary">
                      Save this analysis to your memory capsule
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default AIMemoryAnalysis;
