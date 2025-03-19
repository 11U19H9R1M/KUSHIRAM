
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  ChevronLeft, 
  Clock, 
  Download, 
  Lock, 
  Share2, 
  Star, 
  Users 
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ViewCapsule = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // Sample data - in a real app this would come from an API
  const capsule = {
    id: id || "404",
    title: "Graduation Memories 2023",
    description: "A collection of our favorite moments from graduation day and the celebrations that followed.",
    coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    createdAt: new Date(2023, 5, 15),
    unlockDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 100), // 100 days from now
    creator: {
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    contributors: [
      { name: "Jane Smith", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
      { name: "Alex Johnson", avatar: "https://randomuser.me/api/portraits/men/75.jpg" },
      { name: "Emily Brown", avatar: "https://randomuser.me/api/portraits/women/33.jpg" }
    ],
    content: {
      message: "To the future us - remember how we felt on this day, the pride, the joy, the sense of accomplishment. We did it! We graduated despite all the challenges. This is just the beginning of our journey. May we always remember the friendships we've formed and the memories we've made. Here's to the future!",
      photos: [
        { url: "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80", caption: "Graduation day" },
        { url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80", caption: "With friends" },
        { url: "https://images.unsplash.com/photo-1627556704290-2b1f5c70343e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80", caption: "Celebration" }
      ]
    }
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Check if the capsule should be unlocked
    const checkUnlockStatus = () => {
      const now = new Date();
      if (now >= capsule.unlockDate) {
        setIsUnlocked(true);
      } else {
        // Update countdown
        setCountdown(formatDistanceToNow(capsule.unlockDate, { addSuffix: true }));
      }
    };
    
    checkUnlockStatus();
    const timer = setInterval(checkUnlockStatus, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [capsule.unlockDate]);

  // For demo purposes, allow manual unlocking
  const handleManualUnlock = () => {
    setIsUnlocked(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-20 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-secondary mb-4"></div>
            <div className="w-48 h-6 bg-secondary rounded mb-2"></div>
            <div className="w-32 h-4 bg-secondary rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-20">
        <div className="container px-4 md:px-6">
          <div className="mb-6">
            <Button asChild variant="ghost" size="sm" className="mb-4">
              <Link to="/dashboard">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to My Capsules
              </Link>
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-3xl font-bold tracking-tight">{capsule.title}</h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Star className="w-4 h-4 mr-2" />
                  Favorite
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="aspect-[16/9] rounded-xl overflow-hidden border border-border mb-6 bg-secondary">
                <img 
                  src={capsule.coverImage} 
                  alt={capsule.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {isUnlocked ? (
                <div className="animate-fade-up">
                  <Tabs defaultValue="message">
                    <TabsList className="mb-4">
                      <TabsTrigger value="message">Message</TabsTrigger>
                      <TabsTrigger value="photos">Photos</TabsTrigger>
                    </TabsList>
                    <TabsContent value="message" className="rounded-xl border border-border p-6 bg-card">
                      <h3 className="text-lg font-medium mb-4">Message</h3>
                      <p className="whitespace-pre-line text-balance">{capsule.content.message}</p>
                    </TabsContent>
                    <TabsContent value="photos">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {capsule.content.photos.map((photo, index) => (
                          <div key={index} className="group relative rounded-xl overflow-hidden border border-border">
                            <div className="aspect-square bg-secondary">
                              <img 
                                src={photo.url} 
                                alt={photo.caption || `Photo ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                              <div className="p-4 w-full">
                                <p className="text-sm font-medium text-white">{photo.caption}</p>
                                <Button variant="ghost" size="sm" className="mt-2 text-white/90 hover:text-white p-0">
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="rounded-xl border border-border p-10 bg-card flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Lock className="w-8 h-8 text-primary animate-soft-pulse" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">This capsule is still locked</h2>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    This time capsule will automatically unlock {countdown}.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={handleManualUnlock}>
                      Unlock Now
                    </Button>
                    <Button variant="outline">
                      Set Reminder
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-border p-6 bg-card sticky top-24">
                <h3 className="text-lg font-medium mb-4">Capsule Details</h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Status</p>
                    <Badge variant={isUnlocked ? "default" : "secondary"} className="mb-1">
                      {isUnlocked ? "Unlocked" : "Locked"}
                    </Badge>
                    {!isUnlocked && (
                      <p className="text-sm text-muted-foreground">Unlocks {countdown}</p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Dates</p>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <Calendar className="w-4 h-4 text-muted-foreground mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Created</p>
                          <p className="text-sm text-muted-foreground">{format(capsule.createdAt, "PPP")}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="w-4 h-4 text-muted-foreground mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Unlocks</p>
                          <p className="text-sm text-muted-foreground">{format(capsule.unlockDate, "PPP")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Contributors</p>
                    <div className="flex -space-x-2 mb-2">
                      <img 
                        src={capsule.creator.avatar} 
                        alt={capsule.creator.name}
                        className="w-8 h-8 rounded-full border-2 border-background"
                      />
                      {capsule.contributors.map((contributor, index) => (
                        <img 
                          key={index}
                          src={contributor.avatar} 
                          alt={contributor.name}
                          className="w-8 h-8 rounded-full border-2 border-background"
                        />
                      ))}
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs border-2 border-background">
                        +2
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Users className="w-4 h-4 mr-2" />
                      View All Contributors
                    </Button>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {capsule.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ViewCapsule;
