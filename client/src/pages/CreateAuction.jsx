import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuction } from "../context/AuctionContext";

function CreateAuction() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [reservePrice, setReservePrice] = useState("");
  const [bidIncrement, setBidIncrement] = useState("");
  const [endTime, setEndTime] = useState("");
  const [images, setImages] = useState([]);

  const { createAuction } = useAuction();
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileURLs = files.map((file) => URL.createObjectURL(file));
    setImages(fileURLs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auctionData = {
      title,
      description,
      category,
      startingPrice,
      reservePrice,
      bidIncrement,
      images,
      endTime,
    };

    const result = await createAuction(auctionData);

    if (result.success) {
      alert("Auction created successfully!");
      navigate("/");
    } else {
      alert(result.message || "Error creating auction");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Create Auction
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-xl shadow-md"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter auction title"
            className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Electronics, Furniture, etc."
            className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full mt-2"
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="preview"
                className="w-20 h-20 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Starting Price</label>
          <input
            type="number"
            value={startingPrice}
            onChange={(e) => setStartingPrice(e.target.value)}
            placeholder="₹0"
            className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Reserve Price</label>
          <input
            type="number"
            value={reservePrice}
            onChange={(e) => setReservePrice(e.target.value)}
            placeholder="₹0"
            className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bid Increment</label>
          <input
            type="number"
            value={bidIncrement}
            onChange={(e) => setBidIncrement(e.target.value)}
            placeholder="₹1"
            className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
        >
          Create Auction
        </button>
      </form>
    </div>
  );
}

export default CreateAuction;
