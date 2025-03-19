
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

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Sample data - in a real app this would come from an API
  const capsules = [
    {
      id: "capsule-1",
      title: "Graduation Memories 2023",
      description: "A collection of our favorite moments from graduation day and the celebrations that followed.",
      coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      createdAt: new Date(2023, 5, 15),
      unlockDate: new Date(2028, 5, 15),
      isUnlocked: false,
      contributorCount: 5
    },
    {
      id: "capsule-2",
      title: "Wedding Day",
      description: "Our special day captured forever, to be revisited on our 10th anniversary.",
      coverImage: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      createdAt: new Date(2022, 8, 20),
      unlockDate: new Date(2032, 8, 20),
      isUnlocked: false,
      contributorCount: 2
    },
    {
      id: "capsule-3",
      title: "Letter to My Future Self",
      description: "Thoughts, aspirations, and predictions about where I'll be in five years.",
      coverImage: "https://images.unsplash.com/photo-1536859355448-76f92ebdc33d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
      createdAt: new Date(2023, 1, 1),
      unlockDate: new Date(2028, 1, 1),
      isUnlocked: false,
      contributorCount: 1
    },
    {
      id: "capsule-4",
      title: "First Year of College",
      description: "Memories from my freshman year at university.",
      coverImage: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      createdAt: new Date(2022, 9, 10),
      unlockDate: new Date(2026, 9, 10),
      isUnlocked: false,
      contributorCount: 3
    },
    {
      id: "capsule-5",
      title: "Summer Vacation 2022",
      description: "Our amazing trip to Greece and the Mediterranean.",
      coverImage: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      createdAt: new Date(2022, 7, 5),
      unlockDate: new Date(2023, 7, 5),
      isUnlocked: true,
      contributorCount: 4
    },
    {
      id: "capsule-6",
      title: "New Year's Resolutions 2023",
      description: "My goals and hopes for the year, to be revisited next New Year's Eve.",
      coverImage: "https://images.unsplash.com/photo-1546271227-b0a20f7b094a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      createdAt: new Date(2023, 0, 1),
      unlockDate: new Date(2023, 11, 31),
      isUnlocked: true,
      contributorCount: 1
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    window.scrollTo(0, 0);
  }, []);

  // Filter capsules based on the active tab and search query
  const filteredCapsules = capsules.filter(capsule => {
    const matchesSearch = capsule.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          capsule.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "locked") return !capsule.isUnlocked && matchesSearch;
    if (filter === "unlocked") return capsule.isUnlocked && matchesSearch;
    
    return matchesSearch;
  });

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
            <Button asChild size="lg" className="rounded-full">
              <Link to="/create">
                <Plus className="w-4 h-4 mr-2" />
                Create New Capsule
              </Link>
            </Button>
          </div>
          
          <div className="mb-6">
            <Tabs defaultValue="all" onValueChange={setFilter} className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <TabsList>
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
                      className="pl-9"
                    />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          Date Created (Newest)
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Date Created (Oldest)
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Unlock Date (Soonest)
                        </DropdownMenuItem>
                        <DropdownMenuItem>
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
                      <div key={i} className="rounded-xl border border-border overflow-hidden animate-pulse">
                        <div className="aspect-[3/2] bg-secondary"></div>
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
                  <div className="py-20 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                      <Archive className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No capsules found</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      {searchQuery ? 
                        `No capsules match your search for "${searchQuery}".` : 
                        "You haven't created any time capsules yet. Start by creating your first one!"}
                    </p>
                    <Button asChild>
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
                  <div className="py-20 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
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
                  <div className="py-20 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
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
