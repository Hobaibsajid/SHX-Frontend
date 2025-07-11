import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/images/loginbg.png";
import logo from "../assets/images/logo.png";
import shx from "../assets/images/sportslogo.png";


import { registerOrganizer } from "../../services/Organizer.js";
import { registerPlayer } from "../../services/player.js";
import { registerCoach } from "../../services/coach.js";
const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName:"",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    sport:""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;
      

      if (formData.role === "organizer") {
        const payload = {
          firstName: formData.firstName,
          lastName:formData.lastName,
          role:formData.role,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        };
        response = await registerOrganizer(payload);
      } 
      else if (formData.role === "coach") {
        const payload = {
          firstName: formData.firstName,
          lastName:formData.lastName,
          email: formData.email,
          role:formData.role,
          sport:formData.sport,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        };
        response = await registerCoach(payload);
       } else if (formData.role === "player") {
        const payload = {
          firstName: formData.firstName,
          lastName:formData.lastName,
          email: formData.email,
          role:formData.role,
          sport:formData.sport,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        };
        response = await registerPlayer(payload);
      } 
      else {
        setError("Please select a valid role.");
        return;
      }

      console.log(`${formData.role} registered successfully`, response);
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center h-screen px-8 md:px-16">
        <div className="w-full flex justify-center md:justify-start mb-6">
          <img src={shx} alt="SportsHubX" className="w-40 md:w-48" />
        </div>

        <div className="w-full max-w-md">
          <button
            className="text-sm text-gray-500 hover:text-[#4318FF] flex items-center mb-8"
            onClick={() => navigate("/")}
          >
            ← Back to Login
          </button>

          <h1 className="text-3xl font-bold text-[#1B2559] text-center">Welcome Back!</h1>
          <p className="text-gray-500 mt-2 text-center">Enter your details to sign up!</p>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

          {/* Signup Form */}
          <form className="w-full mt-6" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700">First Name*</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your First Name"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#4318FF] outline-none"
            />

           <label className="block mt-4 text-sm font-medium text-gray-700">Last Name*</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your Last Name"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#4318FF] outline-none"
            />

            <label className="block mt-4 text-sm font-medium text-gray-700">Email*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="mail@simmple.com"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#4318FF] outline-none"
            />

            <label className="block mt-4 text-sm font-medium text-gray-700">Role*</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#4318FF] outline-none"
            >
              <option value="">Select your role</option>
              <option value="organizer">Organizer</option>
              <option value="player">Player</option>
              <option value="coach">Coach</option>
            </select>
            {(formData.role === "coach"  || formData.role === "player") && (
  <>
    <label className="block mt-4 text-sm font-medium text-gray-700">Sport*</label>
    <select
      name="sport"
      value={formData.sport || ""}
      onChange={handleChange}
      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#4318FF] outline-none"
    >
      <option value="">Select a sport</option>
      <option value="Cricket">Cricket</option>
      <option value="Football">Football</option>
      <option value="Basketball">Basketball</option>
    </select>
  </>
)}

            <label className="block mt-4 text-sm font-medium text-gray-700">Password*</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#4318FF] outline-none"
            />

            <label className="block mt-4 text-sm font-medium text-gray-700">Confirm Password*</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#4318FF] outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-2 bg-[#4318FF] text-white rounded-md hover:bg-[#321BB6] transition"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex w-1/2 relative justify-center items-center h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bg})` }}
        ></div>
        <img src={logo} alt="Logo" className="relative w-40 h-40 mb-20 left-20" />
      </div>
    </div>
  );
};

export default Signup;
