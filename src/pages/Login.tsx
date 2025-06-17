import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Archive, Eye, EyeOff, LogIn, Mail, Shield, Book, Laptop, BookOpen, GraduationCap, Lock, AlertTriangle, Users, UserCheck } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define form schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("lms");
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
      setActiveTab("lms");
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

  // Quick login function for demo accounts
  const quickLogin = async (email: string, password: string) => {
    form.setValue("email", email);
    form.setValue("password", password);
    try {
      await login(email, password);
    } catch (error) {
      console.error("Quick login failed:", error);
    }
  };

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
    if (value === "lms") {
      // Clear any library-specific email
      const currentEmail = form.getValues("email");
      if (currentEmail.endsWith('@library.com')) {
        form.setValue("email", "");
        form.setValue("password", "");
      }
    } else if (value === "library") {
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
                <span className="text-2xl font-bold tracking-tight">EduVault LMS</span>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight gradient-text">Welcome back</h1>
              <p className="text-muted-foreground mt-2">
                Access your Learning Management System
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-6">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="lms" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>LMS Portal</span>
                </TabsTrigger>
                <TabsTrigger value="library" className="flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  <span>Library</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="lms" className="mt-4 animate-fade-in">
                <div className="text-sm text-muted-foreground mb-4">
                  Access assignment management, submissions, and academic collaboration tools.
                </div>
                
                {/* Quick Access Cards */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => quickLogin("student@example.com", "password123")}>
                    <CardContent className="p-3 text-center">
                      <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                      <div className="font-medium text-sm">Student Portal</div>
                      <div className="text-xs text-muted-foreground">Click to login as student</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => quickLogin("faculty@example.com", "password123")}>
                    <CardContent className="p-3 text-center">
                      <UserCheck className="h-6 w-6 mx-auto mb-2 text-green-500" />
                      <div className="font-medium text-sm">Faculty Portal</div>
                      <div className="text-xs text-muted-foreground">Click to login as faculty</div>
                    </CardContent>
                  </Card>
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
                                setActiveTab("lms");
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

                {/* Enhanced Demo credentials section */}
                <div className="glass-card p-4 text-sm space-y-3 dark:bg-card/20 transition-all duration-300">
                  <p className="font-medium text-center mb-3">Demo Accounts Available:</p>
                  
                  <div className="space-y-2">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                      <p className="font-medium text-blue-700 dark:text-blue-300">👨‍🎓 Students:</p>
                      <p className="text-xs">student@example.com / password123</p>
                      <p className="text-xs">alice@student.edu / password123</p>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                      <p className="font-medium text-green-700 dark:text-green-300">👨‍🏫 Faculty:</p>
                      <p className="text-xs">faculty@example.com / password123</p>
                      <p className="text-xs">prof.smith@faculty.edu / password123</p>
                    </div>
                    
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                      <p className="font-medium text-purple-700 dark:text-purple-300">🔧 Admin:</p>
                      <p className="text-xs">admin@example.com / password123</p>
                    </div>
                  </div>
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
              {activeTab === "lms" ? (
                <div className="glass-card p-6 rounded-xl backdrop-blur-md bg-white/10 dark:bg-black/20 shadow-xl mb-6 animate-fade-in">
                  <h2 className="text-2xl font-bold mb-4 text-center">EduVault LMS</h2>
                  <p className="text-base opacity-90 mb-6">
                    Complete Learning Management System for seamless faculty-student interaction,
                    assignment distribution, and submission tracking with AI-powered insights.
                  </p>
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div className="bg-white/20 dark:bg-white/10 p-4 rounded-lg hover-lift">
                      <div className="font-medium mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        For Students
                      </div>
                      <p className="opacity-80">View assignments, submit answers, track deadlines, and collaborate with peers</p>
                    </div>
                    <div className="bg-white/20 dark:bg-white/10 p-4 rounded-lg hover-lift">
                      <div className="font-medium mb-2 flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        For Faculty
                      </div>
                      <p className="opacity-80">Upload assignments, review submissions, provide feedback, and track student progress</p>
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
              
              {activeTab === "lms" ? (
                <div className="glass-card p-6 rounded-xl backdrop-blur-md bg-white/10 dark:bg-black/20 shadow-xl animate-fade-in">
                  <h2 className="text-xl font-bold mb-3">Smart Features</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 hover-lift">
                      <BookOpen className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">AI-Powered Analytics</h3>
                        <p className="text-sm opacity-80">Real-time plagiarism detection and originality scoring</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 hover-lift">
                      <GraduationCap className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Interactive Collaboration</h3>
                        <p className="text-sm opacity-80">Peer Q&A zones and real-time submission tracking</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 hover-lift">
                      <Shield className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Secure Submissions</h3>
                        <p className="text-sm opacity-80">Blockchain-style version tracking and deadline enforcement</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <BlockchainVerification />
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
