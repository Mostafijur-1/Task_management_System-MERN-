// routes/tasks.js
import express from "express";
const taskRouter = express.Router();
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

import { protect, admin } from "../middleware/auth.js";

// Protected Routes
taskRouter
  .route("/")
  .post(protect, admin, createTask)
  .get(protect, admin, getTasks);

taskRouter
  .route("/:id")
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default taskRouter;
