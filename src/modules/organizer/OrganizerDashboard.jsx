import React, { useEffect, useState } from "react";
import OrganizerStats from "../../components/Common/OrganizerStats";

const OrganizerDashboard = () => {
  const tabs = ["Cricket", "Basketball", "Football",];
  const [activeTab, setActiveTab] = useState("Cricket");
  const [events, setEvents] = useState([]);
  const [matchesByEvent, setMatchesByEvent] = useState({});
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:1337/api/events?populate[matches][populate]=*");
        const data = await res.json();
        const eventsData = data.data;
        
        console.log('Event Data:', eventsData);
        setEvents(eventsData);

        const matchesMap = {};

        eventsData.forEach((event) => {
          const matches = Array.isArray(event.matches?.data)
            ? event.matches.data
            : event.matches || [];
        
          matchesMap[event.id] = matches.map((match) => ({
            id: match.id,
            matchtime: match.matchtime,
            game: match.game,
            team1_Score: match.team1_Score,
            team2_Score: match.team2_Score,
            team_1: match.team_1 || {},
            team_2: match.team_2 || {},
            winner: match.winner || {},
          }));
        });
        
        setMatchesByEvent(matchesMap);
        
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const getTeamStats = (matches) => {
    const teamStatsMap = {};
    let resultNotAnnounced = 0;

    matches?.forEach((match) => {
      const team1 = match.team_1;
      const team2 = match.team_2;
      const winner = match.winner;

      if (team1?.id) {
        if (!teamStatsMap[team1.id]) {
          teamStatsMap[team1.id] = {
            teamName: team1.teamName,
            matchesPlayed: 0,
            wins: 0,
            losses: 0,
            resultNotAnnounced: 0,
          };
        }
        teamStatsMap[team1.id].matchesPlayed++;
        if (winner?.id === team1.id) {
          teamStatsMap[team1.id].wins++;
        } else if (winner?.id && winner?.id !== team1.id) {
          teamStatsMap[team1.id].losses++;
        }
         else {
          teamStatsMap[team1.id].resultNotAnnounced++;
          resultNotAnnounced++;
        }
      }

      if (team2?.id) {
        if (!teamStatsMap[team2.id]) {
          teamStatsMap[team2.id] = {
            teamName: team2.teamName,
            matchesPlayed: 0,
            wins: 0,
            losses: 0,
            resultNotAnnounced: 0,
          };
        }
        teamStatsMap[team2.id].matchesPlayed++;
        if (winner?.id === team2.id) {
          teamStatsMap[team2.id].wins++;
        } else if (winner?.id && winner?.id !== team2.id) {
          teamStatsMap[team2.id].losses++;
        } 
        else {
          teamStatsMap[team2.id].resultNotAnnounced++;
          resultNotAnnounced++;
        }
      }
    });
    return Object.values(teamStatsMap);
  };

  return (
    <div className="p-5 h-full bg-[#F4F7FE]">
      {/* Tabs Section */}
      <div className="flex flex-wrap justify-start md:justify-center gap-4 md:gap-10 text-lg font-semibold border-b border-[#F4F7FE]">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-2 transition-all ${activeTab === tab ? "border-b-2 border-[#4318FF] text-[#4318FF]" : "text-gray-500 hover:text-[#4318FF]"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Organizer Stats Component */}
      <OrganizerStats activeTab={activeTab} />

      {/* Events and Matches Section */}
      <div className="mt-2 w-full max-w-7xl mx-auto">
        {events.length > 0 ? (
          events.map((event) => {
            const eventAttributes = event; // ensure number
            const matchesForEvent = matchesByEvent[eventAttributes.id] || [];  // Access matches by event ID

            console.log('Matches for even99t:', matchesByEvent);
            console.log('Active Tab:', activeTab);
            console.log("Current eventAttributes.id:", eventAttributes.id);
            console.log("Before filtering, matches:", matchesForEvent);
            // Step 1: Log the matches before filtering
            console.log("Before filtering, matches:", matchesForEvent);

            // Step 2: Filter matches based on the active tab (game)
            const filteredMatches = matchesForEvent?.filter((match) => match.game === activeTab);

            // Step 3: Log the filtered matches
            console.log("Filtered matches:", filteredMatches);

            // Step 4: Get team stats for the filtered matches
            const teamStats = getTeamStats(filteredMatches);

            return (
              <div key={event.id} className="bg-white p-5 shadow-md rounded-xl mb-8">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                    <h2 className="text-2xl font-bold text-[#1B2559]">{eventAttributes.eventName}</h2>
                    <div className="text-sm text-gray-500 mt-1 sm:mt-0">
                      Start Date: {eventAttributes.startDate} | End Date: {eventAttributes.endDate}
                    </div>
                  </div>
                 
                </div>

                {/* Team Stats Section */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-[#1B2559] mb-2">Team Stats</h3>
                  {teamStats.length > 0 ? (
                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                      <thead className="bg-[#F4F7FE]">
                        <tr>
                          <th className="border border-gray-300 px-4 py-2 text-left text-[#1B2559]">Team Name</th>
                          <th className="border border-gray-300 px-4 py-2 text-left text-[#1B2559]">Matches </th>
                          <th className="border border-gray-300 px-4 py-2 text-left text-[#1B2559]">Wins</th>
                          <th className="border border-gray-300 px-4 py-2 text-left text-[#1B2559]">Losses</th>
                          
                            <th className="border border-gray-300 px-4 py-2 text-left text-[#1B2559]">Result Not Announced</th>
                          
                        </tr>
                      </thead>
                      <tbody>
                        {teamStats.map((team) => (
                          <tr key={team.teamName}>
                            <td className="border border-gray-300 px-4 py-2">{team.teamName}</td>
                            <td className="border border-gray-300 px-4 py-2">{team.matchesPlayed}</td>
                            <td className="border border-gray-300 px-4 py-2">{team.wins}</td>
                            <td className="border border-gray-300 px-4 py-2">{team.losses}</td>
                           
                              <td className="border border-gray-300 px-4 py-2">{team.resultNotAnnounced}</td>
                            
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-sm italic text-gray-500">No team stats available.</p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-sm italic text-gray-500">No events available.</p>
        )}
      </div>
      
    </div>
  );
};

export default OrganizerDashboard;


