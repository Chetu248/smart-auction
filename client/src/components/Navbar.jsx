import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuction } from "../context/auctionContext";

const Navbar = () => {
  const { user, token, logoutUser } = useAuction();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Close dropdown automatically on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = async () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white font-bold rounded-full w-9 h-9 flex items-center justify-center">
            SA
          </div>
          <span className="font-semibold text-lg text-gray-800">
            Smart Auction
          </span>
        </Link>

        {/* ✅ Auth Links */}
        {!token || !user ? (
          <div className="space-x-4">
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Signup
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-6 relative">
            <Link
              to="/create-auction"
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              Create Auction
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <img
                src={
                  user?.profilePic ||
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                }
                alt="profile"
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300 object-cover"
                onClick={() => setDropdownOpen((prev) => !prev)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border animate-fadeIn">
                  <Link
                    to="/my-auctions"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Your Auctions
                  </Link>
                  <Link
                    to="/purchases"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Your Purchases
                  </Link>
                  <Link
                    to="/update"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Update Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
