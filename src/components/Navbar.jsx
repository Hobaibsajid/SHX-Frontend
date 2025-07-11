import React, { useState , useRef, useEffect } from "react";
import dp from "../assets/images/dp.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faInfoCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
const Navbar = ({ dashboardType, currentPage }) => {
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUsername = storedUser?.user?.username;
  return (
    <div className="w-full flex flex-wrap justify-between items-center p-4 md:p-6 bg-[#F4F7FE]">
      {/* Left Side: Dashboard Title */}
      <div className="flex-1">
        <p className="text-sm text-gray-400">{dashboardType} / {currentPage}</p> {/* ✅ Dynamically change "Overview" */}
        <h1 className="text-2xl md:text-4xl font-bold text-[#2B3674]">{dashboardType} Dashboard</h1>
        <p className="text-l text-gray-400">Welcome {loggedInUsername}</p> 
      </div>

      {/* Right Side: Search Bar + Notifications + Profile */}
      <div className="flex items-center space-x-7 bg-white rounded-2xl p-1">
        {/* <div className="relative">
          <button className="md:hidden p-2 rounded-full bg-white shadow-sm" onClick={() => setShowSearch(!showSearch)}>
            <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
          </button>
          <div className={`absolute top-12 right-0 w-64 p-2 transition-transform transform ${showSearch ? "scale-100" : "scale-0"} md:static md:scale-100 md:w-64`}>
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search" className="w-full pl-10 pr-4 py-2 bg-gray-100 text-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all" />
          </div>
        </div> */}

        <button className="relative p-2 rounded-full bg-white hover:bg-gray-100 transition">
          <FontAwesomeIcon icon={faBell} className="text-gray-500" />
        </button>

        <button className="p-2 rounded-full bg-white hover:bg-gray-100 transition">
          <FontAwesomeIcon icon={faInfoCircle} className="text-gray-500" />
        </button>

        <div className="relative" ref={dropdownRef} >
      {/* Profile Button */}
      <button
        className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-md overflow-hidden focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        <img src={dp} alt="Profile" className="w-full h-full object-cover" />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-50">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
      </div>
    </div>
  );
};

export default Navbar;
