
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Define user roles
export type UserRole = "student" | "faculty" | "admin" | "librarian";

// Define user interface
export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  profileImage?: string;
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
  getDashboardPath: (email: string) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock database of users (in a real app, this would be in a real database)
const MOCK_USERS = [
  {
    id: "1",
    email: "student@example.com",
    password: "password123",
    role: "student" as UserRole,
    name: "John Student"
  },
  {
    id: "2",
    email: "faculty@example.com",
    password: "password123",
    role: "faculty" as UserRole,
    name: "Dr. Jane Faculty"
  },
  {
    id: "3",
    email: "admin@example.com",
    password: "password123",
    role: "admin" as UserRole,
    name: "Admin User"
  },
  {
    id: "4",
    email: "librarian@library.com",
    password: "password123",
    role: "librarian" as UserRole,
    name: "Library Admin"
  }
];

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

  // Determine which dashboard to redirect to based on email domain or user role
  const getDashboardPath = (email: string): string => {
    if (email.endsWith('@library.com')) {
      return '/librarian';
    }
    return '/dashboard';
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

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user in mock database
      const foundUser = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (!foundUser) {
        // Fixed: Properly throw error for invalid credentials
        throw new Error("Invalid email or password");
      }
      
      // Remove password before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store user in localStorage
      localStorage.setItem("timeVaultUser", JSON.stringify(userWithoutPassword));
      
      // Initialize user-specific data
      initializeUserData(foundUser.id);
      
      // Update state
      setUser(userWithoutPassword);
      
      // Determine redirect path based on email domain
      const redirectPath = getDashboardPath(email);
      
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

  // Signup function
  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    
    try {
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
        password,
        role,
        name
      };
      
      // Add to mock database for future logins - FIX: Actually add the user properly
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
      getDashboardPath
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
