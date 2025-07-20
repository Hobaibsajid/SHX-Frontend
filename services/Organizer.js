// src/services/api.js
import axios from "axios";

// Set your correct backend URL here
const BASE_API_URL = "https://shx-backend.onrender.com/api/organizers";

// POST request to register an organizer
export const registerOrganizer = async (data) => {
  try {
    console.log('data',data);
    
    const response = await axios.post(`${BASE_API_URL}/register-organizer`, data);
    return response.data; // Return the response data (e.g., success message, etc.)
  } catch (error) {
    console.error("Error registering organizer", error);
    throw error; // Handle error accordingly
  }
};
export const loginUser = async (data) => {
  try {
    console.log('datta',data);
    
    const response = await axios.post(`${BASE_API_URL}/login-user`, data);
    return response.data; // Return the response data (e.g., success message, etc.)
  } catch (error) {
    console.error("Error login organizer", error);
    throw error; // Handle error accordingly
  }
};

export const updateCoachStatus = async (data) => {
  try {
    console.log('datta',data);
    
    const response = await axios.post(`${BASE_API_URL}/updateCoachStatus`, data);
    return response.data; // Return the response data (e.g., success message, etc.)
  } catch (error) {
    console.error("Error confirming review ", error);
    throw error; // Handle error accordingly
  }
};
export const addnewEvent = async (data) => {
  try {
    console.log('datta',data);
    
    const response = await axios.post(`${BASE_API_URL}/addNewEvent`, data);
    return response.data; // Return the response data (e.g., success message, etc.)
  } catch (error) {
    console.error("Error confirming review ", error);
    throw error; // Handle error accordingly
  }
};
export const addNewMatch = async (data) => {
  try {
    console.log('datta',data);
    
    const response = await axios.post(`${BASE_API_URL}/addNewMatch`, data);
    return response.data; // Return the response data (e.g., success message, etc.)
  } catch (error) {
    console.error("Error confirming review ", error);
    throw error; // Handle error accordingly
  }
};
export const addMatchScore = async (data) => {
  try {
    console.log('datta',data);
    
    const response = await axios.post(`${BASE_API_URL}/addMatchScore`, data);
    return response.data; // Return the response data (e.g., success message, etc.)
  } catch (error) {
    console.error("Error confirming review ", error);
    throw error; // Handle error accordingly
  }

  
};