import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const TaskItem = ({ task, onDelete, onComplete }) => {
  const { _id, title, description, dueDate, priority, completed, project } =
    task;

  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDueDateClass = (date) => {
    if (!date) return "";

    const today = new Date();
    const dueDateTime = new Date(date);

    if (dueDateTime < today && !completed) {
      return "text-red-600 font-medium";
    }
    return "text-gray-600";
  };

  return (
    <div
      className={`border rounded-lg p-4 transition duration-200 ${
        completed
          ? "bg-gray-50 border-gray-200"
          : "bg-white border-gray-200 hover:border-blue-300"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div>
            <input
              type="checkbox"
              checked={completed}
              onChange={() => onComplete(_id, !completed)}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>
          <div>
            <h3
              className={`font-medium ${
                completed ? "text-gray-500 line-through" : "text-gray-900"
              }`}
            >
              {title}
            </h3>
            {description && (
              <p
                className={`text-sm mt-1 ${
                  completed ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {description.length > 100
                  ? `${description.substring(0, 100)}...`
                  : description}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              {priority && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityClass(
                    priority
                  )}`}
                >
                  {priority}
                </span>
              )}
              {dueDate && (
                <span className={`text-xs ${getDueDateClass(dueDate)}`}>
                  Due: {format(new Date(dueDate), "MMM d, yyyy")}
                </span>
              )}
              {project && project.name && (
                <Link
                  to={`/projects/${project._id}`}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  {project.name}
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Link
            to={`/tasks/${_id}/edit`}
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
            onClick={() => onDelete(_id)}
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
  );
};

export default TaskItem;
