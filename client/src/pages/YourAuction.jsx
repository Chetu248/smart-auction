import React, { useEffect } from "react";
import { useAuction } from "../context/AuctionContext";

const YourAuction = () => {
  const { myAuctions, fetchMyAuctions, user } = useAuction();

  useEffect(() => {
    if (fetchMyAuctions) {
      fetchMyAuctions();
    }
  }, [fetchMyAuctions]);

  return (
    <main className="flex-1 max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Auctions</h1>
      {myAuctions.length === 0 ? (
        <p className="text-gray-600">You haven’t created any auctions yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {myAuctions.map((auction) => (
            <div
              key={auction._id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={auction.images?.[0] || ""}
                alt={auction.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{auction.title}</h2>
                <p className="text-gray-600">Current Bid: ₹{auction.currentBid}</p>
                <p
                  className={`mt-2 text-sm font-medium ${
                    auction.status === "Active"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {auction.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default YourAuction;
