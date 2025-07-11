import React, { useState } from "react";
import ticon from "../assets/images/teamicon.png";
import cicon from "../assets/images/coachicon.png";
import picon from "../assets/images/playericon.png";
import micon from "../assets/images/matchicon.png";

const Dashboard = () => {
  // Define tabs and their corresponding data
  const tabs = ["Cricket", "Basketball", "Football", "Volleyball"];
  
  // State to track the selected game
  const [activeTab, setActiveTab] = useState("Cricket");

  // Define stats & table data for each sport
  const statsData = {
    Cricket: { teams: 6, coaches: 6, players: 72, matches: 10 },
    Basketball: { teams: 4, coaches: 3, players: 50, matches: 8 },
    Football: { teams: 5, coaches: 4, players: 60, matches: 12 },
    Volleyball: { teams: 3, coaches: 2, players: 40, matches: 6 },
  };

  const tableData = {
    Cricket: [
      { team: "SE", match: 3, win: 2, loss: 1, pts: 2, nrr: "+1.9" },
      { team: "BBA1", match: 3, win: 2, loss: 1, pts: 2, nrr: "+1.9" },
      { team: "CS", match: 3, win: 2, loss: 1, pts: 2, nrr: "+1.9" },
      { team: "E.E", match: 3, win: 2, loss: 1, pts: 2, nrr: "+1.9" },
    ],
    Basketball: [
      { team: "Lakers", match: 5, win: 4, loss: 1, pts: 8, nrr: "+2.1" },
      { team: "Bulls", match: 5, win: 3, loss: 2, pts: 6, nrr: "+1.5" },
    ],
    Football: [
      { team: "FCB", match: 6, win: 4, loss: 2, pts: 12, nrr: "+3.0" },
      { team: "Real", match: 6, win: 3, loss: 3, pts: 9, nrr: "+1.7" },
    ],
    Volleyball: [
      { team: "Team A", match: 4, win: 3, loss: 1, pts: 6, nrr: "+1.3" },
    ],
  };

  return (
    <div className="p-5 h-full bg-[#F4F7FE]">
      {/* Tabs */}
      <div className="flex flex-wrap justify-start md:justify-center gap-4 md:gap-10 text-lg font-semibold border-b border-[#F4F7FE]">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-2 transition-all ${
              activeTab === tab
                ? "border-b-2 border-[#4318FF] text-[#4318FF]"
                : "text-gray-500 hover:text-[#4318FF]"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mt-5">
        {[
          { label: "Teams", icon: ticon, value: statsData[activeTab].teams },
          { label: "Coaches", icon: cicon, value: statsData[activeTab].coaches },
          { label: "Players", icon: picon, value: statsData[activeTab].players },
          { label: "Total Matches", icon: micon, value: statsData[activeTab].matches },
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

      {/* Table & Upcoming Events Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        {/* Table Section */}
        <div className="bg-white p-5 shadow-md rounded-2xl lg:col-span-2 overflow-x-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">{activeTab} Teams</h2>
            <button className="text-gray-400 hover:text-gray-600 transition">⋮</button>
          </div>
          <table className="w-full mt-3 border-separate border-spacing-y-3">
            <thead>
              <tr className="text-gray-500 text-sm">
                <th className="p-2 text-left">Teams</th>
                <th className="p-2">Match</th>
                <th className="p-2">Win</th>
                <th className="p-2">Loss</th>
                <th className="p-2">PTS</th>
                <th className="p-2">NRR</th>
              </tr>
            </thead>
            <tbody>
              {tableData[activeTab].map((team, index) => (
                <tr key={index} className="bg-[#F4F7FE] rounded-2xl text-[#1B2559] text-sm">
                  <td className="p-3 font-semibold">{team.team}</td>
                  <td className="p-3">{team.match}</td>
                  <td className="p-3">{team.win}</td>
                  <td className="p-3">{team.loss}</td>
                  <td className="p-3">{team.pts}</td>
                  <td className="p-3">{team.nrr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Upcoming Events Section */}
        <div className="bg-white p-5 shadow-md rounded-2xl flex flex-col">
          <div className="flex items-center space-x-2 text-[#F97316]">
            <span className="text-xl">🔥</span>
            <h2 className="text-lg font-bold">Upcoming Events</h2>
          </div>
          <p className="text-gray-500 font-semibold mt-2">Software Engineers vs BBA</p>
          <p className="text-gray-400 text-sm mt-1">Venue: BBA ground</p>
          <div className="mt-4">
            <button className="w-full px-5 py-2 bg-[#4318FF] text-white rounded-2xl font-semibold">
              View Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
