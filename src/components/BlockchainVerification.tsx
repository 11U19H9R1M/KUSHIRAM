
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, CheckCircle, XCircle, FileDigit, LoaderCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function BlockchainVerification() {
  const [documentHash, setDocumentHash] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const { verifyDocumentHash } = useAuth();

  const handleVerify = async () => {
    if (!documentHash.trim()) {
      toast.error("Please enter a document hash");
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // Simulate hash verification
      const result = await verifyDocumentHash(documentHash);
      setVerificationResult(result);
      
      if (result) {
        toast.success("Document verified successfully!");
      } else {
        toast.error("Document verification failed. Hash not found on blockchain.");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
      console.error(error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
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
          <div className="space-y-4">
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
            
            {verificationResult !== null && (
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
          </div>
        </CardContent>
        <CardFooter>
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
        </CardFooter>
      </Card>
    </motion.div>
  );
}
