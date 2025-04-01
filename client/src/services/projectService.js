import api from "../utils/api";

const projectService = {
  // Get all projects
  getAllProjects: async () => {
    const response = await api.get("/project");
    return response.data;
  },

  // Get project by ID
  getProjectById: async (projectId) => {
    const response = await api.get(`/project/${projectId}`);
    return response.data;
  },

  // Create new project
  createProject: async (projectData) => {
    const response = await api.post("/project", projectData);
    return response.data;
  },

  // Update project
  updateProject: async (projectId, projectData) => {
    const response = await api.put(`/project/${projectId}`, projectData);
    return response.data;
  },

  // Delete project
  deleteProject: async (projectId) => {
    const response = await api.delete(`/project/${projectId}`);
    return response.data;
  },

  // Get project statistics
  getProjectStats: async (projectId) => {
    const response = await api.get(`/project/${projectId}/stats`);
    return response.data;
  },

  // Add member to project
  addProjectMember: async (projectId, userId, role = "member") => {
    const response = await api.post(`/project/${projectId}/members`, {
      userId,
      role,
    });
    return response.data;
  },

  // Remove member from project
  removeProjectMember: async (projectId, userId) => {
    const response = await api.delete(
      `/project/${projectId}/members/${userId}`
    );
    return response.data;
  },

  // Update member role in project
  updateMemberRole: async (projectId, userId, role) => {
    const response = await api.put(`/project/${projectId}/members/${userId}`, {
      role,
    });
    return response.data;
  },
};

export default projectService;
