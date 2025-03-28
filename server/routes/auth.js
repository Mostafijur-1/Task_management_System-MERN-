// routes/auth.js
import express from "express";
const router = express.Router();
import {
  register,
  loginUser,
  getUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

// Public Routes
router.post("/register", register);
router.post("/login", loginUser);

// Protected Routes
router.get("/profile", protect, getUserProfile);

export default router;
