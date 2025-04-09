
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, CheckCircle, XCircle, FileDigit, LoaderCircle, Database, Clock, Link } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VerificationStep {
  id: string;
  status: "pending" | "loading" | "success" | "error";
  title: string;
  description: string;
  icon: React.ElementType;
}

export default function BlockchainVerification() {
  const [documentHash, setDocumentHash] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("verify");
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([
    {
      id: "hash-validation",
      status: "pending",
      title: "Hash Validation",
      description: "Validating document hash format",
      icon: FileDigit
    },
    {
      id: "block-search",
      status: "pending",
      title: "Blockchain Search",
      description: "Searching across multiple blockchain networks",
      icon: Database
    },
    {
      id: "timestamp-check",
      status: "pending",
      title: "Timestamp Verification",
      description: "Verifying document timestamp",
      icon: Clock
    },
    {
      id: "consensus-check",
      status: "pending",
      title: "Consensus Check",
      description: "Checking node consensus validation",
      icon: Link
    }
  ]);
  
  const { verifyDocumentHash } = useAuth();

  useEffect(() => {
    if (isVerifying) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 5;
        });
      }, 150);

      return () => clearInterval(timer);
    }
  }, [isVerifying]);

  const resetVerification = () => {
    setVerificationResult(null);
    setProgress(0);
    setVerificationSteps(steps => 
      steps.map(step => ({ ...step, status: "pending" }))
    );
  };

  const handleVerify = async () => {
    if (!documentHash.trim()) {
      toast.error("Please enter a document hash");
      return;
    }

    setIsVerifying(true);
    resetVerification();
    
    // Simulate step 1: Hash validation
    updateStepStatus("hash-validation", "loading");
    await simulateDelay(800);
    updateStepStatus("hash-validation", "success");
    
    // Simulate step 2: Block search
    updateStepStatus("block-search", "loading");
    await simulateDelay(1200);
    updateStepStatus("block-search", "success");
    
    // Simulate step 3: Timestamp check
    updateStepStatus("timestamp-check", "loading");
    await simulateDelay(1000);
    updateStepStatus("timestamp-check", "success");
    
    // Simulate step 4: Consensus check
    updateStepStatus("consensus-check", "loading");
    await simulateDelay(1500);
    
    try {
      // Actual verification with backend
      const result = await verifyDocumentHash(documentHash);
      setVerificationResult(result);
      
      if (result) {
        updateStepStatus("consensus-check", "success");
        toast.success("Document verified successfully!");
      } else {
        updateStepStatus("consensus-check", "error");
        toast.error("Document verification failed. Hash not found on blockchain.");
      }
    } catch (error) {
      updateStepStatus("consensus-check", "error");
      toast.error("Verification failed. Please try again.");
      console.error(error);
    } finally {
      setIsVerifying(false);
    }
  };

  const updateStepStatus = (stepId: string, status: VerificationStep["status"]) => {
    setVerificationSteps(steps => 
      steps.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    );
  };

  const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const renderStepIcon = (step: VerificationStep) => {
    const Icon = step.icon;
    if (step.status === "loading") {
      return <LoaderCircle className="h-5 w-5 animate-spin text-blue-400" />;
    } else if (step.status === "success") {
      return <CheckCircle className="h-5 w-5 text-green-400" />;
    } else if (step.status === "error") {
      return <XCircle className="h-5 w-5 text-red-400" />;
    }
    return <Icon className="h-5 w-5 text-gray-400" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-purple-950/50 via-background/70 to-background/90 backdrop-blur-md">
        <CardHeader className="relative pb-2">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full p-2 shadow-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="bg-gradient-to-r from-purple-300 to-indigo-200 bg-clip-text text-transparent">
                Blockchain Document Verification
              </CardTitle>
              <CardDescription>
                Verify the authenticity of academic documents
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 bg-background/20">
              <TabsTrigger value="verify">Verify Document</TabsTrigger>
              <TabsTrigger value="how">How It Works</TabsTrigger>
            </TabsList>
            
            <TabsContent value="verify" className="space-y-4">
              <div className="p-4 rounded-md bg-gradient-to-r from-purple-900/20 to-indigo-900/20">
                <p className="text-sm text-gray-300 mb-2">
                  TimeVault uses blockchain technology to verify the authenticity and timestamp of academic documents. 
                  Enter the document hash to verify it against our distributed ledger.
                </p>
                <div className="flex items-center gap-2 text-xs text-indigo-300">
                  <FileDigit className="h-3.5 w-3.5" />
                  <span>Supports SHA-256 and Keccak-256 hashing algorithms</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="docHash" className="block text-sm font-medium">
                  Document Hash
                </label>
                <Input
                  id="docHash"
                  placeholder="Enter document hash..."
                  value={documentHash}
                  onChange={e => setDocumentHash(e.target.value)}
                  className="border-purple-500/20 bg-background/50 focus-visible:ring-purple-500/50"
                />
              </div>
              
              {isVerifying && (
                <div className="space-y-4">
                  <div className="relative pt-1">
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <AnimatePresence>
                      {verificationSteps.map((step) => (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`flex items-center gap-3 p-2 rounded-md ${
                            step.status === "success" ? "bg-green-900/10" : 
                            step.status === "error" ? "bg-red-900/10" : 
                            "bg-indigo-900/10"
                          }`}
                        >
                          {renderStepIcon(step)}
                          <div>
                            <p className="text-sm font-medium">{step.title}</p>
                            <p className="text-xs text-muted-foreground">{step.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
              
              {verificationResult !== null && !isVerifying && (
                <div className={`p-3 rounded-md ${verificationResult ? 'bg-green-900/20' : 'bg-red-900/20'} flex items-center gap-3`}>
                  {verificationResult ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-sm font-medium text-green-300">Verification Successful</p>
                        <p className="text-xs text-green-400/70">This document is authenticated on blockchain</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-400" />
                      <div>
                        <p className="text-sm font-medium text-red-300">Verification Failed</p>
                        <p className="text-xs text-red-400/70">Hash not found on the blockchain</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="how" className="space-y-4">
              <div className="p-4 rounded-md bg-background/20">
                <h3 className="text-md font-medium mb-2 text-purple-300">How Blockchain Verification Works</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Our platform uses distributed ledger technology to create tamper-proof records of academic documents.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-900/30 p-2 rounded-md">
                      <FileDigit className="h-4 w-4 text-indigo-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-indigo-300">Document Hashing</h4>
                      <p className="text-xs text-gray-400">Documents are cryptographically hashed creating a unique fingerprint</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-900/30 p-2 rounded-md">
                      <Database className="h-4 w-4 text-indigo-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-indigo-300">Blockchain Storage</h4>
                      <p className="text-xs text-gray-400">The hash is stored on multiple blockchain networks for redundancy</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-900/30 p-2 rounded-md">
                      <Clock className="h-4 w-4 text-indigo-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-indigo-300">Timestamping</h4>
                      <p className="text-xs text-gray-400">Each record includes an immutable timestamp proving when it was created</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-900/30 p-2 rounded-md">
                      <Link className="h-4 w-4 text-indigo-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-indigo-300">Consensus Verification</h4>
                      <p className="text-xs text-gray-400">Multiple nodes verify each document for maximum security</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          {activeTab === "verify" && (
            <Button 
              onClick={handleVerify} 
              disabled={isVerifying || !documentHash.trim()} 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              {isVerifying ? (
                <div className="flex items-center gap-2">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  <span>Verifying on Blockchain...</span>
                </div>
              ) : (
                <span>Verify Document</span>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
