import React, { useEffect, useState } from "react";
import PlayerStats from "../../components/Common/PlayerStats"; 

import dp from "../../assets/images/dp.png";

const PlayerTeam = () => {
  // ✅ Dummy Team Data
  const [teamData] = useState([
    { id: 1, name: "Adela Parkson", role: "All rounder", number: 7, image: dp },
    { id: 2, name: "Christian Mad", role: "Batsman", number: 10, image: dp },
    { id: 3, name: "Jason Statham", role: "Batsman", number: 3, image: dp },
    { id: 4, name: "John Doe", role: "Batsman", number: 12, image: dp },
    { id: 5, name: "Alex Smith", role: "Batsman", number: 5, image: dp },
    { id: 6, name: "Mike Johnson", role: "Bowler", number: 9, image: dp },
  ]);
   const [events, setEvents] = useState([]);
          const [matchesByEvent, setMatchesByEvent] = useState({});
          const [selectedEventId, setSelectedEventId] = useState(null);
          const [showMatchModal, setShowMatchModal] = useState(false);
          const [filteredTeams, setFilteredTeams] = useState([]);

          const storedUser = JSON.parse(localStorage.getItem("user"));
          const playerId = storedUser?.user?.playerId?.id;
  useEffect(() => {
      
          const fetchTeams = async () => {
  try {
    const res = await fetch(
        `http://localhost:1337/api/teams?populate[players][populate]=*&populate[matchesAsTeam1][populate][team_1][populate][players][populate]=*&populate[matchesAsTeam1][populate][team_2][populate][players][populate]=*&populate[matchesAsTeam1][populate][winner][populate]=*&populate[matchesAsTeam1][populate][event][populate]=*&populate[matchesAsTeam2][populate][team_1][populate][players][populate]=*&populate[matchesAsTeam2][populate][team_2][populate][players][populate]=*&populate[matchesAsTeam2][populate][winner][populate]=*&populate[matchesAsTeam2][populate][event][populate]=*`
      );
   
    
    const responseData = await res.json();
    const allTeams = responseData.data;
    console.log('player sc teams',allTeams);
    const filteredTeams = allTeams.filter((team) =>
        team?.players?.some((player) => player.id === playerId)
      );
console.log('player sc',filteredTeams);

    const matchesByEventMap = {};
    const eventsMap = {};
console.log('filttt',filteredTeams);
setFilteredTeams(filteredTeams); 
  
console.log('byeve',matchesByEventMap);

    setMatchesByEvent(matchesByEventMap);
    setEvents(Object.values(eventsMap));
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};

fetchTeams();
}, []);
  return (
    
      <div className="p-5 h-full bg-[#F4F7FE]">
        {/* ✅ Loop through each filtered team */}
        {filteredTeams.map((team) => (
          <div key={team.id} className="mt-6 w-full max-w-7xl mx-auto bg-white p-6 shadow-md rounded-xl">
            <h2 className="text-2xl font-bold text-[#1B2559]">{team.teamName || 'Team Name Not Provided'}</h2>
            <h3 className="text-lg font-semibold text-[#1B2559] mt-2">Team Members</h3>
    
            {/* ✅ Scrollable Team List (Hidden Scrollbar) */}
            <div className="mt-5 max-h-[400px] overflow-y-scroll scrollbar-hide">
              <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-gray-500 text-sm">
                    <th className="py-2 px-4">Player</th>
                    <th className="py-2 px-4">Role</th>
                    <th className="py-2 px-4">Number</th>
                  </tr>
                </thead>
                <tbody>
                  {team.players.map((player) => (
                    <tr key={player.id} className="bg-[#F4F7FE] rounded-lg text-[#1B2559]">
                      <td className="py-3 px-4 flex items-center space-x-3">
                        <img
                          src={dp || '/default-avatar.png'} // use fallback if no image
                          alt={player.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="font-semibold">{player.name}</span>
                      </td>
                      <td className="py-3 px-4">{player.role || 'Not Specified'}</td>
                      <td className="py-3 px-4">{player.playerNumber || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
    
  
};

export default PlayerTeam;
