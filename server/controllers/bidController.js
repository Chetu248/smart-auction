import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";

// Place Bid
export const placeBid = async (req, res) => {
  try {
    const { amount } = req.body;
    const auction = await Auction.findById(req.params.id);

    if (!auction)
      return res.status(404).json({ success: false, message: "Auction not found" });

    // ✅ FIX: if auction endTime passed, mark as Ended and prevent bidding
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

    // ✅ FIX: prevent owner from bidding on own auction
    if (auction.owner && auction.owner.toString() === req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "You cannot bid on your own auction" });
    }

    // Ensure numeric values
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      return res.status(400).json({ success: false, message: "Invalid bid amount" });
    }

    // If currentBid is 0 or missing, treat startingPrice as baseline (auction model sets currentBid on create)
    const minRequired = (auction.currentBid || 0) + (auction.bidIncrement || 1);

    if (numericAmount < minRequired)
      return res.status(400).json({ success: false, message: "Bid too low" });

    const bid = await Bid.create({
      auction: auction._id,
      user: req.user._id,
      amount: numericAmount,
    });

    // update auction's highest bid
    auction.currentBid = numericAmount;
    auction.highestBidder = req.user._id;
    await auction.save();

    res.json({ success: true, bid, auction });
  } catch (err) {
    console.error("Error placing bid:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};
