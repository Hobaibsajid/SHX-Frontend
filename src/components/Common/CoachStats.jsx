import React, { useEffect, useState } from "react";
import ticon from "../../assets/images/teamicon.png";
import picon from "../../assets/images/playericon.png";
import micon from "../../assets/images/matchicon.png";

const CoachStats = () => {
  const [teams, setTeams] = useState([]);
  const [playersCount, setPlayersCount] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);
 
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const CoachId = storedUser?.user?.coachId?.id;

  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        // ✅ Fetch teams with populated players and matches
        const res = await fetch(`https://shx-backend.onrender.com/api/teams?populate=matchesAsTeam1&populate=matchesAsTeam2&populate=players&filters[coachid][id][$eq]=${CoachId}`);
        
        const data = await res.json();
        const teamsList = data.data || [];

        setTeams(teamsList);
       console.log('teamlist',teamsList);
       
        // ✅ Aggregate players and matches from all teams
        const allPlayers = teamsList.flatMap(team => team.players || []);
        const allMatchesAsTeam1 = teamsList.flatMap(team => team.matchesAsTeam1 || []);
        const allMatchesAsTeam2 = teamsList.flatMap(team => team.matchesAsTeam2 || []);
        
        // Combine both match arrays
        const allMatches = [...allMatchesAsTeam1, ...allMatchesAsTeam2];
        console.log('players',allPlayers.length);
        console.log('matches',allMatches.length);
        setPlayersCount(allPlayers.length);
        setMatchesCount(allMatches.length);
      } catch (err) {
        console.error("Failed to fetch coach data:", err);
      }
    };

    if (CoachId) {
      fetchCoachData();
    }
  }, [CoachId]);

  const statsData = {
    teams: teams.length,
    players: playersCount,
    matches: matchesCount,
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

export default CoachStats;
