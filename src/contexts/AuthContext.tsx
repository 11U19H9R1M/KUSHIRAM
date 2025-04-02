
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Define user roles
export type UserRole = "student" | "faculty" | "admin";

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
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("timeVaultUser");
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("timeVaultUser");
      }
    }
    
    setIsLoading(false);
  }, []);

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
        throw new Error("Invalid email or password");
      }
      
      // Remove password before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store user in localStorage
      localStorage.setItem("timeVaultUser", JSON.stringify(userWithoutPassword));
      
      // Update state
      setUser(userWithoutPassword);
      
      // Show success toast
      toast.success(`Welcome back, ${foundUser.name}!`);
      
      // Redirect based on role
      navigate("/dashboard");
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
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        role,
        name
      };
      
      // Store user in localStorage
      localStorage.setItem("timeVaultUser", JSON.stringify(newUser));
      
      // Update state
      setUser(newUser);
      
      // Show success toast
      toast.success("Account created successfully!");
      
      // Redirect based on role
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create account");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading,
      login, 
      signup, 
      logout,
      updateUser
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
