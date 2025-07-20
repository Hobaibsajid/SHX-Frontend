import React, { useState, useEffect } from "react";
import CoachStats from "../../components/Common/CoachStats";
import dp from "../../assets/images/dp.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faTimes,
  faUserPlus,
  faTrashAlt,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import axios from "axios";
import { acceptPlayerRequest } from "../../../services/coach.js";
import { rejectPlayerRequest } from "../../../services/coach.js";
import { createTeam } from "../../../services/coach.js";
import { removePlayer } from "../../../services/coach.js";
import { assignRole } from "../../../services/coach.js";
// const allPlayers = [
//   { id: 1, name: "Adela Parkson", role: "All rounder", number: 7, image: dp },
//   { id: 2, name: "Christian Mad", role: "Batsman", number: 10, image: dp },
//   { id: 3, name: "Jason Statham", role: "Batsman", number: 3, image: dp },
//   { id: 4, name: "John Doe", role: "Batsman", number: 12, image: dp },
//   { id: 5, name: "Alex Smith", role: "Batsman", number: 5, image: dp },
//   { id: 6, name: "Mike Johnson", role: "Bowler", number: 9, image: dp },
// ];

const ManageTeam = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const coachId = storedUser?.user?.coachId?.id;
 const coachSport=storedUser?.user?.coachId?.sport


  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [createdTeams, setCreatedTeams] = useState([]);
  const [newTeam, setNewTeam] = useState({ name: "", selectedPlayers: [] });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestedPlayers, setRequestedPlayers] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
const [assignedRole, setAssignedRole] = useState('');
const [playerNumber, setPlayerNumber] = useState('');
 const getRoleOptionsBySport = (sport) => {
  switch (sport?.toLowerCase()) {
    case 'cricket':
      return ['Captain', 'Batsman', 'Bowler', 'Wicket Keeper', 'Allrounder'];
    case 'basketball':
      return ['Captain', 'Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center', 'Substitute'];
    case 'football':
      return ['Captain', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Substitute'];
    default:
      return [];
  }
};
  const playerOptions = allPlayers.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const fetchTeams = async () => {
    try {
      const response = await fetch("https://shx-backend.onrender.com/api/teams?populate=*");
      const data = await response.json();
      console.log('teamsss',data);
      const teamsByCoach = data.data.filter(
        (team) => team?.coachid?.id === coachId
      );

      const mappedTeams = teamsByCoach.map((team) => ({
        id: team.id,
        name: team.teamName,
        players: team.players?.map((p) => ({
          id: p.id,
          name: p.name,
          role: p.role,
          sport:p.sport,
          number:p.playerNumber,
          
          image: dp,
        })) || [],
      }));
  console.log('teams',mappedTeams);
  
      setCreatedTeams(mappedTeams);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    }
  };
  const fetchPlayerRequests = async (teamId) => {
    try {
      const response = await fetch(`https://shx-backend.onrender.com/api/teams?populate=*`);
      const result = await response.json();
  
      // Find the team with the matching ID
      const allTeams = result.data;
      const selectedTeam = allTeams.find((team) => team.id === teamId);
    console.log('seleteam',selectedTeam);
    
      if (selectedTeam) {
        const requests = selectedTeam.playerRequests;
        setRequestedPlayers(requests);
        console.log('reqq',requests);
        
      } else {
        console.warn("Team not found with ID:", teamId);
      }
    } catch (error) {
      console.error("Failed to fetch player requests:", error);
    }
  };
  
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(`https://shx-backend.onrender.com/api/players?populate=*&filters[sport][$eq]=${coachSport}&filters[teams][id][$null]=true`);
      const data = await response.json(); // your service function
      const playerOptions = data.data.map((player) => ({
        label: player.name,
        value: player.id
      }));
        setAllPlayers(playerOptions);
      } catch (err) {
        console.error('Failed to fetch players:', err);
      }
    };
  
    if (showCreateTeamModal) {
      fetchPlayers();
    }
  }, [showCreateTeamModal]);


  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateTeam = async () => {
    const payload = {
      teamName: newTeam.name,
      players: newTeam.selectedPlayers, 
      coachId: coachId,
      sport:coachSport
    };
  console.log('ppa',payload);
  
    try {
      const res = await createTeam(payload); // call to your service
      console.log('Team created:', res);
      setShowCreateTeamModal(false);
      window.location.reload(); // or refresh the team list instead of full page reload
    } catch (err) {
      console.error('Failed to create team:', err);
    }
  };
  
  const handleEditPlayer = (player, teamId) => {
    setSelectedPlayer(player);
    setSelectedTeamId(teamId);
    setIsEditModalOpen(true);
  };
  
  
  const closeModal = () => {
    setSelectedPlayer(null);
    setIsEditModalOpen(false);
    setSelectedTeamId(null);
    setShowRequestModal(false);
  };

  const removePlayerFromTeam = async (teamId, playerId) => {
    
      console.log('teamm',teamId,playerId);
       const payload = {
      teamId,
      playerId
    };
  console.log('ppa',payload);
    try {
  const result = await removePlayer(payload);
  console.log(" Team disconnected from player successfully:", result);
   setIsEditModalOpen(false);
   window.location.reload();
} catch (err) {
  console.error("Error removing player:", err);
}

  };
  const handlePlayerRequests = (teamId) => {
    fetchPlayerRequests(teamId);
    setSelectedTeamId(teamId);
    setShowRequestModal(true);
  };

 

  const handleAcceptPlayerRequest = async (playerId, teamId) => {
    console.log('accept', playerId, teamId);
  
    const payload = {
      playerId,
      teamId
    };
  
    try {
      const response = await acceptPlayerRequest(payload);
      console.log('Response:', response);
      setShowRequestModal(false);
      window.location.reload();
      // Do something with response, e.g. refresh UI
    } catch (error) {
      console.error('Failed to accept player request:', error);
    }
  };
  

  const handleRejectPlayerRequest  = async (playerId, teamId) => {
    console.log('reject', playerId, teamId);
  
    const payload = {
      playerId,
      teamId
    };
  
    try {
      const response = await rejectPlayerRequest(payload);
      console.log('Response:', response);
      setShowRequestModal(false);
      // Do something with response, e.g. refresh UI
    } catch (error) {
      console.error('Failed to accept player request:', error);
    }
  };
 
const assignRoleToPlayer = async (playerId, role) => {
  if (!role) {
    alert("Please select a role first.");
    return;
  }
    const payload = {
      role,
      playerId,
      number: parseInt(playerNumber)
    };

  try {
     try {
  const result = await assignRole(payload);
  console.log(" Team disconnected from player successfully:", result);
   setIsEditModalOpen(false);
   window.location.reload();
} catch (err) {
  console.error("Error removing player:", err);
}
  } catch (err) {
    console.error("🔥 Error assigning role:", err);
  }
};

  return (
    <div className="p-5 h-full bg-[#F4F7FE]">
      <CoachStats />

      <div className="mt-6 w-full max-w-7xl mx-auto bg-white p-6 shadow-md rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1B2559]">Manage Teams</h2>
          <button
            className="bg-[#4318FF] text-white px-4 py-2 rounded-lg shadow hover:bg-[#321BB6]"
            onClick={() => setShowCreateTeamModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create New Team
          </button>
        </div>

        {createdTeams.map((team) => (
          <div key={team.id} className="mb-8 border border-gray-300">
            <div className="flex items-center  m-5 mb-3">
  <h3 className="text-xl font-bold text-[#1B2559]">
    {team.name}
  </h3>
  <button
    className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-md transition-all duration-200 ml-10"
    onClick={() => handlePlayerRequests(team.id)}
  >
    Player Requests
  </button>
</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
              {team.players.map((player) => (
                <div
                  key={player.id}
                  className="bg-[#F4F7FE] flex items-center justify-between p-4 rounded-lg shadow-sm"
                >
                  <div className="flex items-center space-x-4 m-3">
                    <img
                      src={player.image}
                      alt={player.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-[#1B2559]">
                        {player.name}
                      </p>
                      <p className="text-sm text-gray-500">{player.sport}</p>
                      <p className="font-semibold text-[#1B2559]">{player.role}</p>
                         <p className="font-semibold text-[#1B2559]">{player.number}</p>
                    </div>
                  </div>
                  <button
                    className="text-sm text-blue-500 hover:underline"
                    onClick={() => handleEditPlayer(player, team.id)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal to create team */}
      {showCreateTeamModal && (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Create New Team</h3>

      <input
        type="text"
        placeholder="Team Name"
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
        value={newTeam.name}
        onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
      />

      <Select
        isMulti
        options={allPlayers}
        className="mb-4"
        placeholder="Select Players"
        onChange={(selected) =>
          setNewTeam({
            ...newTeam,
            selectedPlayers: selected.map((s) => s.value),
          })
        }
      />

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setShowCreateTeamModal(false)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateTeam}
          className="px-4 py-2 bg-[#4318FF] text-white rounded hover:bg-[#321BB6]"
        >
          Save Team
        </button>
      </div>
    </div>
  </div>
)}

     {isEditModalOpen && selectedPlayer && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-96 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Edit Player</h2>

      <div className="flex items-center space-x-4 mb-4">
        <img
          src={selectedPlayer.image}
          alt={selectedPlayer.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{selectedPlayer.name}</p>
          <p className="text-sm text-gray-500">{selectedPlayer.role}</p>
        </div>
      </div>

      {/* Role Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Assign Role</label>
      <select
  value={assignedRole}
  onChange={(e) => setAssignedRole(e.target.value)}
  className="w-full px-4 py-2 border rounded bg-[#F4F7FE]"
>
  <option value="">Select Role</option>
  {getRoleOptionsBySport(coachSport).map((role) => (
    <option key={role} value={role}>
      {role}
    </option>
  ))}
</select>
      </div>
      <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">Player Number</label>
  <input
    type="number"
    value={playerNumber}
    onChange={(e) => setPlayerNumber(e.target.value)}
    className="w-full px-4 py-2 border rounded bg-[#F4F7FE]"
    placeholder="e.g. 10"
  />
</div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={() => assignRoleToPlayer(selectedPlayer.id, assignedRole)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Assign Role
        </button>
        <button
          onClick={() =>
            removePlayerFromTeam(selectedTeamId, selectedPlayer.id)
          }
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Remove from Team
        </button>
      </div>
    </div>
  </div>
)}

      {showRequestModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Player Requests</h3>
              
              <button onClick={closeModal} className="text-red-500 text-xl px-2 py-1 ml-2">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            {requestedPlayers.length === 0 ? (
              <p>No player requests</p>
            ) : (
              <div className="mt-4">
                {requestedPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex justify-between items-center p-3 border-b"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={dp}
                        alt={player.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <p>{player.name}</p>
                    </div>
                    <div className="flex space-x-3">
                    <button
  onClick={() => handleAcceptPlayerRequest(player.id, selectedTeamId)}
  className="text-green-500 text-xl px-2 py-1"
>
  <FontAwesomeIcon icon={faCheck} />
</button>
<button
onClick={() => handleRejectPlayerRequest(player.id, selectedTeamId)}
  className="text-red-500 text-xl px-2 py-1 ml-2"
>
  <FontAwesomeIcon icon={faTimes} />
</button>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTeam;
