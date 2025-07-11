import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/images/sportslogo.png";

const Sidebar = ({ menuItems, isOpen, setIsOpen }) => {
  const [activeItem, setActiveItem] = useState("Overview");

  return (
    <>
      {/* Toggle Button - Only Visible on Mobile */}
      <button
        className="fixed top-5 left-5 md:hidden bg-white p-2 rounded-full shadow-md z-50"
        onClick={() => setIsOpen(true)}
      >
        <FontAwesomeIcon icon={faBars} size="lg" />
      </button>

      {/* Mobile Overlay (Only when sidebar is open) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white shadow-lg flex flex-col p-5 transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full"} 
          md:translate-x-0 md:w-64 md:static md:flex-shrink-0`}
      >
        {/* Logo & Close Button */}
        <div className="flex items-center justify-between">
          <img src={logo} alt="SportsHubX" className="pt-7" />

          {/* Close Button (Only for Mobile) */}
          <button
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={() => setIsOpen(false)}
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Sidebar Menu */}
        <ul className="mt-14 space-y-3  ">
          {menuItems.map(({ name, icon, path }, index) => (
            <Link key={index} to={path}>
              <li
                className={`flex items-center  space-x-5 p-4 rounded-md cursor-pointer transition-all duration-300
                  ${activeItem === name ? "bg-[#614CFF0F] text-[#4318FF] font-semibold" : "text-gray-500 hover:bg-gray-100"}`}
                onClick={() => {
                  setActiveItem(name);
                  setIsOpen(false); // Close sidebar on selection (for mobile)
                }}
              >
                <FontAwesomeIcon icon={icon} className={`${activeItem === name ? "text-[#4318FF]" : "text-gray-400"}`} />
                <span className="md:block hidden">{name}</span> {/* Hide on mobile */}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
