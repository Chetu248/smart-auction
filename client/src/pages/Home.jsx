import React, { useEffect } from "react";
import { useAuction } from "../context/AuctionContext";
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
        <p className="text-gray-600 text-center mt-20">No auctions available.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {auctions.map((auction) => (
            <div
              key={auction._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={auction.images?.[0] || ""}
                alt={auction.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{auction.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{auction.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-bold text-blue-600">₹{auction.currentBid}</span>
                  <Link
                    to={`/item/${auction._id}`}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Bid Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
