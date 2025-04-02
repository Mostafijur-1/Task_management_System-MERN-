import React from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import projectService from "../../services/projectService";

const ProjectItem = () => {
  const { projectId } = useParams();
  const [project, setProject] = React.useState(null);

  React.useEffect(() => {
    const fetchProject = async () => {
      const data = await projectService.getProjectById(projectId);
      setProject(data);
    };
    fetchProject();
  }, [projectId]);

  if (!project) {
    return <div>Loading...</div>;
  }

  const { _id, name, description, status, tasks, deadline } = project;

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await projectService.deleteProject(_id);

      window.location.reload();
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "in progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "not started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const completionPercentage =
    tasks.length > 0
      ? Math.round((completedTasksCount / tasks.length) * 100)
      : 0;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition duration-200">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <Link
            to={`/projects/${_id}`}
            className="text-xl font-semibold text-gray-800 hover:text-blue-600"
          >
            {name}
          </Link>

          {status && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                status
              )}`}
            >
              {status}
            </span>
          )}
        </div>

        {description && (
          <p className="text-gray-600 text-sm mb-4">
            {description.length > 100
              ? `${description.substring(0, 100)}...`
              : description}
          </p>
        )}

        <div className="flex justify-between items-center mb-3">
          <div className="text-sm text-gray-500">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </div>
          {deadline && (
            <div className="text-sm text-gray-500">
              Due: {format(new Date(deadline), "MMM d, yyyy")}
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between">
          <Link
            to={`/projects/${_id}`}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            View Details
          </Link>

          <div className="flex space-x-2">
            <Link
              to={`/projects/${_id}/edit`}
              className="text-gray-400 hover:text-blue-500"
              title="Edit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </Link>
            <button
              onClick={handleDeleteProject}
              className="text-gray-400 hover:text-red-500"
              title="Delete"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectItem;
