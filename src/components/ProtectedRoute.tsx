
import { Navigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  // If still loading authentication status, show nothing yet
  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    toast.error("You must be logged in to access this page");
    return <Navigate to="/login" replace />;
  }
  
  // If role check is needed
  if (requiredRole && user) {
    const hasAccess = Array.isArray(requiredRole)
      ? requiredRole.includes(user.role)
      : user.role === requiredRole || user.role === "admin"; // Admins always have access
    
    if (!hasAccess) {
      toast.error("You don't have permission to access this page");
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  // All checks passed, render the child components
  return <>{children}</>;
};

export default ProtectedRoute;
