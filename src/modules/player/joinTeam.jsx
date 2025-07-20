import React, { useEffect, useState } from "react";
import PlayerStats from "../../components/Common/PlayerStats";
import { sendJoinRequest } from "../../../services/player.js";
const JoinTeam = () => {
  const [filteredTeams, setFilteredTeams] = useState([]);
 const [isPlayerInTeam, setIsPlayerInTeam] = useState(false);
  // ✅ Get player's sport from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const playerId = storedUser?.user?.playerId?.id;
 const playerSport=storedUser?.user?.playerId?.sport;
  useEffect(() => {
    const fetchTeams = async () => {
      try {
          // ✅ Step 1: Check if player is already in a team
        const playerRes = await fetch(
          `https://shx-backend.onrender.com/api/players?filters[id][$eq]=${playerId}&populate=teams`
        );
        const playerData = await playerRes.json();
        const playerTeams = playerData?.data[0].teams || [];
console.log('ppk',playerTeams);

        if (playerTeams.length > 0) {
          setIsPlayerInTeam(true); // ⛔ Stop further logic
          return;
        }
        // ✅ Replace with your actual API endpoint or service
        const response = await fetch("https://shx-backend.onrender.com/api/teams?populate=*");
        const result = await response.json();
        
        console.log('reee',result.data);
        
        // ✅ Extract the team data from API response (adjust as per your backend structure)
        const allTeams = result?.data?.map((team) => ({
          id: team.id,
          name: team.teamName,
          sport: team.sport,
          players: team.players || [],
          coach: team.coachid?.fullName ,
          playerRequests:team.playerRequests || [],
          rejectedPlayerRequests:team.rejectedPlayerRequests || [],
        }));

        // ✅ Filter teams by player's sport
        const filtered = allTeams?.filter((team) => {
            const isSameSport = team.sport === playerSport;
            const alreadyRequested = team.playerRequests?.some(
              (request) => request?.id === playerId
            );
            const alreadyJoined = team.players?.some(
                (request) => request?.id === playerId
              );
              const rejectedPlayerRequests = team.rejectedPlayerRequests?.some(
                (request) => request?.id === playerId
              );
            return isSameSport && !alreadyRequested && !alreadyJoined && !rejectedPlayerRequests;
          });
          
        console.log('teem',filtered);
        setFilteredTeams(filtered);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    if (playerSport) {
      fetchTeams();
    }
  }, [playerSport]);
  const handleJoinRequest = async (teamId) => {
    try {
      const payload = { playerId, teamId };
      const result = await sendJoinRequest(payload);
      alert("Request sent successfully!");
      console.log("Join request result:", result);
      setFilteredTeams((prevTeams) =>
        prevTeams.filter((team) => team.id !== teamId)
      );
  
    } catch (error) {
      alert("Failed to send request.");
    }
  };

  return (
    <div className="p-5 h-full bg-[#F4F7FE]">
      {/* ✅ Player Stats */}
      <PlayerStats />

      {/* ✅ Filtered Teams Display */}
     {isPlayerInTeam ? (
        <p className="text-center text-red-500 font-medium mt-6">
          You are already part of a team. You can only join one team.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
              <div
                key={team.id}
                className="bg-white p-5 shadow-md rounded-2xl flex flex-col justify-between"
              >
                <h3 className="text-xl font-semibold text-[#1B2559] mb-2 border-b pb-2">
                  {team.name}
                </h3>
                <p className="text-gray-500 text-sm mb-1">
                  Sport: <span className="font-medium">{team.sport}</span>
                </p>
                <p className="text-gray-500 text-sm mb-1">
                  Total Players: {team.players.length}
                </p>
                <p className="text-gray-500 text-sm mb-1">
                  Coach: {team.coach}
                </p>
                <button
                  className="mt-4 px-4 py-2 bg-[#4318FF] text-white rounded hover:bg-[#321BB6]"
                  onClick={() => handleJoinRequest(team.id)}
                >
                  Request to Join
                </button>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No teams found for your sport.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
export default JoinTeam;
