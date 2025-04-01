// App.js
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/Auth/AuthContext";

// Pages
import Dashboard from "./pages/Dashboard";
import TasksPage from "./pages/TasksPage";
import ProjectsPage from "./pages/ProjectsPage";

// Auth components
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

// Layout components
import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Protected layout wrapper
const ProtectedLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex md:flex-shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-white md:bg-transparent md:rounded-none rounded-lg shadow-sm md:shadow-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Public layout wrapper
const PublicLayout = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="w-full max-w-md">
      <Outlet />
    </div>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes with minimal layout */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected routes with app layout */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Route>

        {/* Redirect handling */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
