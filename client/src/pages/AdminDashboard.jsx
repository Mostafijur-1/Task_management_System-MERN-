import React, { useState, useEffect } from "react";
import {
  BarChart,
  DollarSign,
  Users,
  ShoppingCart,
  AlertCircle,
  Settings,
  LogOut,
  Menu,
  Search,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/Auth/AuthContext";
import taskService from "../services/taskService";
import projectService from "../services/projectService";
import TaskItem from "../components/Tasks/TaskItem";

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasksData, projectsData] = await Promise.all([
          taskService.getAllTasks(),
          projectService.getAllProjects(),
        ]);
        setTasks(tasksData);
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const totalTasks = tasks.length;

  // Get recent tasks
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Get upcoming tasks (due in the next 7 days)
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const upcomingTasks = tasks
    .filter((task) => {
      const dueDate = new Date(task.dueDate);
      return (
        dueDate >= today && dueDate <= nextWeek && task.status !== "completed"
      );
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Dashboard</h2>
            <div className="flex items-center">
              <div className="relative mr-6">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search
                  className="absolute right-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || "A"}
                </div>
                <span className="ml-2 font-medium">
                  {user?.name || "Admin User"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Welcome back, {user?.name || "Admin"}
          </h1>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed Tasks</p>
                  <p className="text-2xl font-semibold">{completedTasks}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${
                        totalTasks ? (completedTasks / totalTasks) * 100 : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-2xl font-semibold">{inProgressTasks}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${
                        totalTasks ? (inProgressTasks / totalTasks) * 100 : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending Tasks</p>
                  <p className="text-2xl font-semibold">{pendingTasks}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${
                        totalTasks ? (pendingTasks / totalTasks) * 100 : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <BarChart size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Projects</p>
                  <p className="text-2xl font-semibold">{projects.length}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  to="/projects"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View all projects →
                </Link>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Upcoming Tasks
                </h2>
                <Link
                  to="/tasks"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View all →
                </Link>
              </div>
              {upcomingTasks.length > 0 ? (
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      showProject={true}
                      minimal={true}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No upcoming tasks for the next 7 days
                </p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Recent Tasks
                </h2>
                <Link
                  to="/tasks"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View all →
                </Link>
              </div>
              {recentTasks.length > 0 ? (
                <div className="space-y-3">
                  {recentTasks.map((task) => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      showProject={true}
                      minimal={true}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No tasks created yet</p>
              )}
            </div>
          </div>

          {/* Projects Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Active Projects
              </h2>
              <Link
                to="/projects"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.length > 0 ? (
                projects.slice(0, 3).map((project) => (
                  <div
                    key={project._id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <h3 className="font-semibold text-gray-800">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      <Link
                        to={`/projects/${project._id}`}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        View details →
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic col-span-3">
                  No active projects
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
