import React, { useState, useEffect } from "react";
import { useAuction } from "../context/auctionContext";

const UpdateProfile = () => {
  const { user, updateProfile } = useAuction();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleFileChange = (e) => {
    setProfilePicFile(e.target.files[0]);
    setProfilePicUrl(""); // Clear URL if a file is selected
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      if (password) formData.append("password", password);

      if (profilePicFile) {
        formData.append("profilePic", profilePicFile);
      } else if (profilePicUrl) {
        formData.append("profilePicUrl", profilePicUrl);
      }

      const res = await updateProfile(formData);

      if (res?.success) {
        setMessage("Profile updated successfully!");
        setPassword("");
        setProfilePicFile(null);
        setProfilePicUrl("");
      } else {
        setMessage(res?.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setMessage("An error occurred while updating your profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Update Profile</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-4"
      >
        <div>
          <label className="block font-medium">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Leave blank to keep current password"
          />
        </div>

        <div>
          <label className="block font-medium">Profile Picture (Upload or URL)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <p className="text-sm text-gray-500 my-2">OR enter an image URL:</p>
          <input
            type="url"
            value={profilePicUrl}
            onChange={(e) => setProfilePicUrl(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="https://example.com/image.jpg"
          />
          {profilePicFile && (
            <p className="mt-2 text-sm text-gray-500">
              Selected file: {profilePicFile.name}
            </p>
          )}
          {profilePicUrl && (
            <p className="mt-2 text-sm text-gray-500">
              Entered URL: {profilePicUrl}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-70"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

        {message && (
          <p
            className={`mt-2 text-sm ${
              message.includes("successfully") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </main>
  );
};

export default UpdateProfile;
