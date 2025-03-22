import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CapsuleCard from "@/components/CapsuleCard";
import { Button } from "@/components/ui/button";
import { 
  Archive, 
  ChevronDown, 
  Filter, 
  Plus, 
  Search 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { SearchNotification } from "@/components/ui/search-notification";
import { loadDashboardCapsules } from "@/lib/storage";

interface Capsule {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  createdAt: Date | string;
  unlockDate: Date | string;
  isUnlocked: boolean;
  contributorCount?: number;
  [key: string]: any;
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [sortOrder, setSortOrder] = useState("newest");
  
  useEffect(() => {
    const loadCapsulesData = () => {
      try {
        const formattedCapsules = loadDashboardCapsules();
        setCapsules(formattedCapsules);
      } catch (error) {
        console.error("Error loading capsules:", error);
        toast.error("Failed to load your time capsules");
      }
      setIsLoading(false);
    };

    setTimeout(() => {
      loadCapsulesData();
    }, 800);
    
    window.scrollTo(0, 0);
  }, []);

  const handleSortChange = (order: string) => {
    setSortOrder(order);
  };

  const sortCapsules = (capsulesToSort: Capsule[]) => {
    switch (sortOrder) {
      case "newest":
        return [...capsulesToSort].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return [...capsulesToSort].sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "unlock-soonest":
        return [...capsulesToSort].sort((a, b) => 
          new Date(a.unlockDate).getTime() - new Date(b.unlockDate).getTime()
        );
      case "alphabetical":
        return [...capsulesToSort].sort((a, b) => 
          a.title.localeCompare(b.title)
        );
      default:
        return capsulesToSort;
    }
  };

  const getFilteredCapsules = () => {
    const filtered = capsules.filter(capsule => {
      const matchesSearch = capsule.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          capsule.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filter === "all") return matchesSearch;
      if (filter === "locked") return !capsule.isUnlocked && matchesSearch;
      if (filter === "unlocked") return capsule.isUnlocked && matchesSearch;
      
      return matchesSearch;
    });

    return sortCapsules(filtered);
  };

  const filteredCapsules = getFilteredCapsules();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Time Capsules</h1>
              <p className="text-muted-foreground mt-1">
                Manage and view all your created and contributed time capsules.
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full glass-primary-button">
              <Link to="/create">
                <Plus className="w-4 h-4 mr-2" />
                Create New Capsule
              </Link>
            </Button>
          </div>
          
          <SearchNotification />
          
          <div className="mb-6">
            <Tabs defaultValue="all" onValueChange={setFilter} className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <TabsList className="glass-tabs">
                  <TabsTrigger value="all">All Capsules</TabsTrigger>
                  <TabsTrigger value="locked">Locked</TabsTrigger>
                  <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search capsules..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-9 glass-input"
                    />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="glass-button">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 glass-morphism">
                      <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => handleSortChange("newest")} className={sortOrder === "newest" ? "bg-accent/50" : ""}>
                          Date Created (Newest)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSortChange("oldest")} className={sortOrder === "oldest" ? "bg-accent/50" : ""}>
                          Date Created (Oldest)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSortChange("unlock-soonest")} className={sortOrder === "unlock-soonest" ? "bg-accent/50" : ""}>
                          Unlock Date (Soonest)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSortChange("alphabetical")} className={sortOrder === "alphabetical" ? "bg-accent/50" : ""}>
                          Alphabetical (A-Z)
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <TabsContent value="all" className="mt-0">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="rounded-xl border border-border overflow-hidden animate-pulse glass-card">
                        <div className="aspect-[3/2] bg-secondary/50 backdrop-blur-sm"></div>
                        <div className="p-5">
                          <div className="w-3/4 h-6 bg-secondary rounded mb-2"></div>
                          <div className="w-full h-4 bg-secondary rounded mb-4"></div>
                          <div className="flex gap-4">
                            <div className="w-1/3 h-3 bg-secondary rounded"></div>
                            <div className="w-1/3 h-3 bg-secondary rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredCapsules.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCapsules.map(capsule => (
                      <CapsuleCard key={capsule.id} {...capsule} />
                    ))}
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center text-center glass-morphism rounded-xl p-8">
                    <div className="w-16 h-16 rounded-full bg-secondary/50 backdrop-blur-sm flex items-center justify-center mb-4">
                      <Archive className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No capsules found</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      {searchQuery ? 
                        `No capsules match your search for "${searchQuery}".` : 
                        "You haven't created any time capsules yet. Start by creating your first one!"}
                    </p>
                    <Button asChild className="glass-primary-button">
                      <Link to="/create">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Capsule
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="locked" className="mt-0">
                {!isLoading && filteredCapsules.length === 0 && (
                  <div className="py-20 flex flex-col items-center text-center glass-morphism rounded-xl p-8">
                    <div className="w-16 h-16 rounded-full bg-secondary/50 backdrop-blur-sm flex items-center justify-center mb-4">
                      <Archive className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No locked capsules found</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      {searchQuery ? 
                        `No locked capsules match your search for "${searchQuery}".` : 
                        "You don't have any locked time capsules. Create one to start preserving memories."}
                    </p>
                    <Button asChild>
                      <Link to="/create">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Capsule
                      </Link>
                    </Button>
                  </div>
                )}
                {!isLoading && filteredCapsules.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCapsules.map(capsule => (
                      <CapsuleCard key={capsule.id} {...capsule} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="unlocked" className="mt-0">
                {!isLoading && filteredCapsules.length === 0 && (
                  <div className="py-20 flex flex-col items-center text-center glass-morphism rounded-xl p-8">
                    <div className="w-16 h-16 rounded-full bg-secondary/50 backdrop-blur-sm flex items-center justify-center mb-4">
                      <Archive className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No unlocked capsules found</h3>
                    <p className="text-muted-foreground max-w-md">
                      {searchQuery ? 
                        `No unlocked capsules match your search for "${searchQuery}".` : 
                        "You don't have any unlocked time capsules yet. They will appear here once they're ready to be opened."}
                    </p>
                  </div>
                )}
                {!isLoading && filteredCapsules.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCapsules.map(capsule => (
                      <CapsuleCard key={capsule.id} {...capsule} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
