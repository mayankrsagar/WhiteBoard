// src/pages/Room/JoinCreateRoom.jsx
import React, { useState } from "react";

const JoinCreateRoom = ({ uuid, setUser, setRoomJoined }) => {
  const [roomId, setRoomId] = useState(uuid());
  const [name, setName] = useState("");
  const [joinName, setJoinName] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!name) return alert("Please enter your name!");
    setUser({
      roomId,
      userId: uuid(),
      userName: name,
      host: true,
      presenter: true,
    });
    setRoomJoined(true);
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!joinName) return alert("Please enter your name!");
    setUser({
      roomId: joinRoomId,
      userId: uuid(),
      userName: joinName,
      host: false,
      presenter: false,
    });
    setRoomJoined(true);
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-gray-900 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
        {/* ---------- CREATE ROOM ---------- */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-5">
          <h2 className="text-2xl font-bold text-center">Create Room</h2>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={roomId}
                readOnly
                className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-white/80"
              />
              <button
                type="button"
                onClick={() => setRoomId(uuid())}
                className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
              >
                Generate
              </button>
              <button
                type="button"
                onClick={copyRoomId}
                className="px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
            >
              Create Room
            </button>
          </form>
        </div>

        {/* ---------- JOIN ROOM ---------- */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-5">
          <h2 className="text-2xl font-bold text-center">Join Room</h2>
          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              required
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="text"
              placeholder="Room ID"
              required
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
            >
              Join Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateRoom;
