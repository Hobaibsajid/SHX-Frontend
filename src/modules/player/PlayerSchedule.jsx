import React, { useEffect, useState } from "react";
import PlayerStats from "../../components/Common/PlayerStats";

const PlayerSchedule = () => {
  const [events, setEvents] = useState([]);
  const [matchesByEvent, setMatchesByEvent] = useState({});
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [expandedEventIds, setExpandedEventIds] = useState([]);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const playerId = storedUser?.user?.playerId?.id;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `http://https://shx-backend.onrender.com/api/teams?populate[players][populate]=*&populate[matchesAsTeam1][populate][team_1][populate][players][populate]=*&populate[matchesAsTeam1][populate][team_2][populate][players][populate]=*&populate[matchesAsTeam1][populate][winner][populate]=*&populate[matchesAsTeam1][populate][event][populate]=*&populate[matchesAsTeam2][populate][team_1][populate][players][populate]=*&populate[matchesAsTeam2][populate][team_2][populate][players][populate]=*&populate[matchesAsTeam2][populate][winner][populate]=*&populate[matchesAsTeam2][populate][event][populate]=*`
        );

        const responseData = await res.json();
        const allTeams = responseData.data;

        const myTeams = allTeams.filter((team) =>
          team?.players?.some((player) => player.id === playerId)
        );
        const myTeamIds = myTeams.map((team) => team.id);

        const matchesByEventMap = {};
        const eventsMap = {};

        const allMatches = [];
        allTeams.forEach((team) => {
          const matches1 = team.matchesAsTeam1 || [];
          const matches2 = team.matchesAsTeam2 || [];
          const combinedMatches = [...matches1, ...matches2];
          allMatches.push(...combinedMatches);
        });

        // ✅ Remove duplicates
        const uniqueMatches = Array.from(
          new Map(allMatches.map((match) => [match.id, match])).values()
        );

        uniqueMatches.forEach((matchAttr) => {
          const eventId = matchAttr.event?.id;
          if (!eventId) return;

          const matchData = {
            id: matchAttr.id,
            eventId,
            eventName: matchAttr.event?.eventName,
            eventStartDate: matchAttr.event?.startDate,
            eventEndDate: matchAttr.event?.endDate,
            matchtime: matchAttr.matchtime,
            game: matchAttr.game,
            team1_Score: matchAttr.team1_Score,
            team2_Score: matchAttr.team2_Score,
            team_1: matchAttr.team_1,
            team_2: matchAttr.team_2,
            winner: matchAttr.winner || null,
            venue: matchAttr.venue || "Not Assigned",
            isMyMatch:
              myTeamIds.includes(matchAttr.team_1?.id) ||
              myTeamIds.includes(matchAttr.team_2?.id),
          };

          if (!matchesByEventMap[eventId]) matchesByEventMap[eventId] = [];
          matchesByEventMap[eventId].push(matchData);

          if (!eventsMap[eventId]) {
            eventsMap[eventId] = {
              eventId,
              eventName: matchAttr.event?.eventName,
            };
          }
        });

        setMatchesByEvent(matchesByEventMap);
        setEvents(Object.values(eventsMap));
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
      <PlayerStats />

      <div className="flex justify-center space-x-4 mb-4 mt-5">
        <button
          onClick={() => setShowAllMatches(false)}
          className={`px-4 py-2 rounded-lg font-semibold shadow ${
            !showAllMatches ? "bg-[#4318FF] text-white" : "bg-white text-[#4318FF]"
          }`}
        >
          My Matches
        </button>
        <button
          onClick={() => setShowAllMatches(true)}
          className={`px-4 py-2 rounded-lg font-semibold shadow ${
            showAllMatches ? "bg-[#4318FF] text-white" : "bg-white text-[#4318FF]"
          }`}
        >
          All Matches
        </button>
      </div>

      <div className="w-full max-w-7xl mx-auto">
        {events.map((event) => {
          const matches = matchesByEvent[event.eventId] || [];
          const filteredMatches = showAllMatches
            ? matches
            : matches.filter((match) => match.isMyMatch);

          const upcomingMatches = filteredMatches.filter(
            (m) => new Date(m.matchtime) > now
          );
          const completedMatches = filteredMatches.filter(
            (m) => new Date(m.matchtime) <= now
          );

          return (
            <div
              key={event.eventId}
              className="bg-white shadow-md rounded-xl mb-4 p-4"
            >
              <h2
                className="text-lg font-bold text-[#4318FF] cursor-pointer"
                onClick={() => toggleEvent(event.eventId)}
              >
                {event.eventName}
              </h2>

              {expandedEventIds.includes(event.eventId) && (
                <>
                  {[{ label: "Upcoming Matches", data: upcomingMatches }, { label: "Completed Matches", data: completedMatches }].map(
                    (section) => (
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
                                {section.data.map((team) => (
                                  <tr
                                    key={team.id}
                                    className="border-b border-gray-200 hover:bg-indigo-50 transition"
                                  >
                                    <td className="px-5 py-3 whitespace-nowrap">
                                      {new Date(team.matchtime).toLocaleString("en-US", {
                                        month: "short",
                                        day: "2-digit",
                                        year: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                        hour12: true,
                                      })}
                                    </td>
                                    <td className="px-5 py-3 font-semibold">
                                      {team.team_1?.teamName}
                                    </td>
                                    <td className="px-5 py-3">
                                      {team.team1_Score !== null ? (
                                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                                          {team.team1_Score}
                                        </span>
                                      ) : (
                                        "-"
                                      )}
                                    </td>
                                    <td className="px-5 py-3 text-center text-gray-400 font-medium">
                                      vs
                                    </td>
                                    <td className="px-5 py-3">
                                      {team.team2_Score !== null ? (
                                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                                          {team.team2_Score}
                                        </span>
                                      ) : (
                                        "-"
                                      )}
                                    </td>
                                    <td className="px-5 py-3 font-semibold">
                                      {team.team_2?.teamName}
                                    </td>
                                    <td className="px-5 py-3">
                                      {team.winner?.teamName ? (
                                        <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                                          {team.winner.teamName}
                                        </span>
                                      ) : (
                                        <span className="text-gray-400 italic">
                                          Not Announced
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-5 py-3">
                                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                                        {team.venue?.name || team.venue || "Not Assigned"}
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
                    )
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerSchedule;
