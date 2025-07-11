import React, { useEffect, useState } from "react";
import ticon from "../../assets/images/teamicon.png";
import picon from "../../assets/images/playericon.png";
import micon from "../../assets/images/matchicon.png";

const PlayerStats = () => {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]); // If needed
const [matchesCount, setMatchesCount] = useState(0);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const playerId = storedUser?.user?.playerId?.id;
console.log('pp',playerId);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        // ✅ Fetch Teams assigned to this coach
        const teamRes = await fetch(`http://localhost:1337/api/teams?populate=players&filters[players][id][$eq]=${playerId}&populate=matchesAsTeam1&populate=matchesAsTeam2`);
        const teamData = await teamRes.json();
        const teamsList = teamData.data || [];
       console.log('teamlist',teamsList);
       
        setTeams(teamsList);
const allMatchesAsTeam1 = teamsList.flatMap(team => team.matchesAsTeam1 || []);
        const allMatchesAsTeam2 = teamsList.flatMap(team => team.matchesAsTeam2 || []);
        
        // Combine both match arrays
        const allMatches = [...allMatchesAsTeam1, ...allMatchesAsTeam2];
       
        console.log('matches',allMatches.length);
       
        setMatchesCount(allMatches.length);
        // ✅ Extract all players from those teams
        const allPlayers = teamsList.flatMap(team => team.players);
        setPlayers(allPlayers);
        console.log('playlist',allPlayers);
        // Optionally fetch matches if needed
        // const matchRes = await fetch(`...`);
        // setMatches(...);

      } catch (error) {
        console.error("Error fetching coach stats:", error);
      }
    };

    if (playerId) {
      fetchPlayerData();
    }
  }, [playerId]);

  const statsData = {
    teams: teams.length,
    players: players.length,
    matches: matchesCount, // Or matches.length if fetched
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
      {[
        { label: "Team", icon: ticon, value: statsData.teams },
        { label: "Players", icon: picon, value: statsData.players },
        { label: "Total Matches", icon: micon, value: statsData.matches },
      ].map((stat, index) => (
        <div key={index} className="bg-white p-5 shadow-md rounded-2xl flex items-center space-x-4">
          <div className="bg-[#F4F7FE] p-3 rounded-full flex justify-center items-center w-12 h-12">
            <img src={stat.icon} alt={stat.label} className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <h2 className="text-xl font-bold text-[#1B2559]">{stat.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayerStats;
