
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CapsuleForm from "@/components/CapsuleForm";

const Create = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-accent/10">
      <Header />
      <main className="flex-1 pt-24 pb-20">
        <div className="container px-4 md:px-6 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Secure Academic Documents</h1>
            <p className="text-muted-foreground mt-2">
              Upload and secure exam papers, academic records, and other sensitive documents until their intended release date.
            </p>
          </div>
          
          <div className="glass-morphism rounded-xl p-6 md:p-8 shadow-lg border border-white/20">
            <CapsuleForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Create;
