
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CapsuleForm from "@/components/CapsuleForm";
import { motion } from "framer-motion";
import { FileText, Lock, Shield } from "lucide-react";

const Create = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-accent/10">
      <Header />
      <main className="flex-1 pt-24 pb-20 relative">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl opacity-40" />
          <div className="hidden md:block absolute top-1/3 left-10 w-40 h-40 bg-secondary/10 rounded-full blur-2xl opacity-50" />
        </div>
        
        <div className="container px-4 md:px-6 max-w-4xl relative z-10">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Secure Academic Documents</h1>
            </motion.div>
            
            <motion.p 
              className="text-muted-foreground mt-2 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Upload and secure exam papers, academic records, and other sensitive documents until their intended release date. All documents are encrypted and stored securely.
            </motion.p>
            
            <motion.div 
              className="mt-6 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <span>Secure storage</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <span>Timed release</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <span>Access control</span>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="glass-floating rounded-xl p-6 md:p-8 shadow-lg border border-white/20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <CapsuleForm />
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Create;
