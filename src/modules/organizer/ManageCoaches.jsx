import React, { useState, useEffect } from "react";
import OrganizerStats from "../../components/Common/OrganizerStats";
import dp from "../../assets/images/dp.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faExclamationCircle,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { updateCoachStatus } from "../../../services/Organizer";

const ManageCoaches = () => {
  const tabs = ["Cricket", "Basketball", "Football",];
  const statusTabs = ["Pending", "Approved", "Rejected"];

  const [activeTab, setActiveTab] = useState("Cricket");
  const [activeStatusTab, setActiveStatusTab] = useState("Pending");
  const [selectedCategory, setSelectedCategory] = useState("Cricket");

  const [coaches, setCoaches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await fetch("http://localhost:1337/api/coaches");
        const result = await response.json();
        setCoaches(result.data);
      } catch (error) {
        console.error("Error fetching coaches:", error);
      }
    };

    fetchCoaches();
  }, []);

  const openModal = (coach) => {
    setSelectedCoach(coach);
    setShowModal(true);
  };

  const handleCoachStatusUpdate = async (status) => {
    try {
      await updateCoachStatus({
        coachId: selectedCoach.id,
        coachStatus: status,
      });

      setCoaches((prev) =>
        prev.map((coach) =>
          coach.id === selectedCoach.id ? { ...coach, coachStatus: status } : coach
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // Filter coaches by sport and status
  const filteredCoaches = coaches.filter(
    (coach) =>
      coach.sport?.toLowerCase() === activeTab.toLowerCase() &&
      coach.coachStatus?.toLowerCase() === activeStatusTab.toLowerCase()
  );

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

      {/* Coaches List Header */}
      <div className="mt-6 w-full max-w-7xl mx-auto bg-white p-6 shadow-md rounded-xl">
  <div className="mb-4">
  <h2 className="text-2xl font-bold text-[#1B2559] mb-4">{activeTab} Coaches List</h2>


    {/* Status Tabs Moved Below Title & Made Bigger */}
    <div className="flex gap-4">
      {statusTabs.map((status) => (
        <button
          key={status}
          className={`px-6 py-2 rounded-full text-base font-semibold transition ${
            activeStatusTab === status
              ? "bg-[#4318FF] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setActiveStatusTab(status)}
        >
          {status}
        </button>
      ))}
    </div>
  

        </div>

        {/* Coaches Table */}
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-gray-500 text-sm">
                <th className="py-3 px-5 text-left">Coach</th>
                <th className="py-3 px-5 text-left">Status</th>
                <th className="py-3 px-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoaches.map((coach) => (
                <tr
                  key={coach.id}
                  className="bg-[#F4F7FE] text-[#1B2559] rounded-3xl"
                >
                  {/* Coach Info */}
                  <td className="py-4 px-5 flex items-center space-x-4 rounded-l-xl">
                    <img
                      src={dp}
                      alt={coach.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{coach.fullName}</p>
                      <p className="text-sm text-gray-500">{coach.sport}</p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-5 items-center space-x-3">
                    {coach.coachStatus === "pending" && (
                      <span className="text-yellow-500">
                        <FontAwesomeIcon icon={faExclamationCircle} />
                      </span>
                    )}
                    {coach.coachStatus === "approved" && (
                      <span className="text-green-500">
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </span>
                    )}
                    {coach.coachStatus === "rejected" && (
                      <span className="text-red-500">
                        <FontAwesomeIcon icon={faTimesCircle} />
                      </span>
                    )}
                    <span className="font-medium capitalize ml-2">
                      {coach.coachStatus}
                    </span>
                  </td>

                  {/* Action Button */}
                  <td className="py-4 px-5 text-center rounded-r-xl">
                    <button
                      className="text-gray-500 hover:text-gray-700 transition"
                      onClick={() => openModal(coach)}
                    >
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCoaches.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center text-gray-500 py-6 font-medium"
                  >
                    No coaches found for this category and status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedCoach && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-6 rounded-xl shadow-lg w-[350px] text-center">
            <button
              className="absolute top-3 right-3 text-red-500 hover:text-black text-xl font-bold"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>

            <div className="flex flex-col items-center">
              <img
                src={dp}
                alt={selectedCoach.fullName}
                className="w-16 h-16 rounded-full mb-3"
              />
              <h3 className="text-lg font-bold text-[#1B2559]">
                {selectedCoach.fullName}
              </h3>
              <p className="text-sm text-gray-500">{selectedCoach.sport}</p>
              <p className="text-gray-500 text-sm mt-3 px-4">
                {selectedCoach.fullName} registered as a{" "}
                {selectedCoach.sport} coach. Do you approve their request?
              </p>
            </div>

            <div className="flex justify-between mt-4 space-x-4">
              <button
                className="px-4 py-2 bg-[#4318FF] text-white rounded-lg hover:bg-[#321BB6] transition w-1/2"
                onClick={() => handleCoachStatusUpdate("approved")}
              >
                Accept
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-1/2"
                onClick={() => handleCoachStatusUpdate("rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoaches;
