import api from "../utils/api";

const taskService = {
  // Get all tasks
  getAllTasks: async () => {
    const response = await api.get("/task");
    return response.data;
  },

  // Get tasks by project
  getTasksByProject: async (projectId) => {
    const response = await api.get(`/task/project/${projectId}`);
    return response.data;
  },

  // Get task by ID
  getTaskById: async (taskId) => {
    const response = await api.get(`/task/${taskId}`);
    return response.data;
  },

  // Create new task
  createTask: async (taskData) => {
    const response = await api.post("/task", taskData);
    return response.data;
  },

  // Update task
  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/task/${taskId}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (taskId) => {
    const response = await api.delete(`/task/${taskId}`);
    return response.data;
  },

  // Update task status
  updateTaskStatus: async (taskId, status) => {
    const response = await api.patch(`/task/${taskId}/status`, { status });
    return response.data;
  },

  // Update task priority
  updateTaskPriority: async (taskId, priority) => {
    const response = await api.patch(`/task/${taskId}/priority`, { priority });
    return response.data;
  },

  // Assign task to user
  assignTask: async (taskId, userId) => {
    const response = await api.patch(`/task/${taskId}/assign`, { userId });
    return response.data;
  },
};

export default taskService;
