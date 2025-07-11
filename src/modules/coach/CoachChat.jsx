import React, { useState } from "react";
import pic from "../../assets/images/Base.png"
import dp from "../../assets/images/dp.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPaperPlane, faPlus, faFile } from "@fortawesome/free-solid-svg-icons";

const CoachChat = () => {
  // Dummy Chat Data
  const [messages, setMessages] = useState([
    { id: 1, sender: "Shahmeer", text: "Thank you for always being so positive!", type: "text", time: "11:02 AM" },
    { id: 2, sender: "Shahmeer", text: "I will push Krystal to give us a few more days. That shouldn't be a problem.", type: "text", time: "11:02 AM" },
    { id: 3, sender: "Shahmeer", text: "/chat-image.jpg", type: "image", time: "11:02 AM" },
    { id: 4, sender: "You", text: "I will push Krystal to give us a few more days. That shouldn't be a problem.", type: "text", time: "11:02 AM" },
    { id: 5, sender: "You", text: "/document.pdf", type: "file", time: "11:02 AM" },
  ]);

  // Dummy Contacts
  const contacts = [
    { id: 1, name: "Shahmeer", lastMessage: "You: Thanks! Have a nice weekend", time: "1:28 AM", avatar: dp },
    { id: 2, name: "1-251-245-4567", lastMessage: "You: Thanks! Have a nice weekend", time: "1:28 AM", avatar: dp },
    { id: 3, name: "Serena Ribeiro", lastMessage: "No, I think there are other alternatives...", time: "1:28 AM", avatar: dp },
    { id: 4, name: "Hasnain Ur Rehman", lastMessage: "I haven't checked available times yet", time: "1:28 AM", avatar: dp },
    { id: 5, name: "Tabark Matloob", lastMessage: "Good Job!", time: "1:28 AM", avatar: dp },
  ];

  // Send Message Function
  const [newMessage, setNewMessage] = useState("");
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    setMessages([...messages, { id: messages.length + 1, sender: "You", text: newMessage, type: "text", time: "Now" }]);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen p-5 bg-[#F4F7FE]">
      {/* Sidebar (Moved Left) */}
      <div className="w-1/3 md:w-1/4 bg-[#ECF1F6] shadow-md rounded-xl mr-5 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Hobaib Sajid</h2>
          <FontAwesomeIcon icon={faPlus} className="text-gray-500 cursor-pointer" />
        </div>

        {/* Search */}
        <div className="p-3 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 rounded-md bg-white focus:ring-2 focus:ring-[#4318FF] outline-none"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-2 text-gray-400" />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200 transition">
              <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full mr-3" />
              <div className="flex-1">
                <p className="font-semibold">{contact.name}</p>
                <p className="text-sm text-gray-500">{contact.lastMessage}</p>
              </div>
              <p className="text-xs text-gray-400">{contact.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window (Moved Right) */}
      <div className="flex-1 flex flex-col bg-[#F4F7FE] shadow-md rounded-xl p-5">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-lg font-semibold">Shahmeer</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"} mb-3`}>
              <div className={`p-3 rounded-lg max-w-xs ${msg.sender === "You" ? "bg-[#E0E7FF]" : "bg-white"}`}>
                {msg.type === "text" && <p>{msg.text}</p>}
                {msg.type === "image" && <img src={pic} alt="Sent Image" className="rounded-lg w-40 h-40 object-cover" />}
                {msg.type === "file" && (
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faFile} className="text-red-500" />
                    <p className="text-sm">{msg.text}</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-white flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full px-4 py-2 rounded-md border bg-gray-100 focus:ring-2 focus:ring-[#4318FF] outline-none"
          />
          <button onClick={handleSendMessage} className="ml-3 p-2 bg-[#4318FF] text-white rounded-md hover:bg-[#321BB6]">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoachChat;
