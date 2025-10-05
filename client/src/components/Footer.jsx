import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-xl font-semibold text-white">Smart Auction</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Bid smart. Buy smarter. Create and join live auctions with ease.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-medium mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/create-auction" className="hover:text-white">Create Auction</a></li>
            <li><a href="/my-auctions" className="hover:text-white">Your Auctions</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-medium mb-3">Contact</h3>
          <p className="text-gray-400 text-sm">Email: support@smartauction.com</p>
          <p className="text-gray-400 text-sm">Phone: +91 98765 43210</p>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Smart Auction. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
