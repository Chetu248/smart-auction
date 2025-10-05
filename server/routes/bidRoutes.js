import express from "express";
import { placeBid } from "../controllers/bidController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:id/bid", protect, placeBid);

export default router;
