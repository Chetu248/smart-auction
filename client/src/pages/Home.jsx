import React, { useEffect } from "react";
import { useAuction } from "../context/auctionContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { auctions, fetchAllAuctions } = useAuction();

  useEffect(() => {
    fetchAllAuctions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Live Auctions</h1>

      {auctions.length === 0 ? (
        <p className="text-gray-600 text-center mt-20">
          No auctions available.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {auctions.map((auction) => {
            console.log("Auction object:", auction); // ✅ Debug

            const imageUrl =
              auction?.images?.length > 0
                ? auction.images[0]
                : auction?.imageUrls?.length > 0
                ? auction.imageUrls[0]
                : "https://via.placeholder.com/300";

            const title = auction?.title?.trim() || "Untitled Auction";
            const description =
              auction?.description?.trim() || "No description available";

            const price =
              auction?.currentBid != null
                ? auction.currentBid
                : auction?.startingPrice ?? 0;

            return (
              <div
                key={auction?._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{title}</h2>
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-bold text-blue-600">₹{price}</span>
                    <Link
                      to={`/item/${auction?._id}`}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Bid Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
