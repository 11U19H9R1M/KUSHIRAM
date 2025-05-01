
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

// Define user roles
export type UserRole = "student" | "faculty" | "admin" | "librarian";

// Define user interface
export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  profileImage?: string;
  lastLogin?: Date;
  accountCreated?: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  verifyDocumentHash: (hash: string) => Promise<boolean>;
  getDashboardPath: (role: UserRole) => string;
  validatePassword: (password: string) => { isValid: boolean; message?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

// Mock database of users (in a real app, this would be in a real database)
const MOCK_USERS = [
  {
    id: "1",
    email: "student@example.com",
    password: "password123", // In a real app, this would be hashed
    role: "student" as UserRole,
    name: "John Student",
    lastLogin: new Date(),
    accountCreated: new Date("2023-01-15")
  },
  {
    id: "2",
    email: "faculty@example.com",
    password: "password123",
    role: "faculty" as UserRole,
    name: "Dr. Jane Faculty",
    lastLogin: new Date(),
    accountCreated: new Date("2022-08-10")
  },
  {
    id: "3",
    email: "admin@example.com",
    password: "password123",
    role: "admin" as UserRole,
    name: "Admin User",
    lastLogin: new Date(),
    accountCreated: new Date("2022-05-22")
  },
  {
    id: "4",
    email: "librarian@library.com",
    password: "password123",
    role: "librarian" as UserRole,
    name: "Library Admin",
    lastLogin: new Date(),
    accountCreated: new Date("2023-03-05")
  }
];

// Track login attempts for rate limiting
const loginAttempts: Record<string, { count: number; lastAttempt: number }> = {};

// Max failed login attempts before temporary lockout
const MAX_LOGIN_ATTEMPTS = 5;
// Lockout duration in milliseconds (15 minutes)
const LOCKOUT_DURATION = 15 * 60 * 1000;

// Simulated blockchain document hash store
const DOCUMENT_HASHES: Record<string, { timestamp: number, owner: string }> = {};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("timeVaultUser");
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Initialize user-specific data
        initializeUserData(parsedUser.id);
        
        console.log("User session restored:", parsedUser.email);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("timeVaultUser");
      }
    }
    
    setIsLoading(false);
  }, []);

  // Password validation function
  const validatePassword = (password: string) => {
    try {
      passwordSchema.parse(password);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, message: error.errors[0].message };
      }
      return { isValid: false, message: "Invalid password format" };
    }
  };

  // Determine which dashboard to redirect to based on user role
  const getDashboardPath = (role: UserRole): string => {
    switch (role) {
      case "librarian":
        return '/librarian';
      case "faculty":
        return '/faculty-dashboard';
      case "student":
        return '/student-dashboard';
      case "admin":
        return '/admin-dashboard';
      default:
        return '/dashboard';
    }
  };

  // Initialize user data after login/signup
  const initializeUserData = (userId: string) => {
    // Create user-specific prefix for storage
    const userPrefix = `user_${userId}_`;
    
    // Set the user prefix in localStorage for other components to use
    localStorage.setItem("currentUserPrefix", userPrefix);
    
    // Initialize empty capsules array if not exists
    const userCapsules = localStorage.getItem(`${userPrefix}academicDocuments`);
    if (!userCapsules) {
      localStorage.setItem(`${userPrefix}academicDocuments`, JSON.stringify([]));
    }
    
    console.log(`Initialized data storage for user: ${userId}`);
  };

  // Login function with rate limiting
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Check for rate limiting
      const userAttempts = loginAttempts[email] || { count: 0, lastAttempt: 0 };
      const currentTime = Date.now();
      
      // Check if user is locked out
      if (userAttempts.count >= MAX_LOGIN_ATTEMPTS && 
          currentTime - userAttempts.lastAttempt < LOCKOUT_DURATION) {
        const remainingLockout = Math.ceil((LOCKOUT_DURATION - (currentTime - userAttempts.lastAttempt)) / 60000);
        throw new Error(`Too many failed login attempts. Please try again in ${remainingLockout} minutes.`);
      }
      
      // Simulate API call latency
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user in mock database
      const foundUser = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (!foundUser) {
        // Record failed attempt
        loginAttempts[email] = {
          count: userAttempts.count + 1,
          lastAttempt: currentTime
        };
        
        // Show different message based on attempt count
        if (loginAttempts[email].count >= MAX_LOGIN_ATTEMPTS) {
          throw new Error(`Account temporarily locked. Please try again later.`);
        } else {
          throw new Error("Invalid email or password");
        }
      }
      
      // Reset login attempts on successful login
      loginAttempts[email] = { count: 0, lastAttempt: currentTime };
      
      // Update last login time
      foundUser.lastLogin = new Date();
      
      // Remove password before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store user in localStorage
      localStorage.setItem("timeVaultUser", JSON.stringify(userWithoutPassword));
      
      // Initialize user-specific data
      initializeUserData(foundUser.id);
      
      // Update state
      setUser(userWithoutPassword);
      
      // Determine redirect path based on role
      const redirectPath = getDashboardPath(foundUser.role);
      
      // Show success toast
      toast.success(`Welcome back, ${foundUser.name}!`);
      
      // Redirect to appropriate dashboard
      navigate(redirectPath);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to login");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function with enhanced validation
  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    
    try {
      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please enter a valid email address");
      }
      
      // Validate password strength
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.message || "Password does not meet security requirements");
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if email already exists
      if (MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("Email already in use");
      }
      
      // Create new user
      const newUserId = `user_${Date.now()}`;
      
      // Add user to mock database (in a real app, this would be stored in a database)
      const newUserWithPassword = {
        id: newUserId,
        email,
        password, // In a real app, this would be hashed with bcrypt
        role,
        name,
        accountCreated: new Date(),
        lastLogin: new Date()
      };
      
      // Add to mock database for future logins
      MOCK_USERS.push(newUserWithPassword);
      
      // Create user without password for return
      const { password: _, ...newUser } = newUserWithPassword;
      
      // Initialize user-specific data
      initializeUserData(newUserId);
      
      // Show success toast
      toast.success("Account created successfully! Please sign in.");
      
      // Redirect to login page instead of dashboard
      navigate("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create account");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Remove user-specific data prefix
    localStorage.removeItem("currentUserPrefix");
    
    // Remove user from localStorage
    localStorage.removeItem("timeVaultUser");
    
    // Update state
    setUser(null);
    
    // Show toast
    toast.info("You have been logged out");
    
    // Redirect to login page
    navigate("/login");
  };

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      localStorage.setItem("timeVaultUser", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  // Document hash verification (blockchain simulation)
  const verifyDocumentHash = async (hash: string): Promise<boolean> => {
    // Simulate blockchain verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if hash exists in our simulated blockchain
    return hash in DOCUMENT_HASHES;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading,
      login, 
      signup, 
      logout,
      updateUser,
      verifyDocumentHash,
      getDashboardPath,
      validatePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
