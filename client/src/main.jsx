import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuctionProvider } from "./context/AuctionContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuctionProvider>
        <App />
      </AuctionProvider>
    </BrowserRouter>
  </React.StrictMode>
);
