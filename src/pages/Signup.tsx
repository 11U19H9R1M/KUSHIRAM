
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Archive, Eye, EyeOff, Mail, User, UserPlus } from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelfDestructingDocuments from "@/components/SelfDestructingDocuments";

// Define form schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain at least one letter and one number"
    ),
  role: z.enum(["student", "faculty", "admin"] as const),
});

type FormData = z.infer<typeof formSchema>;

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await signup(data.email, data.password, data.name, data.role);
      // The signup function now redirects to login page
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
        {/* Left side - Image/Brand */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-primary/20 to-secondary/20 p-12 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-md space-y-6">
              <div className="glass-card p-6 rounded-xl backdrop-blur-md bg-white/10 shadow-xl mb-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Join TimeVault Academia</h2>
                <p className="text-base opacity-90 mb-6">
                  Create an account to access academic documents with secure time-locked releases and
                  advanced blockchain verification for tamper-proof credentials.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <div className="font-medium mb-1">For Students</div>
                    <p className="opacity-80">Access course materials as they are released by your instructors</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <div className="font-medium mb-1">For Faculty</div>
                    <p className="opacity-80">Create time-locked document releases for your courses</p>
                  </div>
                </div>
              </div>
              
              <SelfDestructingDocuments />
            </div>
          </div>
        </div>

        {/* Right side - Signup Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            <div className="flex flex-col items-center text-center mb-8">
              <Link to="/" className="flex items-center gap-2 mb-6 group">
                <Archive className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
                <span className="text-2xl font-bold tracking-tight">TimeVault</span>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Create an account</h1>
              <p className="text-muted-foreground mt-2">
                Sign up to start using TimeVault Academia's advanced features
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input {...field} placeholder="Your name" className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="faculty">Faculty</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      <span>Create account</span>
                    </div>
                  )}
                </Button>

                <div className="text-sm text-center">
                  <span className="text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </span>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
