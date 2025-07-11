import axios from "axios";

// Set your correct backend URL here
const BASE_API_URL = "http://localhost:1337/api/coaches"; // Replace with the correct URL

// POST request to register an organizer
export const registerCoach = async (data) => {
  try {
    console.log('data',data);
    
    const response = await axios.post(`${BASE_API_URL}/register-coach`, data);
    return response.data; // Return the response data (e.g., success message, etc.)
  } catch (error) {
    console.error("Error registering organizer", error);
    throw error; // Handle error accordingly
  }
};
export const acceptPlayerRequest = async (data) => {
  try {
    console.log('dataa',data);
    
    const response = await axios.post(`${BASE_API_URL}/accept-request`, data);
    return response.data; // Return the response data (e.g., success message, etc.)
  } catch (error) {
    console.error("Error accepting player", error);
    throw error; // Handle error accordingly
  }
};

export const rejectPlayerRequest = async (data) => {
  try {
    console.log('dataa',data);
    
    const response = await axios.post(`${BASE_API_URL}/reject-request`, data);
    return response.data; // Return the response data (e.g., success message, etc.)
  } catch (error) {
    console.error("Error accepting player", error);
    throw error; // Handle error accordingly
  }
};
export const createTeam = async (data) => {
  try {
    console.log('dataa n',data);
    
    const response = await axios.post(`${BASE_API_URL}/create-new-team`, data);
    return response.data; // Return the response data (e.g., success message, etc.)
  } catch (error) {
    console.error("Error accepting player", error);
    throw error; // Handle error accordingly
  }
};
export const removePlayer = async (data) => {
  try {
    console.log('dataa n',data);
    
    const response = await axios.post(`${BASE_API_URL}/remove-player`, data);
    return response.data; // Return the response data (e.g., success message, etc.)
  } catch (error) {
    console.error("Error removing player", error);
    throw error; // Handle error accordingly
  }
};


export const assignRole = async (data) => {
  try {
    console.log('dataa n',data);
    
    const response = await axios.post(`${BASE_API_URL}/assign-role`, data);
    return response.data; // Return the response data (e.g., success message, etc.)
  } catch (error) {
    console.error("Error assigning role to  player", error);
    throw error; // Handle error accordingly
  }
};