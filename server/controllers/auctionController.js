import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";
import cloudinary from "../lib/cloudinary.js";

// ========================
// Create Auction
// ========================
export const createAuction = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const images = [];

    // ================================
    // Handle uploaded image files
    // ================================
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "auctions" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(file.buffer);
        });

        if (uploaded?.secure_url) {
          images.push(uploaded.secure_url);
        }
      }
    }

    // ================================
    // Handle image URLs from formData
    // ================================
    if (req.body.imageUrls) {
      let urls = [];
      try {
        urls = JSON.parse(req.body.imageUrls);
      } catch (e) {
        console.error("Invalid imageUrls JSON:", e.message);
      }
      if (Array.isArray(urls)) {
        images.push(...urls);
      }
    }

    // ================================
    // Create auction
    // ================================
    const auction = await Auction.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      startingPrice: req.body.startingPrice,
      reservePrice: req.body.reservePrice,
      bidIncrement: req.body.bidIncrement,
      endTime: req.body.endTime,
      owner: req.user._id,
      currentBid: req.body.startingPrice,
      status: "Active",
      images,
    });

    res.status(201).json({ success: true, auction });
  } catch (err) {
    console.error("Error creating auction:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// ========================
// Get All Active Auctions
// ========================
export const getAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ status: "Active" }).populate(
      "owner",
      "fullName profilePic"
    );
    res.json({ success: true, auctions });
  } catch (err) {
    console.error("Error fetching auctions:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ========================
// Get Auction by ID
// ========================
export const getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id).populate(
      "owner",
      "fullName profilePic"
    );
    const bids = await Bid.find({ auction: req.params.id }).populate(
      "user",
      "fullName profilePic"
    );

    if (!auction) {
      return res.status(404).json({ success: false, message: "Auction not found" });
    }

    res.json({ success: true, auction, bids });
  } catch (err) {
    console.error("Error fetching auction by ID:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ========================
// Get User’s Auctions
// ========================
export const getMyAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ owner: req.user._id }).populate(
      "owner",
      "fullName profilePic"
    );
    res.json({ success: true, auctions });
  } catch (err) {
    console.error("Error fetching user's auctions:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ========================
// Get User’s Purchases
// ========================
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
