import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import taskService from "../../services/taskService";
import projectService from "../../services/projectService";

const EditTask = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    project: "",
    completed: false,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();
  const { taskId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [taskData, projectsData] = await Promise.all([
          taskService.getTaskById(taskId),
          projectService.getAllProjects(),
        ]);

        setProjects(projectsData);

        // Format the date for the input field (YYYY-MM-DD)
        let formattedDate = "";
        if (taskData.dueDate) {
          const date = new Date(taskData.dueDate);
          formattedDate = date.toISOString().split("T")[0];
        }

        setFormData({
          title: taskData.title || "",
          description: taskData.description || "",
          dueDate: formattedDate,
          priority: taskData.priority || "medium",
          project: taskData.project?._id || "",
          completed: taskData.completed || false,
        });
      } catch (err) {
        setError("Failed to load task details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [taskId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await taskService.updateTask(taskId, formData);
      navigate(`/tasks`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Edit Task</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="project"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Project
            </label>
            <select
              id="project"
              name="project"
              value={formData.project}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">None</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="completed"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="completed"
              className="ml-2 block text-sm text-gray-700"
            >
              Mark as completed
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditTask;
