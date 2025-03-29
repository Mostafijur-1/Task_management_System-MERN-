import express from "express";
import { protect } from "../middleware/auth.js";
const projectRouter = express.Router();
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addUserToProject,
  removeUserFromProject,
  getProjectTasks,
} from "../controllers/projectController.js";

// Protected Routes
projectRouter.route("/").post(protect, createProject).get(protect, getProjects);

projectRouter
  .route("/:id")
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

projectRouter.route("/:id/users").post(protect, addUserToProject);

projectRouter
  .route("/:id/users/:userId")
  .delete(protect, removeUserFromProject);

projectRouter.route("/:id/tasks").get(protect, getProjectTasks);

export default projectRouter;
