import axios from "axios";

// Set your correct backend URL here
const BASE_API_URL = "http://localhost:1337/api/players"; // Replace with the correct URL

// POST request to register an organizer
export const registerPlayer = async (data) => {
  try {
    console.log('data',data);
    
    const response = await axios.post(`${BASE_API_URL}/register-player`, data);
    return response.data; // Return the response data (e.g., success message, etc.)
  } catch (error) {
    console.error("Error registering organizer", error);
    throw error; // Handle error accordingly
  }
};
export const sendJoinRequest = async ({ playerId, teamId }) => {
    try {
        console.log('dd',playerId,teamId);
        
      const response = await axios.post(`${BASE_API_URL}/join-team-request`, {
        
          player: playerId,
          team: teamId,
        
      });
  
      return response.data;
    } catch (error) {
      console.error("Error sending join request:", error);
      throw error;
    }
  };