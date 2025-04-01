import React, { useState } from "react";
import { FaPlus, FaFilter, FaTasks } from "react-icons/fa";
import TaskList from "../components/Tasks/TaskList";
import CreateTask from "../components/Tasks/CreateTask";

const TasksPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All Tasks" },
    { id: "pending", label: "Pending" },
    { id: "in-progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
    { id: "overdue", label: "Overdue" },
  ];

  return (
    <div className="px-6 py-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FaTasks className="text-blue-600 text-2xl mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors duration-200"
        >
          <FaPlus className="mr-2" />
          New Task
        </button>
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-2">
          <span className="font-medium text-gray-700 flex items-center mr-2">
            <FaFilter className="mr-2" /> Filter:
          </span>
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                activeFilter === filter.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition-colors duration-200`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <TaskList filterStatus={activeFilter} />

      {showCreateModal && (
        <CreateTask
          onClose={() => setShowCreateModal(false)}
          onTaskCreated={() => {
            setShowCreateModal(false);
            // You might want to refresh the task list here
          }}
        />
      )}
    </div>
  );
};

export default TasksPage;
