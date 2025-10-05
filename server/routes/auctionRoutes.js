import express from "express";
import {
  createAuction,
  getAuctions,
  getAuctionById,
  getMyAuctions,
  getMyPurchases,
} from "../controllers/auctionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAuctions);
router.get("/my-auctions", protect, getMyAuctions);
router.get("/my-purchases", protect, getMyPurchases);
router.get("/:id", getAuctionById);
router.post("/", protect, createAuction);

export default router;
