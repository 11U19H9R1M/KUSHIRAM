
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Archive, Eye, EyeOff, LogIn, Mail, Shield } from "lucide-react";
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

// Define form schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get redirect location or default to dashboard
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled in the auth context
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left side - Login Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            <div className="flex flex-col items-center text-center mb-8">
              <Link to="/" className="flex items-center gap-2 mb-6 group">
                <Archive className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
                <span className="text-2xl font-bold tracking-tight">TimeVault</span>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back</h1>
              <p className="text-muted-foreground mt-2">
                Enter your credentials to access your account
              </p>
            </div>

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
                            placeholder="you@example.com" 
                            className="pl-10" 
                            type="email"
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
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-white" 
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
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
                    <Link to="/signup" className="text-primary hover:underline">
                      Sign up
                    </Link>
                  </span>
                </div>

                {/* Demo credentials */}
                <div className="bg-secondary/30 rounded-lg p-4 text-sm space-y-2">
                  <p className="font-medium">Demo Credentials:</p>
                  <p><span className="opacity-70">Student:</span> student@example.com / password123</p>
                  <p><span className="opacity-70">Faculty:</span> faculty@example.com / password123</p>
                  <p><span className="opacity-70">Admin:</span> admin@example.com / password123</p>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Right side - Blockchain verification */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-primary/20 to-secondary/20 p-12 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-md space-y-6">
              <div className="glass-card p-6 rounded-xl backdrop-blur-md bg-white/10 shadow-xl mb-6">
                <h2 className="text-2xl font-bold mb-4 text-center">TimeVault Academia</h2>
                <p className="text-base opacity-90 mb-6">
                  Securely preserve and schedule the release of important academic documents
                  with TimeVault's time-locked digital vaults and blockchain verification.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <div className="font-medium mb-1">For Students</div>
                    <p className="opacity-80">Access time-released course materials and submit assignments</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <div className="font-medium mb-1">For Faculty</div>
                    <p className="opacity-80">Upload documents and schedule their release to students</p>
                  </div>
                </div>
              </div>
              
              <BlockchainVerification />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
