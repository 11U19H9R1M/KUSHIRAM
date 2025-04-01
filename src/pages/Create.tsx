
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CapsuleForm from "@/components/CapsuleForm";
import InteractiveTimeline from "@/components/InteractiveTimeline";

const Create = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-accent/10">
      <Header />
      <main className="flex-1 pt-24 pb-20">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Secure Academic Documents</h1>
            <p className="text-muted-foreground mt-2">
              Upload and secure exam papers, academic records, and other sensitive documents until their intended release date.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="glass-morphism rounded-xl p-6 md:p-8 shadow-lg border border-white/20">
                <CapsuleForm />
              </div>
            </div>
            
            <div className="lg:col-span-1 space-y-6">
              <InteractiveTimeline events={[]} />
              
              <div className="glass-morphism rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-medium mb-4">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Explore our guides to learn more about securing your academic documents effectively.
                </p>
                <Button variant="link" className="p-0 h-auto text-primary">View Documentation</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Create;
