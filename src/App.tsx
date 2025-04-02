
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Create from "./pages/Create";
import ViewCapsule from "./pages/View";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import GraduationMemories from "./pages/GraduationMemories";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Components
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { debugStorage } from "./lib/storage";

// Configure query client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // Using meta for error handling which is compatible with latest react-query
      meta: {
        onError: (error: Error) => {
          console.error("Query error:", error);
        }
      }
    },
    mutations: {
      retry: 1,
      // Using meta for error handling which is compatible with latest react-query
      meta: {
        onError: (error: Error) => {
          console.error("Mutation error:", error);
        }
      }
    }
  }
});

// ScrollToTop component to ensure each page scrolls to top on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Debug component to help troubleshoot
const DebugComponent = () => {
  useEffect(() => {
    console.log("App loaded. Running storage debug...");
    // Debug localStorage
    debugStorage();
  }, []);

  return null;
};

// Auth Guard component that redirects authenticated users away from login/signup pages
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is already authenticated and tries to access login/signup pages,
  // redirect them to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated, allow access to login/signup pages
  return <>{children}</>;
};

// Component to handle public routes - redirects to login if not authenticated
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, show the content
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <DebugComponent />
            <Routes>
              {/* Authentication Routes - Only for non-authenticated users */}
              <Route path="/login" element={
                <AuthGuard>
                  <Login />
                </AuthGuard>
              } />
              <Route path="/signup" element={
                <AuthGuard>
                  <Signup />
                </AuthGuard>
              } />
              
              {/* Public About Page - Now requires authentication */}
              <Route path="/about" element={
                <PublicRoute>
                  <About />
                </PublicRoute>
              } />
              
              {/* Home Route - Redirect to login if not authenticated */}
              <Route path="/" element={
                <PublicRoute>
                  <Index />
                </PublicRoute>
              } />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/create" element={
                <ProtectedRoute>
                  <Create />
                </ProtectedRoute>
              } />
              <Route path="/capsule/:id" element={
                <ProtectedRoute>
                  <ViewCapsule />
                </ProtectedRoute>
              } />
              <Route path="/graduation-memories" element={
                <ProtectedRoute>
                  <GraduationMemories />
                </ProtectedRoute>
              } />
              {/* 404 Page - Accessible without login */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

import { useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
export default App;
