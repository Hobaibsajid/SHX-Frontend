import React, { useEffect, useState } from "react";
import OrganizerStats from "../../components/Common/OrganizerStats";

const GameScore = () => {
  const tabs = ["Cricket", "Basketball", "Football"];
  const [activeTab, setActiveTab] = useState("Cricket");
  const [events, setEvents] = useState([]);
  const [matchesByEvent, setMatchesByEvent] = useState({});
  const [expandedEventIds, setExpandedEventIds] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          "http://https://shx-backend.onrender.com/api/events?populate[matches][populate]=*"
        );
        const data = await res.json();
        const eventsData = data.data;
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
            venue: match.venue,
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

  const toggleEvent = (eventId) => {
    setExpandedEventIds((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const now = new Date();

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

      <OrganizerStats activeTab={activeTab} />

      <div className="mt-4 w-full max-w-7xl mx-auto">
        {events.map((event) => {
          const matches = matchesByEvent[event.id] || [];

          // Filter by tab (case-insensitive & whitespace-safe)
          const filteredMatches = matches.filter(
            (m) =>
              m.game?.trim().toLowerCase() === activeTab.toLowerCase()
          );

          const upcomingMatches = filteredMatches.filter(
            (m) => new Date(m.matchtime) > now
          );
          const completedMatches = filteredMatches.filter(
            (m) => new Date(m.matchtime) <= now
          );

          return (
            <div
              key={event.id}
              className="bg-white p-5 shadow-md rounded-xl mb-6"
            >
              <h2
                className="text-xl font-bold text-[#4318FF] cursor-pointer"
                onClick={() => toggleEvent(event.id)}
              >
                {event.eventName}
              </h2>

              {expandedEventIds.includes(event.id) && (
                <>
                  {[{ label: "Upcoming Matches", data: upcomingMatches },
                    { label: "Completed Matches", data: completedMatches }
                  ].map((section) => (
                    <div key={section.label} className="mt-4">
                      <h3 className="text-md font-semibold text-[#1B2559] mb-2">
                        {section.label}
                      </h3>
                      {section.data.length > 0 ? (
                        <div className="overflow-x-auto rounded-xl shadow">
                          <table className="min-w-full bg-white rounded-xl overflow-hidden">
                            <thead className="bg-[#F0F4FF] text-[#1B2559] text-sm uppercase tracking-wider">
                              <tr>
                                <th className="px-5 py-3 text-left">Date</th>
                                <th className="px-5 py-3 text-left">Team 1</th>
                                <th className="px-5 py-3 text-left">Score</th>
                                <th className="px-5 py-3 text-center">VS</th>
                                <th className="px-5 py-3 text-left">Score</th>
                                <th className="px-5 py-3 text-left">Team 2</th>
                                <th className="px-5 py-3 text-left">Winner</th>
                                <th className="px-5 py-3 text-left">Venue</th>
                              </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                              {section.data.map((match) => (
                                <tr
                                  key={match.id}
                                  className="border-b border-gray-200 hover:bg-indigo-50 transition"
                                >
                                  <td className="px-5 py-3 whitespace-nowrap">
                                    {new Date(match.matchtime).toLocaleString("en-US", {
                                      month: "short",
                                      day: "2-digit",
                                      year: "numeric",
                                      hour: "numeric",
                                      minute: "numeric",
                                      hour12: true,
                                    })}
                                  </td>
                                  <td className="px-5 py-3 font-semibold">
                                    {match.team_1?.teamName}
                                  </td>
                                  <td className="px-5 py-3">
                                    {match.team1_Score !== null ? (
                                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                                        {match.team1_Score}
                                      </span>
                                    ) : (
                                      "-"
                                    )}
                                  </td>
                                  <td className="px-5 py-3 text-center text-gray-400 font-medium">
                                    vs
                                  </td>
                                  <td className="px-5 py-3">
                                    {match.team2_Score !== null ? (
                                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                                        {match.team2_Score}
                                      </span>
                                    ) : (
                                      "-"
                                    )}
                                  </td>
                                  <td className="px-5 py-3 font-semibold">
                                    {match.team_2?.teamName}
                                  </td>
                                  <td className="px-5 py-3">
                                    {match.winner?.teamName ? (
                                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                                        {match.winner.teamName}
                                      </span>
                                    ) : (
                                      <span className="text-gray-400 italic">
                                        Not Announced
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-5 py-3">
                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                                      {match.venue || "Not Assigned"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-sm italic text-gray-500">
                          No {section.label.toLowerCase()}.
                        </p>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameScore;
