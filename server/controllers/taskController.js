import Task from "../models/Task.js";
import Project from "../models/Project.js";

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      project,
      dueDate,
      assignedTo,
    } = req.body;

    const task = new Task({
      title,
      description,
      status,
      priority,
      project,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
    });

    const createdTask = await task.save();

    // If project is specified, add task to project
    if (project) {
      await Project.findByIdAndUpdate(project, {
        $push: { tasks: createdTask._id },
      });
    }

    res.status(201).json(createdTask);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating task", error: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const { status, priority, project } = req.query;

    let query = { createdBy: req.user._id };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (project) query.project = project;

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .populate("project", "name");

    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("project", "name");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Ensure user can only access their own tasks
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this task" });
    }

    res.json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching task", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      project,
      dueDate,
      assignedTo,
    } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Ensure user can only update their own tasks
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.project = project || task.project;
    task.dueDate = dueDate || task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating task", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Ensure user can only delete their own tasks
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    // Remove task from project if it belongs to a project
    if (task.project) {
      await Project.findByIdAndUpdate(task.project, {
        $pull: { tasks: task._id },
      });
    }

    await task.remove();

    res.json({ message: "Task removed" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: error.message });
  }
};

export { createTask, getTasks, getTaskById, updateTask, deleteTask };
