import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useAuction } from "./context/auctionContext";
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
  const { user, token } = useAuction();
  const isLoggedIn = !!token && !!user;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {!isLoggedIn ? (
            <>
              <Route path="/" element={<Navigate to="/signup" />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
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
