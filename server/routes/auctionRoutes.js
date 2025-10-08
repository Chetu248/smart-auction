import express from "express";
import {
  createAuction,
  getAuctions,
  getAuctionById,
  getMyAuctions,
  getMyPurchases,
} from "../controllers/auctionController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; // ✅ ADD THIS

const router = express.Router();

router.get("/", getAuctions);
router.get("/my-auctions", protect, getMyAuctions);
router.get("/my-purchases", protect, getMyPurchases);
router.get("/:id", getAuctionById);

// ✅ UPDATED ROUTE — adds multer to parse FormData
router.post("/", protect, upload.array("images"), createAuction);

export default router;
