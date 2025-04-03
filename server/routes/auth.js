// routes/auth.js
import express from "express";
const router = express.Router();
import {
  register,
  loginUser,
  getUserProfile,
  getAllUsers,
} from "../controllers/authController.js";
import { admin, protect } from "../middleware/auth.js";

// Public Routes
router.post("/register", register);
router.post("/login", loginUser);

// Protected Routes
router.get("/profile", protect, getUserProfile);
router.get("/all", protect, admin, getAllUsers);

export default router;
