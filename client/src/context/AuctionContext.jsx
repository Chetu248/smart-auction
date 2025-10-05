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

  const fetchAuctions = async () => {
    try {
      const res = await axios.get(`${API_URL}/auctions`);
      setAuctions(res.data.auctions || []);
    } catch (err) {
      console.error("Error fetching auctions:", err.message);
      setAuctions([]);
    }
  };

  const createAuction = async (auctionData) => {
    if (!token) return { success: false, message: "Not logged in" };
    try {
      const res = await axios.post(`${API_URL}/auctions`, auctionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRefreshAuctions((prev) => !prev);
      return { success: true, auction: res.data.auction };
    } catch (err) {
      console.error("Error creating auction:", err.message);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  const fetchAuctionById = async (id) => {
    if (!id) return;
    setLoadingAuction(true);
    try {
      const res = await axios.get(`${API_URL}/auctions/${id}`);
      setSelectedAuction(res.data.item || res.data.auction || res.data);
      setBids(res.data.bids || []);
    } catch (err) {
      console.error("Error fetching auction:", err.message);
      setSelectedAuction(null);
      setBids([]);
    } finally {
      setLoadingAuction(false);
    }
  };

  const fetchMyAuctions = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/auctions/my-auctions`, {
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyPurchases(res.data.auctions || []);
    } catch (err) {
      console.error("Error fetching purchases:", err.message);
      setMyPurchases([]);
    }
  };

  const placeBid = async (auctionId, amount) => {
    if (!auctionId || !token) return;
    try {
      await axios.post(
        `${API_URL}/bids/${auctionId}/bid`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAuctionById(auctionId);
    } catch (err) {
      console.error("Error placing bid:", err.message);
    }
  };

  const loginUser = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/users/login`, { email, password });
      if (res.data.success) {
        setUser(res.data.userData);
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
      }
      return res.data;
    } catch (err) {
      console.error("Login error:", err.message);
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
    }
  };

  const updateProfile = async (fullName, profilePic) => {
    if (!token) return;
    try {
      const res = await axios.put(
        `${API_URL}/users/update-profile`,
        { fullName, profilePic },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data.user);
    } catch (err) {
      console.error("Update profile error:", err.message);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
    window.location.href = "/signup";
  };

  useEffect(() => {
    fetchAuctions();
    if (token) {
      fetchMyAuctions();
      fetchMyPurchases();
    }
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
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuction = () => useContext(AuctionContext);
