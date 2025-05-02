import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner";

import { ThemeProvider } from "./hooks/useTheme";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Create from "./pages/Create";
import View from "./pages/View";
import Library from "./pages/Library";
import TimeVault from "./pages/TimeVault";
import LibrarianDashboard from "./pages/LibrarianDashboard";
import NotFound from "./pages/NotFound";
import GraduationMemories from "./pages/GraduationMemories";

// Import our new pages
import FacultyAssignments from "./pages/FacultyAssignments";
import StudentAssignments from "./pages/StudentAssignments";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* User routes protected with ProtectedRoute */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Faculty-specific routes */}
            <Route
              path="/faculty-assignments"
              element={
                <ProtectedRoute requiredRole="faculty">
                  <FacultyAssignments />
                </ProtectedRoute>
              }
            />
            
            {/* Student-specific routes */}
            <Route
              path="/student-assignments" 
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentAssignments />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/time-vault"
              element={
                <ProtectedRoute>
                  <TimeVault />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <Create />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/view/:id"
              element={
                <ProtectedRoute>
                  <View />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/capsule/:id"
              element={
                <ProtectedRoute>
                  <View />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/library"
              element={
                <ProtectedRoute>
                  <Library />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/graduation-memories"
              element={
                <ProtectedRoute>
                  <GraduationMemories />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/librarian"
              element={
                <ProtectedRoute requiredRole="librarian">
                  <LibrarianDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Generic 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
        <Toaster position="top-right" />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
