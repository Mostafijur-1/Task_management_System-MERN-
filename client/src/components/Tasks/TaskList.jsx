import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TaskItem from "./TaskItem";
import taskService from "../../services/taskService";

const TaskList = ({ projectId = null }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, completed, inProgress

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasksData = projectId
          ? await taskService.getTasksByProject(projectId)
          : await taskService.getAllTasks();
        setTasks(tasksData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch tasks. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      setError("Failed to delete task. Please try again.");
      console.error(err);
    }
  };

  const handleCompleteTask = async (taskId, completed) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, { completed });
      setTasks(
        tasks.map((task) =>
          task._id === taskId
            ? { ...task, completed: updatedTask.completed }
            : task
        )
      );
    } catch (err) {
      setError("Failed to update task status. Please try again.");
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "completed") return task.completed;
    if (filter === "inProgress") return !task.completed;
    return true;
  });

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
        <h2 className="text-xl font-semibold text-gray-800">
          {projectId ? "Project Tasks" : "All Tasks"}
        </h2>
        <Link
          to={
            projectId ? `/projects/${projectId}/tasks/create` : "/tasks/create"
          }
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition duration-200"
        >
          Add Task
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded text-sm ${
            filter === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("inProgress")}
          className={`px-3 py-1 rounded text-sm ${
            filter === "inProgress"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1 rounded text-sm ${
            filter === "completed"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Completed
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tasks found. Click "Add Task" to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onDelete={handleDeleteTask}
              onComplete={handleCompleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
