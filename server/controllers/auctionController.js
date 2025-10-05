import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";

// Create Auction
export const createAuction = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const auction = await Auction.create({
      ...req.body,
      owner: req.user._id,
      currentBid: req.body.startingPrice,
      status: "Active",
    });

    // Send back newly created auction
    res.status(201).json({ success: true, auction });
  } catch (err) {
    console.error("Error creating auction:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get All Active Auctions
export const getAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ status: "Active" }).populate("owner", "fullName profilePic");
    res.json({ success: true, auctions });
  } catch (err) {
    console.error("Error fetching auctions:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Auction by ID
export const getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id).populate("owner", "fullName profilePic");
    const bids = await Bid.find({ auction: req.params.id }).populate("user", "fullName profilePic");

    if (!auction) {
      return res.status(404).json({ success: false, message: "Auction not found" });
    }

    res.json({ success: true, auction, bids });
  } catch (err) {
    console.error("Error fetching auction by ID:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get User’s Auctions
export const getMyAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ owner: req.user._id }).populate("owner", "fullName profilePic");
    res.json({ success: true, auctions });
  } catch (err) {
    console.error("Error fetching user's auctions:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get User’s Purchases
export const getMyPurchases = async (req, res) => {
  try {
    const auctions = await Auction.find({
      highestBidder: req.user._id,
      status: "Ended",
    }).populate("owner", "fullName profilePic");

    res.json({ success: true, auctions });
  } catch (err) {
    console.error("Error fetching user's purchases:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
