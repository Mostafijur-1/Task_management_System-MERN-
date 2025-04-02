import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import taskService from "../services/taskService";
import projectService from "../services/projectService";
import { useAuth } from "../components/Auth/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    upcomingTasks: 0,
    overdueTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch task statistics
        const taskStats = await taskService.getTaskStats();
        setStats(taskStats);

        // Fetch recent tasks
        const tasks = await taskService.getTasks({
          limit: 5,
          sort: "-createdAt",
        });
        setRecentTasks(tasks);

        // Fetch projects
        const projectsList = await projectService.getProjects({ limit: 5 });
        setProjects(projectsList);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-600">
          Welcome back, {user?.name || "User"}!
        </p>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Tasks</p>
              <p className="text-xl font-semibold text-gray-800">
                {stats.totalTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-xl font-semibold text-gray-800">
                {stats.completedTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Upcoming</p>
              <p className="text-xl font-semibold text-gray-800">
                {stats.upcomingTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-500 mr-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Overdue</p>
              <p className="text-xl font-semibold text-gray-800">
                {stats.overdueTasks}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Recent Tasks</h2>
            <Link
              to="/tasks"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-gray-200">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div key={task._id} className="p-4 hover:bg-gray-50">
                  <Link to={`/tasks/${task._id}`}>
                    <div className="flex justify-between">
                      <div className="flex items-start">
                        <div
                          className={`mt-1 flex-shrink-0 w-3 h-3 rounded-full mr-3 ${
                            task.priority === "high"
                              ? "bg-red-500"
                              : task.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        ></div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-800">
                            {task.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {task.project?.name && `${task.project.name} • `}
                            Due{" "}
                            {task.dueDate
                              ? formatDate(task.dueDate)
                              : "No due date"}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-flex text-xs px-2 py-1 rounded-full ${
                            task.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : task.status === "in-progress"
                              ? "bg-blue-100 text-blue-800"
                              : task.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {task.status === "in-progress"
                            ? "In Progress"
                            : task.status.charAt(0).toUpperCase() +
                              task.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                You have no tasks yet. Create your first task to get started.
              </div>
            )}
          </div>

          {recentTasks.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <Link
                to="/tasks/create"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Create New Task
              </Link>
            </div>
          )}
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">My Projects</h2>
            <Link
              to="/projects"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-gray-200">
            {projects.length > 0 ? (
              projects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="block p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <div className="w-2 h-10 rounded-sm bg-blue-500 mr-3"></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 truncate">
                        {project.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {project.tasks?.length || 0} tasks •{" "}
                        {formatDate(project.updatedAt)}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        {project.progress !== undefined && (
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        )}
                      </div>
                      <p className="text-xs text-right text-gray-500 mt-1">
                        {project.progress !== undefined
                          ? `${project.progress}%`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                You have no projects yet. Create your first project to get
                started.
              </div>
            )}
          </div>

          {projects.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <Link
                to="/projects/create"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Create New Project
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
