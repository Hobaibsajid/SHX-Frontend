import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import OrganizerDashboard from "./modules/organizer/OrganizerDashboard";
import ManageCoaches from "./modules/organizer/ManageCoaches.jsx";
import ScheduleMatch from "./modules/organizer/ScheduleMatch";
import GameScore from "./modules/organizer/GameScore";
import CoachDashboard from "./modules/coach/CoachDashboard.jsx";
import ManageTeam from "./modules/coach/ManageTeam"; //
import CoachSchedule from "./modules/coach/CoachSchedule"; //
import CoachChat from "./modules/coach/CoachChat"; //
import PlayerDashboard from "./modules/player/PlayerDashboard.jsx";
import PlayerTeam from "./modules/player/PlayerTeam"; 
import JoinTeam from "./modules/player/joinTeam.jsx"; 
import PlayerSchedule from "./modules/player/PlayerSchedule"; //
import PlayerChat from "./modules/player/PlayerChat"; //
import Login from "./pages/Login";
import Signup from "./pages/Signup.jsx";
import {
  faTableColumns,
  faChartBar,
  faCalendarAlt,
  faBaseballBall,
  faUsers,
  faComments,
} from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ✅ Sidebar menu items for Organizer & Coach
  const sidebarMenus = {
    organizer: [
      { name: "Overview", icon: faTableColumns, path: "/organizer/dashboard" },
      { name: "Manage Coaches", icon: faChartBar, path: "/organizer/managecoaches" },
      { name: "Schedule Match", icon: faCalendarAlt, path: "/organizer/schedule" },
      { name: "Game Score", icon: faBaseballBall, path: "/organizer/score" },
    ],
    coach: [
      { name: "Overview", icon: faTableColumns, path: "/coach/dashboard" },
      { name: "Manage Team", icon: faUsers, path: "/coach/manage-team" },
      { name: "Match Schedule", icon: faCalendarAlt, path: "/coach/schedule" },
      // { name: "Chat", icon: faComments, path: "/coach/chat" },
    ],
    player: [
      { name: "Overview", icon: faTableColumns, path: "/player/dashboard" },
      { name: "Join Team", icon: faTableColumns, path: "/player/joinTeam" },
      { name: "Team Members", icon: faUsers, path: "/player/team-members" },
      { name: "Match Schedule", icon: faCalendarAlt, path: "/player/schedule" },
      // { name: "Chat", icon: faComments, path: "/player/chat" },
    ],
  };
  

  return (
    <Routes>
      {/* ✅ Login & Signup Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ✅ Organizer Dashboard Routes */}
      <Route
        path="/organizer/dashboard"
        element={
          <div className="flex bg-gray-100 h-screen">
            <Sidebar menuItems={sidebarMenus.organizer} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 transition-all duration-300 ease-in-out">
              <Navbar dashboardType="Organizer" currentPage="Overview" setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
              <OrganizerDashboard />
            </div>
          </div>
        }
      />
      <Route
        path="/organizer/managecoaches"
        element={
          <div className="flex bg-gray-100 h-screen">
            <Sidebar menuItems={sidebarMenus.organizer} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 transition-all duration-300 ease-in-out">
              <Navbar dashboardType="Organizer" currentPage="Manage Coaches" setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
              <ManageCoaches />
            </div>
          </div>
        }
      />
      <Route
        path="/organizer/schedule"
        element={
          <div className="flex bg-gray-100 h-screen">
            <Sidebar menuItems={sidebarMenus.organizer} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 transition-all duration-300 ease-in-out">
              <Navbar dashboardType="Organizer" currentPage="Schedule Match" setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
              <ScheduleMatch />
            </div>
          </div>
        }
      />
      <Route
        path="/organizer/score"
        element={
          <div className="flex bg-gray-100 h-screen">
            <Sidebar menuItems={sidebarMenus.organizer} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 transition-all duration-300 ease-in-out">
              <Navbar dashboardType="Organizer" currentPage="Game Score" setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
              <GameScore />
            </div>
          </div>
        }
      />

      {/* ✅ Coach Dashboard Routes */}
      <Route
        path="/coach/dashboard"
        element={
          <div className="flex bg-gray-100 h-screen">
            <Sidebar menuItems={sidebarMenus.coach} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 transition-all duration-300 ease-in-out">
              <Navbar dashboardType="Coach" currentPage="Overview" setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
              <CoachDashboard />
            </div>
          </div>
        }
      />
      <Route
        path="/coach/manage-team"
        element={
          <div className="flex bg-gray-100 h-screen">
            <Sidebar menuItems={sidebarMenus.coach} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 transition-all duration-300 ease-in-out">
              <Navbar dashboardType="Coach" currentPage="Manage Team" setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
              <ManageTeam />
            </div>
          </div>
        }
      />
      <Route
        path="/coach/schedule"
        element={
          <div className="flex bg-gray-100 h-screen">
            <Sidebar menuItems={sidebarMenus.coach} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 transition-all duration-300 ease-in-out">
              <Navbar dashboardType="Coach" currentPage="Schedule" setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
              <CoachSchedule />
            </div>
          </div>
        }
      />
      <Route
        path="/coach/chat"
        element={
          <div className="flex bg-gray-100 h-screen">
            <Sidebar menuItems={sidebarMenus.coach} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 transition-all duration-300 ease-in-out">
              <Navbar dashboardType="Coach" currentPage="Chat" setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
              <CoachChat />
            </div>
          </div>
        }
      />

      {/* ✅ Player Dashboard Routes */}
  <Route
    path="/player/dashboard"
    element={
      <div className="flex bg-gray-100 h-screen">
        <Sidebar menuItems={sidebarMenus.player} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 transition-all duration-300 ease-in-out">
          <Navbar dashboardType="Player" currentPage="Overview" setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
          <PlayerDashboard />
        </div>
      </div>
    }
  />
    <Route
    path="/player/joinTeam"
    element={
      <div className="flex bg-gray-100 h-screen">
        <Sidebar menuItems={sidebarMenus.player} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 transition-all duration-300 ease-in-out">
          <Navbar dashboardType="Player" currentPage="Join Team" setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
          <JoinTeam />
        </div>
      </div>
    }
  />
  <Route
    path="/player/team-members"
    element={
      <div className="flex bg-gray-100 h-screen">
        <Sidebar menuItems={sidebarMenus.player} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 transition-all duration-300 ease-in-out">
          <Navbar dashboardType="Player" currentPage="Team Members" setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
          <PlayerTeam />
        </div>
      </div>
    }
  />
  <Route
    path="/player/schedule"
    element={
      <div className="flex bg-gray-100 h-screen">
        <Sidebar menuItems={sidebarMenus.player} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 transition-all duration-300 ease-in-out">
          <Navbar dashboardType="Player" currentPage="Schedule" setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
          <PlayerSchedule /> {/* ✅ Reusing Coach Schedule as Player Schedule */}
        </div>
      </div>
    }
  />
  <Route
    path="/player/chat"
    element={
      <div className="flex bg-gray-100 h-screen">
        <Sidebar menuItems={sidebarMenus.player} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 transition-all duration-300 ease-in-out">
          <Navbar dashboardType="Player" currentPage="Chat" setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
          <CoachChat /> {/* ✅ Reusing Coach Chat as Player Chat */}
        </div>
      </div>
    }
  />
    </Routes>
  );
};

export default App;
