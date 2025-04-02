import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/Auth/AuthContext";

// Pages
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TasksPage from "./pages/TasksPage";
import ProjectsPage from "./pages/ProjectsPage";
import UsersPage from "./pages/UsersPage";

// Auth components
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

// Layout components
import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";
import AdminSidebar from "./components/Layout/AdminSidebar";
import ProjectItem from "./components/Projects/ProjectItem";
import CreateTask from "./components/Tasks/CreateTask";
import CreateProject from "./components/Projects/CreateProject";

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Role-based route guard
const RoleRoute = ({ requiredRoles, children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Check if user has any of the required roles
  const hasRequiredRole = requiredRoles.some(
    (role) => user.role && user.role.includes(role)
  );

  if (!hasRequiredRole) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

const DashboardPage = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return user.role && user.role.includes("admin") ? (
    <AdminDashboard />
  ) : (
    <Dashboard />
  );
};

// Protected layout wrapper with role-based sidebar
const ProtectedLayout = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Determine if user is an admin
  const isAdmin = user.role && user.role.includes("admin");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex md:flex-shrink-0">
          {isAdmin ? <AdminSidebar /> : <Sidebar />}
        </div>
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-white md:bg-transparent md:rounded-none rounded-lg shadow-sm md:shadow-none mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Public layout wrapper
const PublicLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes with redirect for authenticated users */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected routes with app layout */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Routes accessible by all authenticated users */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/tasks/create" element={<CreateTask />} />
          <Route path="/projects/create" element={<CreateProject />} />

          {/* Admin only routes */}
          <Route
            path="/admin"
            element={
              <RoleRoute requiredRoles={["admin"]}>
                <AdminDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/users"
            element={
              <RoleRoute requiredRoles={["admin"]}>
                <UsersPage />
              </RoleRoute>
            }
          />
          <Route
            path="/projects/:projectId"
            element={
              <RoleRoute requiredRoles={["admin", "user"]}>
                <ProjectItem />
              </RoleRoute>
            }
          />
        </Route>

        {/* Redirect handling */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
