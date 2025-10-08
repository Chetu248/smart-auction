import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true, default: "Untitled Auction" },
  description: { type: String, default: "" },
  category: { type: String, default: "General" },
  startingPrice: { type: Number, required: true, default: 0 },
  reservePrice: { type: Number },
  bidIncrement: { type: Number, default: 1 },
  images: { type: [String], default: [] },
  imageUrls: { type: [String], default: [] }, // helpful if you store direct URLs from form
  currentBid: { type: Number, default: 0 },
  endTime: { type: Date },
  status: { type: String, enum: ["Active", "Ended"], default: "Active" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

export default mongoose.model("Auction", auctionSchema);
