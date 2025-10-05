import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuction } from "../context/AuctionContext";

function ItemDetails() {
  const { id } = useParams();
  const { selectedAuction, fetchAuctionById, bids, placeBid, loadingAuction } = useAuction();
  const [bid, setBid] = useState("");

  useEffect(() => {
    fetchAuctionById(id);
  }, [id]);

  const handleBid = (e) => {
    e.preventDefault();
    if (bid) {
      placeBid(id, bid);
      setBid("");
    }
  };

  if (loadingAuction && !selectedAuction) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (!selectedAuction) {
    return <p className="text-center py-10">Auction not found</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img
            src={selectedAuction.images?.[0]}
            alt={selectedAuction.title}
            className="w-full h-96 object-cover rounded-lg shadow-md"
          />
          <div className="flex gap-2 mt-3 flex-wrap">
            {selectedAuction.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="thumbnail"
                onClick={() => setBid(img)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800">{selectedAuction.title}</h2>
          <p className="text-gray-600 mt-2">{selectedAuction.description}</p>

          <div className="mt-4 space-y-2">
            <p>
              <span className="font-semibold">Category:</span> {selectedAuction.category}
            </p>
            <p>
              <span className="font-semibold">Starting Price:</span> ₹{selectedAuction.startingPrice}
            </p>
            <p>
              <span className="font-semibold">Reserve Price:</span> ₹{selectedAuction.reservePrice}
            </p>
            <p>
              <span className="font-semibold">Bid Increment:</span> ₹{selectedAuction.bidIncrement}
            </p>
            <p>
              <span className="font-semibold">Ends On:</span>{" "}
              {new Date(selectedAuction.endTime).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Place a Bid</h3>
        <form onSubmit={handleBid} className="flex gap-4">
          <input
            type="number"
            value={bid}
            onChange={(e) => setBid(e.target.value)}
            placeholder="Enter your bid"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Bid
          </button>
        </form>
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Bids</h3>
        <ul className="space-y-2">
          {bids.map((b, idx) => (
            <li key={idx} className="flex justify-between border-b pb-2 text-gray-700">
              <span>{b.user}</span>
              <span className="font-semibold">₹{b.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ItemDetails;
