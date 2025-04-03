import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import projectService from "../../services/projectService";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectsData = await projectService.getAllProjects();
        setProjects(projectsData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch projects. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
        <Link
          to="/projects/create"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition duration-200"
        >
          Create Project
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No projects found. Click "Create Project" to create one.
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <Link
              to={`/projects/${project._id}`}
              key={project._id}
              className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800">{project.name}</h3>
                  <p className="text-sm text-gray-500">
                    {project.description?.substring(0, 100)}
                    {project.description?.length > 100 ? "..." : ""}
                  </p>
                </div>
                <div className="flex items-center">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      project.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : project.status === "in-progress"
                        ? "bg-blue-100 text-blue-800"
                        : project.status === "planning"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
              {project.deadline && (
                <div className="mt-2 text-xs text-gray-500">
                  Deadline: {new Date(project.deadline).toLocaleDateString()}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
