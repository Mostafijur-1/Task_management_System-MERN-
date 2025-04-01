import React, { useState, useEffect } from "react";
import { FaPlus, FaProjectDiagram, FaSearch } from "react-icons/fa";
import ProjectList from "../components/Projects/ProjectList";
import CreateProject from "../components/Projects/CreateProject";
import projectService from "../services/projectService";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectService.getAllProjects();
        setProjects(response.data);
      } catch (err) {
        setError("Failed to fetch projects");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectCreated = (newProject) => {
    setProjects([...projects, newProject]);
    setShowCreateModal(false);
  };

  const handleProjectDeleted = (projectId) => {
    setProjects(projects.filter((project) => project._id !== projectId));
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-6 py-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FaProjectDiagram className="text-blue-600 text-2xl mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors duration-200"
        >
          <FaPlus className="mr-2" />
          New Project
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center bg-white rounded-lg shadow-sm p-2">
          <FaSearch className="text-gray-400 ml-2" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full px-3 py-2 outline-none text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <ProjectList
          projects={filteredProjects}
          onProjectDeleted={handleProjectDeleted}
        />
      )}

      {showCreateModal && (
        <CreateProject
          onClose={() => setShowCreateModal(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
