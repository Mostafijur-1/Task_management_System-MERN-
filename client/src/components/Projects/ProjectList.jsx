import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProjectItem from "./ProjectItem";
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

  const handleDeleteProject = async (projectId) => {
    try {
      await projectService.deleteProject(projectId);
      setProjects(projects.filter((project) => project._id !== projectId));
    } catch (err) {
      setError("Failed to delete project. Please try again.");
      console.error(err);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectItem
              key={project._id}
              project={project}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
