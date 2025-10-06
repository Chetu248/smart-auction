import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuction } from "../context/auctionContext.jsx";

function CreateAuction() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [reservePrice, setReservePrice] = useState("");
  const [bidIncrement, setBidIncrement] = useState("");
  const [endTime, setEndTime] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [urlInput, setUrlInput] = useState("");

  const { createAuction } = useAuction();
  const navigate = useNavigate();

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  // Handle URL add
  const handleAddUrl = () => {
    if (urlInput.trim() && !imageUrls.includes(urlInput.trim())) {
      setImageUrls([...imageUrls, urlInput.trim()]);
      setUrlInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("startingPrice", startingPrice);
    formData.append("reservePrice", reservePrice);
    formData.append("bidIncrement", bidIncrement);
    formData.append("endTime", endTime);

    // Append image files
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    // Append image URLs as JSON string
    formData.append("imageUrls", JSON.stringify(imageUrls));

    const result = await createAuction(formData);

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
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter auction title"
            className="w-full mt-2 px-4 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="w-full mt-2 px-4 py-2 border rounded-lg"
            rows="4"
            required
          ></textarea>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Electronics, Furniture, etc."
            className="w-full mt-2 px-4 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Image Files */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full mt-2"
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            {imageFiles.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-20 h-20 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Image URLs */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Add Image URL</label>
          <div className="flex gap-2 mt-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter image URL"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Add URL
            </button>
          </div>
          {imageUrls.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {imageUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="url-preview"
                  className="w-20 h-20 object-cover rounded-lg border"
                />
              ))}
            </div>
          )}
        </div>

        {/* Prices */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Starting Price</label>
          <input
            type="number"
            value={startingPrice}
            onChange={(e) => setStartingPrice(e.target.value)}
            placeholder="₹0"
            className="w-full mt-2 px-4 py-2 border rounded-lg"
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
            className="w-full mt-2 px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bid Increment</label>
          <input
            type="number"
            value={bidIncrement}
            onChange={(e) => setBidIncrement(e.target.value)}
            placeholder="₹1"
            className="w-full mt-2 px-4 py-2 border rounded-lg"
            required
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full mt-2 px-4 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
        >
          Create Auction
        </button>
      </form>
    </div>
  );
}

export default CreateAuction;
