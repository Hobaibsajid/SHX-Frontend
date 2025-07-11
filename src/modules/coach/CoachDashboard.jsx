import React, { useEffect, useState } from "react";
import CoachStats from "../../components/Common/CoachStats"; // ✅ Import the Coach Stats Component
import { useNavigate } from "react-router-dom";
const CoachDashboard = () => {
  const navigate = useNavigate();
   const [events, setEvents] = useState([]);
    const [matchesByEvent, setMatchesByEvent] = useState({});
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [upcomingMatches, setUpcomingMatches] = useState(false);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const coachId = storedUser?.user?.coachId?.id;
  useEffect(() => {

    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `http://localhost:1337/api/teams?populate[coachid][populate]=*&populate[matchesAsTeam1][populate][team_1][populate][coachid][populate]=*&populate[matchesAsTeam1][populate][team_2][populate][coachid][populate]=*&populate[matchesAsTeam1][populate][winner][populate]=*&populate[matchesAsTeam1][populate][event][populate]=*&populate[matchesAsTeam2][populate][team_1][populate][coachid][populate]=*&populate[matchesAsTeam2][populate][team_2][populate][coachid][populate]=*&populate[matchesAsTeam2][populate][winner][populate]=*&populate[matchesAsTeam2][populate][event][populate]=*`
        );
        
        const responseData = await res.json();
        const allTeams = responseData.data;
        const filteredTeams = allTeams.filter(
          (team) => team.coachid?.id === coachId
        );
  
        const matchesByEventMap = {};
        const eventsMap = {};
        const upcomingMatches = [];  // Initialize array for today's matches
        const today = new Date(); 
        filteredTeams.forEach((team) => {
          const matches1 = team.matchesAsTeam1 || [];
          const matches2 = team.matchesAsTeam2 || [];
          const allMatches = [...matches1, ...matches2];
  
          allMatches.forEach((match) => {
            const matchAttr = match;
            const eventId = matchAttr.event?.id;
            const eventName = matchAttr.event?.eventName;
  
            if (!eventId) return;
            const matchDate = new Date(matchAttr.matchtime);
            matchDate.setHours(0, 0, 0, 0);
            if (!matchesByEventMap[eventId]) matchesByEventMap[eventId] = [];
            matchesByEventMap[eventId].push({
              id: match.id,
              eventId,
              eventName,
              eventStartDate: matchAttr.event?.startDate,
              eventEndDate: matchAttr.event?.endDate,
              matchtime: matchAttr.matchtime,
              game: matchAttr.game,
              team1_Score: matchAttr.team1_Score,
              team2_Score: matchAttr.team2_Score,
              team_1: {
                id: matchAttr.team_1?.id,
                teamName: matchAttr.team_1?.teamName,
                coachid: matchAttr.team_1?.coachid?.id,
              },
              team_2: {
                id: matchAttr.team_2?.id,
                teamName: matchAttr.team_2?.teamName,
                coachid: matchAttr.team_2?.coachid?.id,
              },
              winner: matchAttr.winner || null,
            });
  
            // Save event info
            if (!eventsMap[eventId]) {
              eventsMap[eventId] = {
                eventId,
                eventName,
                eventStartDate: matchAttr.event?.startDate,
                eventEndDate: matchAttr.event?.endDate,
              };
            }

            if (
              matchDate.getDate() === today.getDate() &&
              matchDate.getMonth() === today.getMonth() &&
              matchDate.getFullYear() === today.getFullYear()
            ) {
              // Add this match to the upcomingMatches array
              upcomingMatches.push({
                id: match.id,
                eventId,
                eventName,
                eventStartDate: matchAttr.event?.startDate,
                eventEndDate: matchAttr.event?.endDate,
                matchtime: matchAttr.matchtime,
                game: matchAttr.game,
                team1_Score: matchAttr.team1_Score,
                team2_Score: matchAttr.team2_Score,
                team_1: {
                  id: matchAttr.team_1?.id,
                  teamName: matchAttr.team_1?.teamName,
                  coachid: matchAttr.team_1?.coachid?.id,
                },
                team_2: {
                  id: matchAttr.team_2?.id,
                  teamName: matchAttr.team_2?.teamName,
                  coachid: matchAttr.team_2?.coachid?.id,
                },
                winner: matchAttr.winner || null,
              });
            }
          });
        });
         console.log('up',upcomingMatches);
         
  
        setMatchesByEvent(matchesByEventMap);
        setEvents(Object.values(eventsMap));
        setUpcomingMatches(upcomingMatches);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  
    fetchEvents();
  }, []);

const getTeamStats = (matches) => {
  const teamStatsMap = {};

  matches?.forEach((match) => {
    const { team_1, team_2, winner } = match;
    const teams = [team_1, team_2];

    teams.forEach((team) => {
      if (!team?.id || team?.coachid !== coachId) return;

      if (!teamStatsMap[team.id]) {
        teamStatsMap[team.id] = {
          teamName: team.teamName,
          matchesPlayed: 0,
          wins: 0,
          losses: 0,
          resultNotAnnounced: 0,
        };
      }

      teamStatsMap[team.id].matchesPlayed++;

      if (winner?.id === team.id) {
        teamStatsMap[team.id].wins++;
      } else if (winner?.id && winner?.id !== team.id) {
        teamStatsMap[team.id].losses++;
      } else {
        teamStatsMap[team.id].resultNotAnnounced++;
      }
    });
  });

  return Object.values(teamStatsMap);
};

  
  
  

  return (
    <div className="p-5 h-full bg-[#F4F7FE]">

      {/* ✅ Coach Stats Component */}
      <CoachStats />
      <div className="flex flex-col lg:flex-row gap-8 mt-5 w-full max-w-7xl mx-auto">
  {/* ✅ Score Table Section (75%) */}
  <div className="w-full lg:w-3/4">
    {events.length > 0 ? (
      events.map((event) => {
        const matches = matchesByEvent[event.eventId] || [];
        const teamStats = getTeamStats(matches);
         console.log('matchesss',matches);
         console.log('resss',teamStats);
        return (
          <div
            key={event.eventId}
            className="bg-white p-5 shadow-md rounded-xl mb-8"
          >
            <h2 className="text-xl font-bold text-[#4318FF]">
              {event.eventName}
            </h2>

            {/* Team Stats Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[#1B2559] mb-2">
                Team Stats
              </h3>
              {teamStats.length > 0 ? (
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                  <thead className="bg-[#F4F7FE]">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left text-[#1B2559]">
                        Team Name
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-[#1B2559]">
                        Matches
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-[#1B2559]">
                        Wins
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-[#1B2559]">
                        Losses
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-[#1B2559]">
                        Result Not Announced
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamStats.map((team) => (
                      <tr key={team.teamName}>
                        <td className="border border-gray-300 px-4 py-2">
                          {team.teamName}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {team.matchesPlayed}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {team.wins}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {team.losses}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {team.resultNotAnnounced}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm italic text-gray-500">
                  No team stats available.
                </p>
              )}
            </div>
          </div>
        );
      })
    ) : (
      <p className="text-center text-sm italic text-gray-500">
        No events available.
      </p>
    )}
  </div>

  {/* ✅ Upcoming Notifications Section (25%) */}
  <div className="w-full lg:w-1/4 bg-white p-5 shadow-md rounded-2xl overflow-x-auto h-fit">
  <p className="text-gray-500 font-semibold mt-2 text-center">
        Upcoming Matches
      </p>
    {Array.isArray(upcomingMatches) && upcomingMatches.length === 0 ? (
      <p className="text-gray-500 font-semibold mt-2 text-center">
        No upcoming matches for today.
      </p>
    ) : (
      Array.isArray(upcomingMatches) &&
      upcomingMatches.map((match) => (
        <div key={match.id} className="mt-4 border-b pb-4">
          <p className="text-gray-500 font-semibold mt-2">
            {match.team_1.teamName} vs {match.team_2.teamName}
          </p>
          <p className="text-gray-400 text-sm mt-1">Venue: Sports Arena</p>
          <p className="text-gray-400 text-sm mt-1">
            Date: {new Date(match.matchtime).toLocaleString()}
          </p>
        </div>
      ))
    )}
    <div className="mt-4">
    <button
      onClick={() => navigate('/coach/schedule')}
      className="w-full px-5 py-2 bg-[#4318FF] text-white rounded-2xl font-semibold"
    >
      View Schedule
    </button>
    </div>
  </div>
</div>

    </div>
  );
};
export default CoachDashboard;
