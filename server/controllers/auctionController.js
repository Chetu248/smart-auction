import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";
import cloudinary from "../lib/cloudinary.js";

// Helper to close auction if endTime passed
async function checkAndCloseAuction(auction) {
  if (!auction) return auction;
  if (auction.status === "Active" && auction.endTime && new Date() >= new Date(auction.endTime)) {
    auction.status = "Ended";
    if (auction.highestBidder) {
      auction.winner = auction.highestBidder;
    }
    await auction.save();
  }
  return auction;
}

// Helper to parse numbers safely
function bodyValueAsNumber(value, defaultValue) {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

// ========================
// Create Auction
// ========================
export const createAuction = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const body = req.body || {};
    const images = [];

    // Handle uploaded image files
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
        if (uploaded?.secure_url) images.push(uploaded.secure_url);
      }
    }

    // Handle image URLs from formData
    let urls = [];
    if (body.imageUrls) {
      try {
        if (typeof body.imageUrls === "string") urls = JSON.parse(body.imageUrls);
        else if (Array.isArray(body.imageUrls)) urls = body.imageUrls;
      } catch (e) {
        console.error("Invalid imageUrls JSON:", e.message);
        urls = [];
      }
    }
    if (Array.isArray(urls) && urls.length > 0) images.push(...urls);

    const startingPrice = bodyValueAsNumber(body.startingPrice, 0);
    const reservePrice = bodyValueAsNumber(body.reservePrice, undefined);
    const bidIncrement = bodyValueAsNumber(body.bidIncrement, 1);
    const endTime = body.endTime ? new Date(body.endTime) : null;

    const auction = await Auction.create({
      title: (body.title && body.title.trim()) || "Untitled Auction",
      description: (body.description && body.description.trim()) || "No description available",
      category: body.category || "General",
      startingPrice,
      reservePrice,
      bidIncrement,
      endTime,
      owner: req.user._id,
      currentBid: startingPrice,
      status: "Active",
      images: images.length ? images : ["https://via.placeholder.com/300"],
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

    await Promise.all(auctions.map(async (a) => await checkAndCloseAuction(a)));

    const cleanAuctions = auctions.map(a => ({
      ...a.toObject(),
      title: a.title && a.title.trim() ? a.title.trim() : "Untitled Auction",
      description: a.description && a.description.trim() ? a.description.trim() : "No description available",
      startingPrice: a.startingPrice ?? 0,
      currentBid: a.currentBid ?? a.startingPrice ?? 0,
      images: a.images && a.images.length > 0
        ? a.images
        : a.imageUrls && a.imageUrls.length > 0
        ? a.imageUrls
        : ["https://via.placeholder.com/300"],
    }));

    res.json({ success: true, auctions: cleanAuctions });
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
    let auction = await Auction.findById(req.params.id).populate(
      "owner",
      "fullName profilePic"
    );

    if (!auction) {
      return res.status(404).json({ success: false, message: "Auction not found" });
    }

    auction = await checkAndCloseAuction(auction);

    const bids = await Bid.find({ auction: req.params.id }).populate(
      "user",
      "fullName profilePic"
    );

    res.json({
      success: true,
      auction: {
        ...auction.toObject(),
        title: auction.title && auction.title.trim() ? auction.title.trim() : "Untitled Auction",
        description: auction.description && auction.description.trim() ? auction.description.trim() : "No description available",
        startingPrice: auction.startingPrice ?? 0,
        currentBid: auction.currentBid ?? auction.startingPrice ?? 0,
        images: auction.images && auction.images.length > 0
          ? auction.images
          : auction.imageUrls && auction.imageUrls.length > 0
          ? auction.imageUrls
          : ["https://via.placeholder.com/300"],
      },
      bids,
    });
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

    await Promise.all(auctions.map(async (a) => await checkAndCloseAuction(a)));

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

// ========================
// Place Bid
// ========================
export const placeBid = async (req, res) => {
  try {
    const { amount } = req.body;
    const auction = await Auction.findById(req.params.id);

    if (!auction)
      return res.status(404).json({ success: false, message: "Auction not found" });

    if (auction.endTime && new Date() >= new Date(auction.endTime)) {
      if (auction.status === "Active") {
        auction.status = "Ended";
        if (auction.highestBidder) auction.winner = auction.highestBidder;
        await auction.save();
      }
      return res.status(400).json({ success: false, message: "Auction has ended" });
    }

    if (auction.status === "Ended")
      return res.status(400).json({ success: false, message: "Auction ended" });

    if (auction.owner && auction.owner.toString() === req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "You cannot bid on your own auction" });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      return res.status(400).json({ success: false, message: "Invalid bid amount" });
    }

    const minRequired = (auction.currentBid || auction.startingPrice || 0) + (auction.bidIncrement || 1);

    if (numericAmount < minRequired)
      return res.status(400).json({ success: false, message: "Bid too low" });

    const bid = await Bid.create({
      auction: auction._id,
      user: req.user._id,
      amount: numericAmount,
    });

    auction.currentBid = numericAmount;
    auction.highestBidder = req.user._id;
    await auction.save();

    res.json({ success: true, bid, auction });
  } catch (err) {
    console.error("Error placing bid:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};
