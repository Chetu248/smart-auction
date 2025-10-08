import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuctionContext = createContext();

export const AuctionProvider = ({ children }) => {
  const [auctions, setAuctions] = useState([]);
  const [myAuctions, setMyAuctions] = useState([]);
  const [myPurchases, setMyPurchases] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [refreshAuctions, setRefreshAuctions] = useState(false);
  const [loadingAuction, setLoadingAuction] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

  const authHeaders = () => (token ? { Authorization: `Bearer ${token}` } : {});

  // ========================
  // Fetch All Auctions
  // ========================
  const fetchAuctions = async () => {
    try {
      const res = await axios.get(`${API_URL}/auctions`);
      const auctionsData = res.data.auctions || [];

      const cleanedAuctions = auctionsData.map((a) => ({
        ...a,
        title: a.title && a.title.trim() ? a.title.trim() : "Untitled Auction",
        description:
          a.description && a.description.trim()
            ? a.description.trim()
            : "No description available",
        startingPrice: a.startingPrice ?? 0,
        currentBid: a.currentBid ?? a.startingPrice ?? 0,
        images:
          a.images && a.images.length > 0
            ? a.images
            : a.imageUrls && a.imageUrls.length > 0
            ? a.imageUrls
            : ["https://via.placeholder.com/300"],
      }));

      setAuctions(cleanedAuctions);
    } catch (err) {
      console.error("Error fetching auctions:", err.message);
      setAuctions([]);
    }
  };

  // ========================
  // Create Auction
  // ========================
  const createAuction = async (auctionData) => {
    if (!token) return { success: false, message: "Not logged in" };
    try {
      const res = await axios.post(`${API_URL}/auctions`, auctionData, {
        headers: {
          ...authHeaders(),
        },
      });
      setRefreshAuctions((prev) => !prev);
      return { success: true, auction: res.data.auction };
    } catch (err) {
      console.error("Error creating auction:", err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  };

  // ========================
  // Fetch Single Auction
  // ========================
  const fetchAuctionById = async (id) => {
    if (!id) return;
    setLoadingAuction(true);
    try {
      const res = await axios.get(`${API_URL}/auctions/${id}`);
      setSelectedAuction(res.data.auction || res.data.item || res.data);
      setBids(res.data.bids || []);
    } catch (err) {
      console.error("Error fetching auction:", err.message);
      setSelectedAuction(null);
      setBids([]);
    } finally {
      setLoadingAuction(false);
    }
  };

  // ========================
  // My Auctions / Purchases
  // ========================
  const fetchMyAuctions = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/auctions/my-auctions`, {
        headers: authHeaders(),
      });
      setMyAuctions(res.data.auctions || []);
    } catch (err) {
      console.error("Error fetching my auctions:", err.message);
      setMyAuctions([]);
    }
  };

  const fetchMyPurchases = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/auctions/my-purchases`, {
        headers: authHeaders(),
      });
      setMyPurchases(res.data.auctions || []);
    } catch (err) {
      console.error("Error fetching purchases:", err.message);
      setMyPurchases([]);
    }
  };

  // ========================
  // Place Bid
  // ========================
  const placeBid = async (auctionId, amount) => {
    if (!auctionId || !token)
      return { success: false, message: "Not authenticated" };
    try {
      const res = await axios.post(
        `${API_URL}/bids/${auctionId}/bid`,
        { amount },
        { headers: authHeaders() }
      );
      await fetchAuctionById(auctionId);
      setRefreshAuctions((p) => !p);
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Error placing bid:", err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  };

  // ========================
  // Auth: Login / Signup / Logout
  // ========================
  const loginUser = async (userData) => {
    try {
      // ✅ userData is passed directly from Login.jsx
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      console.error("Login error:", err.message);
      return { success: false, message: err.message };
    }
  };

  const signupUser = async (fullName, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/users/signup`, {
        fullName,
        email,
        password,
      });
      return res.data;
    } catch (err) {
      console.error("Signup error:", err.message);
      return { success: false, message: err.message };
    }
  };

  const updateProfile = async (formData) => {
    if (!token) return;
    try {
      const res = await axios.put(`${API_URL}/users/update-profile`, formData, {
        headers: authHeaders(),
      });
      if (res.data.success) {
        setUser(res.data.userData);
        localStorage.setItem("user", JSON.stringify(res.data.userData));
      }
      return res.data;
    } catch (err) {
      console.error("Update profile error:", err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");
    window.location.href = "/signup";
  };

  // ========================
  // Check Auth
  // ========================
  const checkAuth = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/users/check-auth`, {
        headers: authHeaders(),
      });
      if (res.data.success) {
        setUser(res.data.userData);
        localStorage.setItem("user", JSON.stringify(res.data.userData));
      } else {
        logoutUser();
      }
    } catch (err) {
      console.error("checkAuth error:", err.response?.data || err.message);
      logoutUser();
    }
  };

  // ========================
  // Restore user instantly from localStorage (Safe parse)
  // ========================
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedToken) setToken(storedToken);

      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("Error parsing stored user:", err);
      localStorage.removeItem("user");
    }
  }, []);

  // ========================
  // Initial Load & Re-verify user
  // ========================
  useEffect(() => {
    fetchAuctions();
    if (token) checkAuth();
  }, [token, refreshAuctions]);

  return (
    <AuctionContext.Provider
      value={{
        auctions,
        myAuctions,
        myPurchases,
        selectedAuction,
        bids,
        user,
        token,
        loadingAuction,
        fetchAllAuctions: fetchAuctions,
        fetchAuctionById,
        placeBid,
        loginUser,
        signupUser,
        updateProfile,
        createAuction,
        logoutUser,
        setUser,
        checkAuth,
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuction = () => useContext(AuctionContext);
