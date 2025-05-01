
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
import Library from "./pages/Library";
import LibrarianDashboard from "./pages/LibrarianDashboard";

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
      meta: {
        onError: (error: Error) => {
          console.error("Query error:", error);
        }
      }
    },
    mutations: {
      retry: 1,
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
    debugStorage();
  }, []);

  return null;
};

// Auth Guard component that redirects authenticated users away from login/signup pages
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    // Redirect to the appropriate dashboard based on user role
    return <Navigate to={getDashboardForRole(user.role)} replace />;
  }

  return <>{children}</>;
};

// Helper function to get the correct dashboard for a role
const getDashboardForRole = (role: UserRole) => {
  switch (role) {
    case "librarian":
      return "/librarian";
    case "faculty":
      return "/faculty-dashboard";
    case "student":
      return "/student-dashboard";
    case "admin":
      return "/admin-dashboard";
    default:
      return "/dashboard";
  }
};

// Component to handle public routes - redirects to login if not authenticated
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Faculty-only route component
const FacultyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && (user.role === "faculty" || user.role === "admin")) {
    return <>{children}</>;
  }

  // Redirect to the appropriate dashboard
  return <Navigate to={user ? getDashboardForRole(user.role) : "/login"} replace />;
};

// Student-only route component
const StudentRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && user.role === "student") {
    return <>{children}</>;
  }

  // Redirect to the appropriate dashboard
  return <Navigate to={user ? getDashboardForRole(user.role) : "/login"} replace />;
};

// Special route for librarians
const LibrarianRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && user.role === "librarian") {
    return <>{children}</>;
  }

  return <Navigate to={user ? getDashboardForRole(user.role) : "/login"} replace />;
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
              
              <Route path="/about" element={
                <PublicRoute>
                  <About />
                </PublicRoute>
              } />
              
              <Route path="/" element={
                <Index />
              } />
              
              <Route path="/library" element={
                <ProtectedRoute allowedRoles={["librarian", "admin", "faculty", "student"]}>
                  <Library />
                </ProtectedRoute>
              } />
              
              <Route path="/librarian" element={
                <LibrarianRoute>
                  <LibrarianDashboard />
                </LibrarianRoute>
              } />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/faculty-dashboard" element={
                <FacultyRoute>
                  <Dashboard />
                </FacultyRoute>
              } />
              
              <Route path="/student-dashboard" element={
                <StudentRoute>
                  <Dashboard />
                </StudentRoute>
              } />
              
              <Route path="/create" element={
                <ProtectedRoute allowedRoles={["faculty", "admin"]}>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

import { useEffect } from "react";
import { useAuth, UserRole } from "./contexts/AuthContext";
export default App;
