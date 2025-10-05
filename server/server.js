import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";

import auctionRoutes from "./routes/auctionRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

connectDB();

app.use("/api/auctions", auctionRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
