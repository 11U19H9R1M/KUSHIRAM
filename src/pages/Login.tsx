
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Archive, Eye, EyeOff, LogIn, Mail, Shield, Book, Laptop, BookOpen, GraduationCap, Lock, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import BlockchainVerification from "@/components/BlockchainVerification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define form schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("timevault");
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle email domain detection
  useEffect(() => {
    const currentEmail = form.getValues("email");
    if (currentEmail.endsWith('@library.com')) {
      setActiveTab("library");
    } else if (currentEmail && !currentEmail.endsWith('@library.com')) {
      setActiveTab("timevault");
    }
  }, [form.watch("email")]);

  // Clear login error when form values change
  useEffect(() => {
    if (loginError) {
      const subscription = form.watch(() => {
        setLoginError(null);
      });
      return () => subscription.unsubscribe();
    }
  }, [form, loginError]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      await login(data.email, data.password);
      // Navigation is handled in AuthContext
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError("Login failed. Please check your credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Pre-fill email based on selected tab
    if (value === "timevault") {
      // Clear email if it ends with @library.com
      const currentEmail = form.getValues("email");
      if (currentEmail.endsWith('@library.com')) {
        form.setValue("email", "");
      }
    } else if (value === "library") {
      // Set default library email for easier access
      form.setValue("email", "librarian@library.com");
      form.setValue("password", "password123");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background animate-fade-in">
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left side - Login Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-md space-y-8 hover-lift">
            <div className="flex flex-col items-center text-center mb-8">
              <Link to="/" className="flex items-center gap-2 mb-6 group">
                <Archive className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
                <span className="text-2xl font-bold tracking-tight">TimeVault</span>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight gradient-text">Welcome back</h1>
              <p className="text-muted-foreground mt-2">
                Enter your credentials to access your account
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-6">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="timevault" className="flex items-center gap-2">
                  <Archive className="h-4 w-4" />
                  <span>TimeVault</span>
                </TabsTrigger>
                <TabsTrigger value="library" className="flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  <span>Library</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="timevault" className="mt-2 animate-fade-in">
                <div className="text-sm text-muted-foreground">
                  Sign in to access academic documents, time-locked vaults, and verification tools.
                </div>
              </TabsContent>
              <TabsContent value="library" className="mt-2 animate-fade-in">
                <div className="text-sm text-muted-foreground">
                  Sign in to access the digital library resources, academic publications, and research materials.
                </div>
                <div className="mt-2 text-xs bg-primary/5 p-2 rounded-md border border-primary/10">
                  <span className="font-medium text-primary/80">Quick Access:</span> Default credentials are pre-filled for library access.
                </div>
              </TabsContent>
            </Tabs>
            
            {loginError && (
              <Alert variant="destructive" className="animate-shake">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Authentication Failed</AlertTitle>
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            {...field} 
                            placeholder={activeTab === "library" ? "librarian@library.com" : "you@example.com"} 
                            className="pl-10 glass-input"
                            type="email"
                            onChange={(e) => {
                              field.onChange(e);
                              // Auto-detect tab based on email
                              if (e.target.value.endsWith('@library.com')) {
                                setActiveTab("library");
                              } else if (e.target.value && !e.target.value.endsWith('@library.com')) {
                                setActiveTab("timevault");
                              }
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2"
                            onClick={toggleShowPassword}
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            )}
                          </Button>
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="glass-input pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-white dark:text-primary-foreground hover-lift" 
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white dark:border-primary-foreground"></span>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      <span>Sign in</span>
                    </div>
                  )}
                </Button>

                <div className="text-sm text-center">
                  <span className="text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary hover:underline story-link">
                      Sign up
                    </Link>
                  </span>
                </div>

                {/* Security Information */}
                <div className="bg-muted/50 p-3 rounded-lg text-xs space-y-2 border border-border">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="font-medium">Secure Login</span>
                  </div>
                  <p className="text-muted-foreground">Your connection to this site is encrypted and your credentials are securely stored.</p>
                </div>

                {/* Demo credentials */}
                <div className="glass-card p-4 text-sm space-y-2 dark:bg-card/20 transition-all duration-300">
                  <p className="font-medium">Demo Credentials:</p>
                  <p><span className="opacity-70">Student:</span> student@example.com / password123</p>
                  <p><span className="opacity-70">Faculty:</span> faculty@example.com / password123</p>
                  <p><span className="opacity-70">Admin:</span> admin@example.com / password123</p>
                  <p><span className="opacity-70">Library:</span> librarian@library.com / password123</p>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Right side - Information Panels */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/5 dark:to-secondary/5 p-12 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 backdrop-blur-sm"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-md space-y-6">
              {activeTab === "timevault" ? (
                <div className="glass-card p-6 rounded-xl backdrop-blur-md bg-white/10 dark:bg-black/20 shadow-xl mb-6 animate-fade-in">
                  <h2 className="text-2xl font-bold mb-4 text-center">TimeVault Academia</h2>
                  <p className="text-base opacity-90 mb-6">
                    Securely preserve and schedule the release of important academic documents
                    with TimeVault's time-locked digital vaults and blockchain verification.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/20 dark:bg-white/10 p-3 rounded-lg hover-lift">
                      <div className="font-medium mb-1">For Students</div>
                      <p className="opacity-80">Access time-released course materials and submit assignments</p>
                    </div>
                    <div className="bg-white/20 dark:bg-white/10 p-3 rounded-lg hover-lift">
                      <div className="font-medium mb-1">For Faculty</div>
                      <p className="opacity-80">Upload documents and schedule their release to students</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-card p-6 rounded-xl backdrop-blur-md bg-white/10 dark:bg-black/20 shadow-xl mb-6 animate-fade-in">
                  <h2 className="text-2xl font-bold mb-4 text-center gradient-text">Digital Library</h2>
                  <p className="text-base opacity-90 mb-6">
                    Access a comprehensive collection of academic resources, research publications,
                    and digital materials across multiple disciplines.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/20 dark:bg-white/10 p-3 rounded-lg hover-lift">
                      <div className="font-medium mb-1">Diverse Subjects</div>
                      <p className="opacity-80">Browse resources across various academic disciplines</p>
                    </div>
                    <div className="bg-white/20 dark:bg-white/10 p-3 rounded-lg hover-lift">
                      <div className="font-medium mb-1">Digital Archives</div>
                      <p className="opacity-80">Access journals, articles, and research materials</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "timevault" ? (
                <BlockchainVerification />
              ) : (
                <div className="glass-card p-6 rounded-xl backdrop-blur-md bg-white/10 dark:bg-black/20 shadow-xl animate-fade-in">
                  <h2 className="text-xl font-bold mb-3">Discover Academic Resources</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 hover-lift">
                      <BookOpen className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Academic Publications</h3>
                        <p className="text-sm opacity-80">Access journals, textbooks, and reference materials</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 hover-lift">
                      <GraduationCap className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Specialized Collections</h3>
                        <p className="text-sm opacity-80">Browse resources by subject area and field of study</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 hover-lift">
                      <Shield className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Secure Access</h3>
                        <p className="text-sm opacity-80">Authenticated access to academic and research materials</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
