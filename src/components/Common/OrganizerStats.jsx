import React, { useEffect, useState } from "react";
import ticon from "../../assets/images/teamicon.png";
import cicon from "../../assets/images/coachicon.png";
import picon from "../../assets/images/playericon.png";
import micon from "../../assets/images/matchicon.png";

const OrganizerStats = ({ activeTab }) => {
  const [stats, setStats] = useState({
    teams: 0,
    coaches: 0,
    players: 0,
    matches: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all data
        const [teamsRes, coachesRes, playersRes, matchesRes] = await Promise.all([
          fetch("https://shx-backend.onrender.com/api/teams"),
          fetch("https://shx-backend.onrender.com/api/coaches"),
          fetch("https://shx-backend.onrender.com/api/players"),
          fetch("https://shx-backend.onrender.com/api/matches"),
        ]);
    
        const [teamsData, coachesData, playersData, matchesData] = await Promise.all([
          teamsRes.json(),
          coachesRes.json(),
          playersRes.json(),
          matchesRes.json(),
        ]);
      
        // Filter each by sport
        const filteredTeams = teamsData.data.filter((t) => t.sport === activeTab);
        const filteredCoaches = coachesData.data.filter((c) => c.sport === activeTab);
        const filteredPlayers = playersData.data.filter((p) => p.sport === activeTab);
        const filteredMatches = matchesData.data.filter((m) => m.game === activeTab);
      //console.log('data',filteredTeams,filteredPlayers,filteredCoaches,filteredMatches);
      
        setStats({
          teams: filteredTeams.length,
          coaches: filteredCoaches.length,
          players: filteredPlayers.length,
          matches: filteredMatches.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [activeTab]);

  const statsArray = [
    { label: "Teams", icon: ticon, value: stats.teams },
    { label: "Coaches", icon: cicon, value: stats.coaches },
    { label: "Players", icon: picon, value: stats.players },
    { label: "Total Matches", icon: micon, value: stats.matches },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mt-5">
      {statsArray.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-5 shadow-md rounded-2xl flex items-center space-x-4"
        >
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

export default OrganizerStats;
