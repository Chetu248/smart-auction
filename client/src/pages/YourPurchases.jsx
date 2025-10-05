import React, { useEffect } from "react";
import { useAuction } from "../context/AuctionContext";

const YourPurchases = () => {
  const { myPurchases, fetchMyPurchases, user } = useAuction();

  useEffect(() => {
    if (fetchMyPurchases) {
      fetchMyPurchases();
    }
  }, [fetchMyPurchases]);

  return (
    <main className="flex-1 max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Purchases</h1>
      {myPurchases.length === 0 ? (
        <p className="text-gray-600">You haven’t purchased anything yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {myPurchases.map((purchase) => (
            <div
              key={purchase._id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={purchase.images?.[0] || ""}
                alt={purchase.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{purchase.title}</h2>
                <p className="text-gray-600">Bought For: ₹{purchase.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default YourPurchases;
