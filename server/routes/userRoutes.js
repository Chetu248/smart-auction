import express from "express";
import multer from "multer";
import {
  signup,
  login,
  checkAuth,
  updateProfile,
  logout,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Public Routes
router.post("/signup", signup);
router.post("/login", login);

// Protected Routes
router.get("/check-auth", protect, checkAuth);

// Multer middleware handles "profilePic" field from formData
router.put("/update-profile", protect, upload.single("profilePic"), updateProfile);

router.post("/logout", protect, logout);

export default router;
