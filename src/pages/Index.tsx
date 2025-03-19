
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, Image, Lock, Users } from "lucide-react";
import CapsuleCard from "@/components/CapsuleCard";

const ExampleCapsules = () => {
  const examples = [
    {
      id: "example-1",
      title: "Graduation Memories 2023",
      description: "A collection of our favorite moments from graduation day and the celebrations that followed.",
      coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      createdAt: new Date(2023, 5, 15),
      unlockDate: new Date(2028, 5, 15),
      isUnlocked: false,
      contributorCount: 5
    },
    {
      id: "example-2",
      title: "Wedding Day",
      description: "Our special day captured forever, to be revisited on our 10th anniversary.",
      coverImage: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      createdAt: new Date(2022, 8, 20),
      unlockDate: new Date(2032, 8, 20),
      isUnlocked: false,
      contributorCount: 2
    },
    {
      id: "example-3",
      title: "Letter to My Future Self",
      description: "Thoughts, aspirations, and predictions about where I'll be in five years.",
      coverImage: "https://images.unsplash.com/photo-1536859355448-76f92ebdc33d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
      createdAt: new Date(2023, 1, 1),
      unlockDate: new Date(2028, 1, 1),
      isUnlocked: false,
      contributorCount: 1
    }
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Popular Capsule Types</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore some of the ways people are using TimeVault to preserve their special moments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map(example => (
            <CapsuleCard key={example.id} {...example} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link to="/dashboard">
              View More Examples
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background to-secondary/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Creating and sharing time capsules is simple and intuitive with our thoughtfully designed platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-3">Create Your Capsule</h3>
            <p className="text-muted-foreground">
              Add text, photos, videos, and other digital memories to your capsule.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-3">Set Unlock Conditions</h3>
            <p className="text-muted-foreground">
              Choose when your capsule will unlock - a specific date, event, or milestone.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-3">Rediscover Later</h3>
            <p className="text-muted-foreground">
              When the time comes, receive a notification and relive your preserved memories.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/create">
              Create Your Time Capsule
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <ExampleCapsules />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
