import Project from "../models/Project.js";
import Task from "../models/Task.js";

const createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    const project = new Project({
      name,
      description,
      owner: req.user._id,
      members: members || [],
    });

    // Add owner to members array if not already included
    if (!project.members.includes(req.user._id)) {
      project.members.push(req.user._id);
    }

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating project", error: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    // Get projects where user is owner or member
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: { $in: [req.user._id] } }],
    })
      .populate("owner", "name email")
      .populate("members", "name email");

    res.json(projects);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching projects", error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email")
      .populate({
        path: "tasks",
        populate: {
          path: "assignedTo",
          select: "name email",
        },
      });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is owner or member
    if (
      !project.members.some(
        (member) => member._id.toString() === req.user._id.toString()
      )
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this project" });
    }

    res.json(project);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching project", error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { name, description, members, status } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only owner can update project details
    if (project.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this project" });
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.status = status || project.status;

    if (members) {
      project.members = members;
      // Ensure owner is always a member
      if (!project.members.includes(req.user._id)) {
        project.members.push(req.user._id);
      }
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating project", error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this project" });
    }

    // Remove all associated tasks
    await Task.deleteMany({ project: project._id });

    await Project.deleteOne({ _id: project._id });
    res.json({ message: "Project removed" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting project", error: error.message });
  }
};

const addUserToProject = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only owner can add members
    if (project.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this project" });
    }

    // Check if user is already a member
    if (project.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User already a member of this project" });
    }

    project.members.push(userId);
    await project.save();

    res.json(project);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error adding user to project", error: error.message });
  }
};

const removeUserFromProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const userId = req.params.userId;

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only owner can remove members
    if (project.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this project" });
    }

    // Cannot remove the owner
    if (userId === project.owner.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot remove the project owner" });
    }

    project.members = project.members.filter(
      (member) => member.toString() !== userId
    );

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(400).json({
      message: "Error removing user from project",
      error: error.message,
    });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (
      !project.members.some(
        (member) => member.toString() === req.user._id.toString()
      )
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view tasks for this project" });
    }

    const tasks = await Task.find({ project: req.params.id })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
};

export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addUserToProject,
  removeUserFromProject,
  getProjectTasks,
};
