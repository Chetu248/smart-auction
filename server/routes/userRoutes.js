import express from "express";
import { signup, login, checkAuth, updateProfile, logout } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/check-auth", protect, checkAuth);
router.put("/update-profile", protect, updateProfile);
router.post("/logout", protect, logout);   // ✅ added logout route

export default router;
