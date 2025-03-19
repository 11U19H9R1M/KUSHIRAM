
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CapsuleForm from "@/components/CapsuleForm";

const Create = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-20">
        <div className="container px-4 md:px-6 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Create a New Time Capsule</h1>
            <p className="text-muted-foreground mt-2">
              Fill in the details below to create your digital time capsule. You can add text, photos, and videos.
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
            <CapsuleForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Create;
