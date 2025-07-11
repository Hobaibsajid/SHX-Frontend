import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/images/loginbg.png";
import logo from "../assets/images/logo.png";
import shx from "../assets/images/sportslogo.png";
import { loginUser } from "../../services/Organizer.js";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      console.log("Login successful", response);
      localStorage.setItem("user", JSON.stringify(response));
      
      const userType = response.user?.type;

    if (userType === "organizer") {
      navigate("/organizer/dashboard");
    } else if (userType === "coach") {
      // if(response.user){}
      navigate("/coach/dashboard");
    } else if (userType === "player") {
      navigate("/player/dashboard");
    } else {
      setError("Unknown user type");
    }
    } catch (err) {
      console.error("Login error", err);
      setError(err.response.data.error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 md:px-16 relative">
        <div className="w-full flex justify-center md:justify-start mb-6">
          <img src={shx} alt="SportsHubX" className="w-40 md:w-48" />
        </div>

        <h1 className="text-3xl font-bold text-[#1B2559]">Welcome Back!</h1>
        <p className="text-gray-500 mt-2 text-center md:text-left">
          Enter your email and password to sign in!
        </p>

        {/* Form */}
        <form className="w-full max-w-md mt-6" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">Email*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="mail@simmple.com"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#4318FF] outline-none"
            required
          />

          <label className="block mt-4 text-sm font-medium text-gray-700">Password*</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min. 6 characters"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#4318FF] outline-none"
            required
          />

          <div className="flex justify-between items-center mt-3 text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Keep me logged in
            </label>
            <a href="#" className="text-[#4318FF] hover:underline">
              Forgot password?
            </a>
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full mt-4 py-2 bg-[#4318FF] text-white rounded-md hover:bg-[#321BB6] transition"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>


          
        </form>

        <p className="mt-6 text-sm text-gray-500">
          Not registered yet?{" "}
          <span
            className="text-[#4318FF] font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/Signup")}
          >
            Create an Account
          </span>
        </p>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex w-1/2 relative justify-center items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bg})` }}
        ></div>
        <img src={logo} alt="Logo" className="relative w-40 h-40 mb-20 left-20" />
      </div>
    </div>
  );
};

export default Login;
