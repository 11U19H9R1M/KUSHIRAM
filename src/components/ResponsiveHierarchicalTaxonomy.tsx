
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Tag, ArrowRight, FileText, Sparkles, RefreshCw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HierarchicalTag {
  id: string;
  name: string;
  color?: string;
  children?: HierarchicalTag[];
  ontologyCode?: string;
  confidence?: number;
}

interface OntologyMapping {
  code: string;
  name: string;
  description: string;
  confidence: number;
}

interface TagStats {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

interface ResponsiveHierarchicalTaxonomyProps {
  documentTitle?: string;
}

const ResponsiveHierarchicalTaxonomy = ({ documentTitle = "Quantum Computing: A Comprehensive Analysis" }: ResponsiveHierarchicalTaxonomyProps) => {
  const [activeTab, setActiveTab] = useState<"taxonomy" | "ontology" | "stats">("taxonomy");
  const [expandedTags, setExpandedTags] = useState<string[]>([]);

  // Sample hierarchical tags data
  const hierarchicalTags: HierarchicalTag[] = [
    {
      id: "cs",
      name: "Computer Science",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      children: [
        {
          id: "cs-ml",
          name: "Machine Learning",
          color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
          children: [
            {
              id: "cs-ml-dl",
              name: "Deep Learning",
              color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
              ontologyCode: "I.2.6",
              confidence: 98
            },
            {
              id: "cs-ml-rl",
              name: "Reinforcement Learning",
              color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
              ontologyCode: "I.2.8",
              confidence: 92
            }
          ]
        },
        {
          id: "cs-quantum",
          name: "Quantum Computing",
          color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
          ontologyCode: "F.1.1",
          confidence: 99
        }
      ]
    },
    {
      id: "physics",
      name: "Physics",
      color: "bg-green-500/10 text-green-500 border-green-500/20",
      children: [
        {
          id: "physics-quantum",
          name: "Quantum Mechanics",
          color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
          ontologyCode: "PACS 03.65.-w",
          confidence: 95
        }
      ]
    },
    {
      id: "math",
      name: "Mathematics",
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      children: [
        {
          id: "math-lin",
          name: "Linear Algebra",
          color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
          ontologyCode: "MSC 15-XX",
          confidence: 90
        }
      ]
    }
  ];

  // Sample ontology mappings
  const ontologyMappings: OntologyMapping[] = [
    {
      code: "I.2.6",
      name: "Learning (ACM)",
      description: "Concepts, methods, and algorithms related to machine learning",
      confidence: 98
    },
    {
      code: "I.2.8",
      name: "Problem Solving, Control Methods, and Search (ACM)",
      description: "Includes reinforcement learning and planning methods",
      confidence: 92
    },
    {
      code: "F.1.1",
      name: "Models of Computation (ACM)",
      description: "Includes quantum computation and complexity theory",
      confidence: 99
    },
    {
      code: "PACS 03.65.-w",
      name: "Quantum Mechanics (AIP)",
      description: "Fundamental concepts and formalism of quantum mechanics",
      confidence: 95
    },
    {
      code: "MSC 15-XX",
      name: "Linear Algebra (AMS)",
      description: "Linear algebra, matrix theory, and algebraic systems",
      confidence: 90
    }
  ];

  // Sample tag statistics
  const tagStats: TagStats[] = [
    { category: "Computer Science", count: 23, percentage: 46, color: "bg-blue-500" },
    { category: "Physics", count: 15, percentage: 30, color: "bg-green-500" },
    { category: "Mathematics", count: 12, percentage: 24, color: "bg-amber-500" }
  ];

  const toggleExpanded = (id: string) => {
    if (expandedTags.includes(id)) {
      setExpandedTags(expandedTags.filter(tagId => tagId !== id));
    } else {
      setExpandedTags([...expandedTags, id]);
    }
  };

  const renderHierarchicalTag = (tag: HierarchicalTag, level = 0) => {
    const isExpanded = expandedTags.includes(tag.id);
    const hasChildren = tag.children && tag.children.length > 0;

    return (
      <div key={tag.id} className="mb-2">
        <div 
          className={`flex items-center justify-between p-2 rounded-md hover:bg-accent/30 transition-colors cursor-pointer ${tag.color || "bg-secondary/50"}`}
          style={{ marginLeft: `${level * 1}rem` }}
          onClick={() => hasChildren && toggleExpanded(tag.id)}
        >
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>{tag.name}</span>
            {tag.ontologyCode && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs">
                      {tag.ontologyCode}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Ontology mapping with {tag.confidence}% confidence</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {hasChildren && (
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
              <ArrowRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </Button>
          )}
        </div>
        {isExpanded && hasChildren && tag.children?.map(child => renderHierarchicalTag(child, level + 1))}
      </div>
    );
  };

  return (
    <Card className="glass-morphism border-white/20 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-primary" />
            <span>Taxonomy Analysis: {documentTitle}</span>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Badge 
              variant={activeTab === "taxonomy" ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => setActiveTab("taxonomy")}
            >
              Taxonomy
            </Badge>
            <Badge 
              variant={activeTab === "ontology" ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => setActiveTab("ontology")}
            >
              Ontology
            </Badge>
            <Badge 
              variant={activeTab === "stats" ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => setActiveTab("stats")}
            >
              Statistics
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeTab === "taxonomy" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Hierarchical taxonomy generated for your document
              </p>
              <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
                <RefreshCw className="h-3 w-3" />
                Regenerate
              </Button>
            </div>
            <div className="lg:max-h-[400px] overflow-y-auto pr-2 space-y-3">
              {hierarchicalTags.map(tag => renderHierarchicalTag(tag))}
            </div>
            <div className="mt-6">
              <Button className="w-full sm:w-auto">
                <FileText className="h-4 w-4 mr-2" />
                Export Taxonomy
              </Button>
            </div>
          </div>
        )}

        {activeTab === "ontology" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Mapped to standardized academic ontologies
            </p>
            <div className="space-y-4 lg:max-h-[400px] overflow-y-auto pr-2">
              {ontologyMappings.map(mapping => (
                <div key={mapping.code} className="p-3 rounded-md bg-accent/10 border border-border">
                  <div className="flex items-center justify-between">
                    <Badge className="mb-1">{mapping.code}</Badge>
                    <div className="w-28 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary"
                        style={{ width: `${mapping.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                  <h4 className="font-medium">{mapping.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{mapping.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Statistical analysis of document taxonomy
            </p>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-6 mb-6">
              <div className="relative w-40 h-40 mx-auto md:mx-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {tagStats.map((stat, i) => {
                    const previousAngles = tagStats
                      .slice(0, i)
                      .reduce((acc, s) => acc + s.percentage, 0);
                    return (
                      <circle
                        key={stat.category}
                        r="15.9"
                        cx="50"
                        cy="50"
                        fill="transparent"
                        stroke={stat.color}
                        strokeWidth="30"
                        strokeDasharray={`${stat.percentage} ${100 - stat.percentage}`}
                        strokeDashoffset={`${100 - previousAngles}`}
                        className="opacity-80"
                      ></circle>
                    );
                  })}
                </svg>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-2">
                {tagStats.map(stat => (
                  <div key={stat.category} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                    <div>
                      <p className="text-sm font-medium">{stat.category}</p>
                      <p className="text-xs text-muted-foreground">{stat.count} tags ({stat.percentage}%)</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Top Referenced Categories</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-md bg-accent/10 border border-border">
                  <p className="font-medium">Quantum Computing</p>
                  <div className="flex items-center mt-1">
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "78%" }}></div>
                    </div>
                    <span className="ml-2 text-xs">78%</span>
                  </div>
                </div>
                <div className="p-3 rounded-md bg-accent/10 border border-border">
                  <p className="font-medium">Quantum Mechanics</p>
                  <div className="flex items-center mt-1">
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "65%" }}></div>
                    </div>
                    <span className="ml-2 text-xs">65%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResponsiveHierarchicalTaxonomy;
