// src/components/Sidebar.jsx
import React, { useState } from "react";

// eslint-disable-next-line no-unused-vars
const Sidebar = ({ users, user, socket }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="absolute top-1/4 left-4 z-40 px-3 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
      >
        Users
      </button>

      {/* backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* sliding panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="font-semibold">Online Users</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <nav className="p-4 space-y-3">
          {users.map((usr) => (
            <div
              key={usr.id}
              className={`px-3 py-2 rounded-lg ${
                usr.id === socket.id ? "bg-indigo-600" : "bg-gray-800"
              }`}
            >
              {usr.username}
              {usr.id === socket.id && " (You)"}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
