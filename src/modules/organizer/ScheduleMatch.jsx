import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { addnewEvent } from "../../../services/Organizer.js";
import { addNewMatch } from "../../../services/Organizer.js";
import { addMatchScore } from "../../../services/Organizer.js";
import OrganizerStats from "../../components/Common/OrganizerStats";
import axios from "axios";
const EventsPage = () => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchData, setMatchData] = useState([]);
  const tabs = ["Cricket", "Basketball", "Football",];
  const [activeTab, setActiveTab] = useState("Cricket");
  const [newEvent, setNewEvent] = useState({
    eventName: "",
    startDate: "",
    endDate: "",
     venues: [""],
  });
  const [events, setEvents] = useState([]); // State for storing fetched events
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const games = ["Cricket", "Basketball", "Football"];
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [matchesByEvent, setMatchesByEvent] = useState({});
  const [scoredMatches, setScoredMatches] = useState([]);
const [selectedEventVenues, setSelectedEventVenues] = useState([]);

  const [teams, setTeams] = useState([]);
  const [newMatch, setNewMatch] = useState({
    date: "",
    team1: "",
    team2: "",
     venue: "",
  });
  const [showScoreModal, setShowScoreModal] = useState(false);
 const [selectedMatch, setSelectedMatch] = useState({
  id: null,
  game: "",
  team_1: null,
  team_2: null,
  // other expected match fields
});


  const [scoreData, setScoreData] = useState({
    team1Score: "",
    team2Score: "",
    winner: "",
  });
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const organizerId = storedUser?.user?.organizerId?.id;
  // Fetch events from the backend
  const fetchEvents = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://shx-backend.onrender.com/api/events?filters[organizer][id][$eq]=${organizerId}`
      );
      const result = await response.json();
      setEvents(result.data);
      console.log("eve", result.data);
    } catch (err) {
      setError("An error occurred while fetching events.");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []); // Only run once when the component mounts
  useEffect(() => {
    const loadMatches = async () => {
      const allMatches = {};

      for (const event of events) {
        const matches = await fetchMatchesByEvent(event.id);
        allMatches[event.id] = matches;
      }

      setMatchesByEvent(allMatches);
    };

    if (events.length > 0) {
      loadMatches();
    }
  }, [events]);

  const handleEventChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const addMatch = () => {
    setMatchData((prev) => [...prev, newMatch]);
    setNewMatch({ date: "", team1: "", team2: "" });
    setShowMatchModal(false);
  };
const handleVenueChange = (index, value) => {
  const updatedVenues = [...newEvent.venues];
  updatedVenues[index] = value;
  setNewEvent({ ...newEvent, venues: updatedVenues });
};
const handleAddVenueField = () => {
  setNewEvent({ ...newEvent, venues: [...newEvent.venues, ""] });
};
  const handleAddEvent = async (e) => {
    e.preventDefault(); // Prevent default form behavior (if wrapped in a form)
    setError(""); // Clear previous errors
    setLoading(true);

    // Get today's date in YYYY-MM-DD format
    const today = new Date().setHours(0, 0, 0, 0);
    const start = new Date(newEvent.startDate).setHours(0, 0, 0, 0);
    const end = new Date(newEvent.endDate).setHours(0, 0, 0, 0);

    // Validation
    if (!newEvent.eventName || !newEvent.startDate || !newEvent.endDate) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (start < today) {
      setError("Start date cannot be in the past.");
      setLoading(false);
      return;
    }

    if (end < start) {
      setError("End date cannot be before start date.");
      setLoading(false);
      return;
    }

    try {
      const response = await addnewEvent({
        eventName: newEvent.eventName,
        startDate: newEvent.startDate,
        endDate: newEvent.endDate,
         venues: newEvent.venues.filter(v => v.trim() !== ""),
        organizer: organizerId,
      });

      console.log("Event added successfully---", response);
      setNewEvent({ eventName: "", startDate: "", endDate: "" ,venues: [""] });
      setShowEventModal(false);
    } catch (err) {
      console.error("Error adding event", err);
      setError(
        err.response?.data?.error?.message ||
          "An error occurred while adding the event"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMatchChange = (e) => {
    setNewMatch({ ...newMatch, [e.target.name]: e.target.value });
  };

  const handleGameChange = async (e) => {
    const selected = e.target.value;
    setSelectedGame(selected);
    setNewMatch({ ...newMatch, team1: "", team2: "" }); // clear teams

    try {
      const response = await axios.get(
        `https://shx-backend.onrender.com/api/teams?filters[sport][$eq]=${selected}`
      );
      setTeams(response.data.data);
      console.log("team", response.data.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
      setTeams([]);
    }
  };

  const minPlayersBySport = {
  basketball: 5,
  cricket: 11,
  football: 11,
};
const getTeamPlayerCount = async (teamId) => {
  const res = await fetch(`https://shx-backend.onrender.com/api/players?filters[teams][id][$eq]=${teamId}`);
  const data = await res.json();
  return data?.data?.length || 0;
};

  const handleCreateMatch = async (e) => {
    setError("");
    try {
      if (
        !selectedGame ||
        !newMatch.date ||
        !newMatch.team1 ||
        !newMatch.team2 ||
         !newMatch.venue
      ) {
        alert("Please fill all fields");
        return;
      }
      const sport = selectedGame.toLowerCase();
    const minPlayers = minPlayersBySport[sport];

    if (!minPlayers) {
      alert("Unknown sport selected.");
      return;
    }

    const team1Count = await getTeamPlayerCount(newMatch.team1);
    const team2Count = await getTeamPlayerCount(newMatch.team2);

    if (team1Count < minPlayers || team2Count < minPlayers) {
      alert(
        `Both teams must have at least ${minPlayers} players for ${selectedGame}.`
      );
      return;
    }


      const payload = {
        game: selectedGame,
        date: newMatch.date,
        team1: newMatch.team1,
        team2: newMatch.team2,
        event: selectedEventId,
          venue: newMatch.venue,
      };
      console.log("ppa", payload);

      const response = await addNewMatch(payload);
      console.log("Match created successfully---", response);

      // Optionally, reset the form fields after successful submission
      setNewMatch({ date: "", team1: "", team2: "" });
      setShowMatchModal(false);
      setError("");
    } catch (error) {
      console.error("Error creating match:", error);

      setError(
        error.response.data.message ||
          "An error occurred while creating the match"
      );
    } finally {
      setLoading(false); // Hide loading state once the request is completed
    }
  };

  const handleCancel = () => {
    setShowMatchModal(false); // or any logic to hide the modal
  };
  const fetchMatchesByEvent = async (eventId) => {
    try {
      const response = await axios.get(
        `https://shx-backend.onrender.com/api/matches?filters[event][id][$eq]=${eventId}&populate=*`
      );
      console.log("matces", response.data.data);

      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch matches for event:", eventId, error);
      return [];
    }
  };
 const handleAddScore = async (match) => {
  try {
    const response = await axios.get(`https://shx-backend.onrender.com/api/matches/?filters[id][$eq]=${match.id}&populate=*`);
    const matchData = response.data?.data?.[0]; // get first match
if (!matchData) {
  console.error("Match not found");
  return;
}

setSelectedMatch({
  ...matchData,
  id: matchData.id,
  team_1: matchData.team_1,
  team_2: matchData.team_2,
  game: matchData.game,
});
console.log('ss',selectedMatch);

    setShowScoreModal(true);
  } catch (err) {
    console.error("Error fetching match details:", err);
  }
};
const [openEventId, setOpenEventId] = useState(null); // track open dropdown

const toggleEventDropdown = (eventId) => {
  setOpenEventId((prevId) => (prevId === eventId ? null : eventId));
};


  const handleSubmitScore = async () => {
  if (!selectedMatch) return;

  const team1Score = parseInt(scoreData.team1Score);
  const team2Score = parseInt(scoreData.team2Score);
  const game = selectedMatch.game?.toLowerCase(); // ensure lowercase for comparison

  // Score limits by game type
  const scoreLimits = {
    basketball: 200,
    cricket: 300,
    football: 15,
  };

  const maxScore = scoreLimits[game];

  if (maxScore === undefined) {
    alert(`Unknown game type: ${selectedMatch.game}`);
    return;
  }

  if (team1Score > maxScore || team2Score > maxScore) {
    alert(`Scores cannot exceed ${maxScore} for ${selectedMatch.game}`);
    return;
  }
if (team1Score === team2Score) {
    alert("Scores cannot be equal. A match cannot end in a tie.");
    return;
  }
  // Determine winner
  let winnerId = null;
  if (team1Score > team2Score) {
    winnerId = selectedMatch.team_1?.id;
  } else if (team2Score > team1Score) {
    winnerId = selectedMatch.team_2?.id;
  } else {
    winnerId = null; // it's a draw
  }

  const payload = {
    matchId: selectedMatch.id,
    team1Score,
    team2Score,
    winnerId,
  };

  try {
    const response = await addMatchScore(payload);
    console.log("Match score submitted successfully:", response);
    setShowScoreModal(false);
    setScoredMatches((prev) => [...prev, selectedMatch.id]);
    setScoreData({ team1Score: "", team2Score: "", winner: "" });
  } catch (error) {
    console.error("Error submitting score:", error);
  }
};


  return (
    <div className="p-5 h-auto bg-[#F4F7FE]">
      {/* Sport Tabs */}
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

      {/* OrganizerStats */}
      <OrganizerStats activeTab={activeTab} />
      <div className="p-6 relative">
        {/* Add Event Button (Top Right) */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowEventModal(true)}
            className="text-sm bg-[#4318FF] text-white px-4 py-2 rounded-md hover:bg-[#321BB6] transition"
          >
            + Add Event
          </button>
        </div>

        {/* Event Card */}
        <div className="mt-2 w-full max-w-7xl mx-auto">
          {events.length > 0 ? (
  events.map((event) => {
    const filteredMatches = matchesByEvent[event.id]?.filter(
      (match) => match.game === activeTab
    );

    const isOpen = openEventId === event.id;

    return (
      <div key={event.id} className="bg-white p-4 shadow-md rounded-xl mb-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleEventDropdown(event.id)}>
          <div>
            <h2 className="text-xl font-bold text-[#1B2559]">{event.eventName}</h2>
            <p className="text-sm text-gray-500">
              {event.startDate} to {event.endDate}
            </p>
          </div>
          <div className="text-[#4318FF] text-lg">
            {isOpen ? "▲" : "▼"}
          </div>
          {/* 👇 Insert the + Add Match button here */}
        <div className="flex justify-end mb-3">
          <button
            onClick={async () => {
              setSelectedEventId(event.id);
              const response = await axios.get(
                `https://shx-backend.onrender.com/api/events?filters[id][$eq]=${event.id}`
              );
              const venues = response.data?.data?.[0]?.venues || [];
              setSelectedEventVenues(venues);
              setShowMatchModal(true);
            }}
            className="text-sm bg-[#4318FF] text-white px-4 py-2 rounded-md hover:bg-[#321BB6]"
          >
            + Add Match
          </button>
        </div>
        </div>

        {isOpen && (
          <>
            <div className="text-sm text-gray-500 mt-3">Matches</div>
            {filteredMatches && filteredMatches.length > 0 ? (
              <div className="overflow-x-auto mt-3">
                <table className="min-w-full bg-white rounded-xl overflow-hidden">
                  <thead className="bg-[#F0F4FF] text-[#1B2559] text-sm uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3 text-left">Match</th>
                      <th className="px-5 py-3 text-left">Date & Time</th>
                      <th className="px-5 py-3 text-left">Venue</th>
                      <th className="px-5 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    {filteredMatches.map((match) => (
                      <tr key={match.id} className="border-b border-gray-200 hover:bg-indigo-50 transition">
                        <td className="px-5 py-3">
                          <span className="font-medium">
                            {match.team_1?.teamName} vs {match.team_2?.teamName}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {new Date(match.matchtime).toLocaleString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })}
                        </td>
                        <td className="px-5 py-3">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                            {match.venue || "Not Assigned"}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => handleAddScore(match)}
                            className={`px-4 py-1 rounded-md text-sm transition font-semibold 
                              ${
                                match.team1_Score !== null && match.team2_Score !== null
                                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                  : "bg-[#4318FF] hover:bg-[#321BB6] text-white"
                              }`}
                          >
                            {match.team1_Score !== null && match.team2_Score !== null
                              ? "Edit Score"
                              : "Add Score"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic mt-2">No matches available for this event.</p>
            )}
          </>
        )}
      </div>
    );
  })
) : (
  <p className="text-center text-gray-500">No events to display</p>
)}

        </div>

        {/* Add event Modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96">
              <h3 className="text-xl font-bold mb-4 text-[#1B2559] flex items-center space-x-2">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-[#4318FF]"
                />
                <span>Create New Event</span>
              </h3>

              <div className="mb-3">
                <label className="text-gray-600 text-sm">Event Name</label>
                <input
                  type="text"
                  name="eventName"
                  value={newEvent.eventName}
                  onChange={handleEventChange}
                  placeholder="Enter event name"
                  className="w-full px-4 py-2 bg-[#F4F7FE] border rounded-lg focus:ring-2 focus:ring-[#4318FF] outline-none"
                />
              </div>

              <div className="mb-3">
                <label className="text-gray-600 text-sm">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={newEvent.startDate}
                  onChange={handleEventChange}
                  className="w-full px-4 py-2 bg-[#F4F7FE] border rounded-lg focus:ring-2 focus:ring-[#4318FF] outline-none"
                />
              </div>

              <div className="mb-3">
                <label className="text-gray-600 text-sm">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={newEvent.endDate}
                  onChange={handleEventChange}
                  className="w-full px-4 py-2 bg-[#F4F7FE] border rounded-lg focus:ring-2 focus:ring-[#4318FF] outline-none"
                />
              </div>
              <div className="mb-3">
                <label className="text-gray-600 text-sm">Venues</label>
                {newEvent.venues.map((venue, index) => (
                  <input
                    key={index}
                    type="text"
                    value={venue}
                    onChange={(e) => handleVenueChange(index, e.target.value)}
                    placeholder={`Venue ${index + 1}`}
                    className="w-full px-4 py-2 mb-2 bg-[#F4F7FE] border rounded-lg focus:ring-2 focus:ring-[#4318FF] outline-none"
                  />
                ))}
                <button
                  type="button"
                  className="text-sm text-[#4318FF] underline mt-1"
                  onClick={handleAddVenueField}
                >
                  + Add More Venue
                </button>
              </div>
              {error && (
                <div className="mb-3">
                  <p className="text-red-500 text-sm text-center">{error}</p>
                </div>
              )}
              <div className="flex justify-between mt-4">
                <button
                  className="px-4 py-2 border border-[#4318FF] text-[#4318FF] rounded-lg hover:bg-[#F4F7FE] w-1/2 mr-2"
                  onClick={() => setShowEventModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#4318FF] text-white rounded-lg hover:bg-[#321BB6] w-1/2"
                  onClick={handleAddEvent}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add match Modal */}
        {showMatchModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96">
              <h3 className="text-xl font-bold mb-4 text-[#1B2559] flex items-center space-x-2">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-[#4318FF]"
                />
                <span>Add New Match</span>
              </h3>

              <div className="mb-3">
                <label className="text-gray-600 text-sm">Game</label>
                <select
                  value={selectedGame}
                  onChange={handleGameChange}
                  className="w-full px-4 py-2 bg-[#F4F7FE] border rounded-lg focus:ring-2 focus:ring-[#4318FF] outline-none"
                >
                  <option value="">Select a game</option>
                  {games.map((game, index) => (
                    <option key={index} value={game}>
                      {game}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="text-gray-600 text-sm">Date</label>
                <input
                  type="datetime-local"
                  name="date"
                  value={newMatch.date}
                  onChange={handleMatchChange}
                  className="w-full px-4 py-2 bg-[#F4F7FE] border rounded-lg focus:ring-2 focus:ring-[#4318FF] outline-none"
                />
              </div>
              <div className="mb-3">
                <label className="text-gray-600 text-sm">Venue</label>
                <select
                  name="venue"
                  value={newMatch.venue}
                  onChange={handleMatchChange}
                  className="w-full px-4 py-2 bg-[#F4F7FE] border rounded-lg focus:ring-2 focus:ring-[#4318FF] outline-none"
                >
                  <option value="">Select a venue</option>
                  {selectedEventVenues.map((venue, index) => (
                    <option key={index} value={venue}>
                      {venue}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="text-gray-600 text-sm">Team 1</label>
                <select
                  name="team1"
                  value={newMatch.team1}
                  onChange={handleMatchChange}
                  className="w-full px-4 py-2 bg-[#F4F7FE] border rounded-lg focus:ring-2 focus:ring-[#4318FF] outline-none"
                >
                  <option value="">Select Team 1</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.teamName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="text-gray-600 text-sm">Team 2</label>
                <select
                  name="team2"
                  value={newMatch.team2}
                  onChange={handleMatchChange}
                  className="w-full px-4 py-2 bg-[#F4F7FE] border rounded-lg focus:ring-2 focus:ring-[#4318FF] outline-none"
                >
                  <option value="">Select Team 2</option>
                  {teams
                    .filter((team) => team.name !== newMatch.team1)
                    .map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.teamName}
                      </option>
                    ))}
                </select>
              </div>
              {error && (
                <div className="mb-3">
                  <p className="text-red-500 text-sm text-center">{error}</p>
                </div>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateMatch}
                  className="px-4 py-2 bg-[#4318FF] text-white rounded-md hover:bg-[#321BB6]"
                >
                  Create Match
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Add score Modal */}
        {showScoreModal && selectedMatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">
              <h3 className="text-xl font-bold mb-4 text-[#1B2559] text-center">
                Add Match Score
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {selectedMatch.team_1?.teamName} Score
                </label>
                <input
                  type="number"
                  value={scoreData.team1Score}
                  onChange={(e) =>
                    setScoreData({ ...scoreData, team1Score: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-[#F4F7FE]"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {selectedMatch.team_2?.teamName} Score
                </label>
                <input
                  type="number"
                  value={scoreData.team2Score}
                  onChange={(e) =>
                    setScoreData({ ...scoreData, team2Score: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-[#F4F7FE]"
                />
              </div>

              {/* <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Winner
                </label>
                <select
                  value={scoreData.winner}
                  onChange={(e) =>
                    setScoreData({ ...scoreData, winner: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-[#F4F7FE]"
                >
                  <option value="">Select Winner</option>
                  <option value={selectedMatch.team_1?.id}>
                    {selectedMatch.team_1?.teamName}
                  </option>
                  <option value={selectedMatch.team_2?.id}>
                    {selectedMatch.team_2?.teamName}
                  </option>
                </select>
              </div> */}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowScoreModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitScore}
                  className="px-4 py-2 bg-[#4318FF] text-white rounded-md hover:bg-[#321BB6]"
                >
                  Submit Score
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
