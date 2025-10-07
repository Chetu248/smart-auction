import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuction } from "../context/AuctionContext";

function ItemDetails() {
  const { id } = useParams();
  const {
    selectedAuction,
    fetchAuctionById,
    bids,
    placeBid,
    loadingAuction,
    user,
  } = useAuction();
  const [bid, setBid] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [placing, setPlacing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchAuctionById(id);
  }, [id]);

  useEffect(() => {
    if (selectedAuction?.images?.length > 0) {
      setMainImage(selectedAuction.images[0]);
    }
  }, [selectedAuction]);

  const handleBid = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!user) {
      setErrorMsg("Please login to place a bid");
      return;
    }

    // numeric and min bid checks
    const numericBid = Number(bid);
    if (isNaN(numericBid) || numericBid <= 0) {
      setErrorMsg("Enter a valid bid amount");
      return;
    }

    const current = Number(selectedAuction.currentBid || selectedAuction.startingPrice || 0);
    const increment = Number(selectedAuction.bidIncrement || 1);
    const minRequired = current + increment;

    if (numericBid < minRequired) {
      setErrorMsg(`Bid must be at least ₹${minRequired}`);
      return;
    }

    // prevent owner from bidding (frontend check)
    if (selectedAuction.owner && user && selectedAuction.owner._id === user._id) {
      setErrorMsg("You cannot bid on your own auction");
      return;
    }

    // prevent bidding on ended auction
    if (selectedAuction.status === "Ended" || (selectedAuction.endTime && new Date() >= new Date(selectedAuction.endTime))) {
      setErrorMsg("Auction has already ended");
      return;
    }

    try {
      setPlacing(true);
      const result = await placeBid(id, numericBid);
      if (!result.success) {
        setErrorMsg(result.message || "Error placing bid");
      } else {
        setBid("");
      }
    } catch (err) {
      console.error("handleBid error:", err);
      setErrorMsg("Error placing bid");
    } finally {
      setPlacing(false);
    }
  };

  if (loadingAuction && !selectedAuction) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (!selectedAuction) {
    return <p className="text-center py-10">Auction not found</p>;
  }

  // UI conditions
  const isOwner = user && selectedAuction.owner && selectedAuction.owner._id === user._id;
  const hasEnded = selectedAuction.status === "Ended" || (selectedAuction.endTime && new Date() >= new Date(selectedAuction.endTime));
  const current = Number(selectedAuction.currentBid || selectedAuction.startingPrice || 0);
  const increment = Number(selectedAuction.bidIncrement || 1);
  const minRequired = current + increment;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* ---------- ITEM IMAGES ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img
            src={mainImage}
            alt={selectedAuction.title}
            className="w-full h-96 object-cover rounded-lg shadow-md"
          />
          <div className="flex gap-2 mt-3 flex-wrap">
            {selectedAuction.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="thumbnail"
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                  mainImage === img ? "border-blue-500" : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ---------- ITEM DETAILS ---------- */}
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

            {selectedAuction.owner && (
              <div className="flex items-center gap-2 mt-4">
                {selectedAuction.owner.profilePic && (
                  <img
                    src={selectedAuction.owner.profilePic}
                    alt={selectedAuction.owner.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <p>
                  <span className="font-semibold">Seller:</span>{" "}
                  {selectedAuction.owner.fullName}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------- PLACE BID ---------- */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Place a Bid</h3>

        {hasEnded ? (
          <div className="text-red-600 font-semibold">Auction has ended</div>
        ) : isOwner ? (
          <div className="text-gray-600">You are the owner of this auction and cannot bid.</div>
        ) : (
          <form onSubmit={handleBid} className="flex gap-4">
            <input
              type="number"
              value={bid}
              onChange={(e) => setBid(e.target.value)}
              placeholder={`Enter your bid (min ₹${minRequired})`}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min={minRequired}
            />
            <button
              type="submit"
              disabled={placing}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {placing ? "Placing..." : `Bid`}
            </button>
          </form>
        )}

        {errorMsg && <p className="text-sm text-red-500 mt-2">{errorMsg}</p>}
      </div>

      {/* ---------- BIDS LIST ---------- */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Bids</h3>
        <ul className="space-y-2">
          {bids.length > 0 ? (
            bids.map((b, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b pb-2 text-gray-700"
              >
                <div className="flex items-center gap-2">
                  {b.user?.profilePic && (
                    <img
                      src={b.user.profilePic}
                      alt={b.user.fullName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span>{b.user?.fullName || "Unknown User"}</span>
                </div>
                <span className="font-semibold">₹{b.amount}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No bids yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default ItemDetails;
