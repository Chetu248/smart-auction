import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  startingPrice: Number,
  reservePrice: Number,
  bidIncrement: Number,
  images: [String],
  currentBid: { type: Number, default: 0 },
  endTime: Date,
  status: { type: String, enum: ["Active", "Ended"], default: "Active" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Auction", auctionSchema);
