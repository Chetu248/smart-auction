import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import YourAuction from "./pages/YourAuction";
import YourPurchases from "./pages/YourPurchases";
import CreateAuction from "./pages/CreateAuction";
import UpdateProfile from "./pages/UpdateProfile";
import ItemDetails from "./pages/ItemDetails";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await axios.get("http://localhost:8080/api/users/check-auth", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          });

          if (res.data.success) {
            setUser(res.data.userData);
            setIsLoggedIn(true);
          } else {
            setToken("");
            setIsLoggedIn(false);
            setUser(null);
            localStorage.removeItem("token");
          }
        } catch (err) {
          console.error("Auth check failed", err);
          setToken("");
          setIsLoggedIn(false);
          setUser(null);
          localStorage.removeItem("token");
        }
      }
    };

    checkAuth();
  }, [token]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        isLoggedIn={isLoggedIn}
        user={user}
        setToken={setToken}
        setIsLoggedIn={setIsLoggedIn}
        setUser={setUser}
      />

      <main className="flex-1">
        <Routes>
          {!isLoggedIn ? (
            <>
              <Route path="/" element={<Navigate to="/signup" />} />
              <Route path="/signup" element={<Signup setToken={setToken} />} />
              <Route path="/login" element={<Login setToken={setToken} />} />
              <Route path="*" element={<Navigate to="/signup" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/create-auction" element={<CreateAuction />} />
              <Route path="/my-auctions" element={<YourAuction />} />
              <Route path="/purchases" element={<YourPurchases />} />
              <Route path="/update" element={<UpdateProfile />} />
              <Route path="/item/:id" element={<ItemDetails />} />
              <Route path="/signup" element={<Navigate to="/" />} />
              <Route path="/login" element={<Navigate to="/" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
