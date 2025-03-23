
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Users, Calendar, Heart } from "lucide-react";

interface GalleryItem {
  id: number;
  image: string;
  title: string;
  date: string;
  location: string;
  people: string[];
  likes: number;
  description: string;
}

const GraduationGallery = () => {
  const [liked, setLiked] = useState<number[]>([]);
  
  const toggleLike = (id: number) => {
    if (liked.includes(id)) {
      setLiked(liked.filter(itemId => itemId !== id));
    } else {
      setLiked([...liked, id]);
    }
  };
  
  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      title: "Graduation Ceremony",
      date: "May 15, 2024",
      location: "University Auditorium",
      people: ["Alex", "Jamie", "Taylor"],
      likes: 42,
      description: "The moment we've all been waiting for. Caps flying in the air and diplomas in hand!"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      title: "Pre-Graduation Party",
      date: "May 10, 2024",
      location: "Downtown Loft",
      people: ["Riley", "Jordan", "Casey"],
      likes: 37,
      description: "Last hurrah before we officially became graduates. Unforgettable night with the best people!"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1627556704302-624286467c65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      title: "Thesis Presentation Day",
      date: "April 28, 2024",
      location: "Science Building",
      people: ["Prof. Johnson", "Research Team"],
      likes: 29,
      description: "Successfully presented my thesis after months of hard work. A defining moment of my academic journey."
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      title: "Campus Last Walk",
      date: "May 16, 2024",
      location: "University Campus",
      people: ["Sam", "Charlie", "Quinn"],
      likes: 51,
      description: "Our final walk through the campus as students. Every corner holds a memory of the past years."
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1627556704290-2b1f5c70110b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      title: "Family Celebration",
      date: "May 17, 2024",
      location: "Riverside Restaurant",
      people: ["Mom", "Dad", "Sister", "Brother"],
      likes: 64,
      description: "Celebrating achievement with those who supported this journey from day one. Couldn't have done it without them!"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      title: "Dorm Room Goodbye",
      date: "May 20, 2024",
      location: "University Housing",
      people: ["Roommates"],
      likes: 33,
      description: "Four years of memories in one room. Hard to say goodbye to a place that became home."
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {galleryItems.map((galleryItem) => (
        <Dialog key={galleryItem.id}>
          <DialogTrigger asChild>
            <motion.div 
              variants={item}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="cursor-pointer"
            >
              <Card className="overflow-hidden h-full bg-background/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-border/50">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={galleryItem.image} 
                    alt={galleryItem.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-medium text-lg mb-2">{galleryItem.title}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      {galleryItem.date}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <MapPin className="h-3 w-3" />
                      {galleryItem.location}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex -space-x-2">
                      {galleryItem.people.slice(0, 3).map((person, index) => (
                        <Avatar key={index} className="border-2 border-background w-7 h-7">
                          <AvatarFallback className="text-xs">{person[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                      {galleryItem.people.length > 3 && (
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                          +{galleryItem.people.length - 3}
                        </div>
                      )}
                    </div>
                    
                    <button 
                      className="flex items-center gap-1 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(galleryItem.id);
                      }}
                    >
                      <Heart className={`h-4 w-4 ${liked.includes(galleryItem.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                      <span>{liked.includes(galleryItem.id) ? galleryItem.likes + 1 : galleryItem.likes}</span>
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </DialogTrigger>
          
          <DialogContent className="glass-morphism max-w-3xl">
            <DialogHeader>
              <DialogTitle>{galleryItem.title}</DialogTitle>
              <DialogDescription>{galleryItem.date}</DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="aspect-square overflow-hidden rounded-md">
                <img 
                  src={galleryItem.image} 
                  alt={galleryItem.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-1">Location</h4>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {galleryItem.location}
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-1">People</h4>
                  <div className="flex flex-wrap gap-2">
                    {galleryItem.people.map((person, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {person}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-muted-foreground">{galleryItem.description}</p>
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <button className="flex items-center gap-1">
                    <Heart className={`h-5 w-5 ${liked.includes(galleryItem.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{liked.includes(galleryItem.id) ? galleryItem.likes + 1 : galleryItem.likes} likes</span>
                  </button>
                  
                  <button className="text-sm text-primary">Add to Capsule</button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </motion.div>
  );
};

export default GraduationGallery;
