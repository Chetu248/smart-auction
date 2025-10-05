import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";

// Place Bid
export const placeBid = async (req, res) => {
  try {
    const { amount } = req.body;
    const auction = await Auction.findById(req.params.id);

    if (!auction) return res.status(404).json({ success: false, message: "Auction not found" });
    if (auction.status === "Ended") return res.status(400).json({ success: false, message: "Auction ended" });
    if (amount < auction.currentBid + auction.bidIncrement)
      return res.status(400).json({ success: false, message: "Bid too low" });

    const bid = await Bid.create({
      auction: auction._id,
      user: req.user._id,
      amount,
    });

    auction.currentBid = amount;
    auction.highestBidder = req.user._id;
    await auction.save();

    res.json({ success: true, bid });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
