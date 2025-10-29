import React, { useEffect, useRef, useState } from "react";

// eslint-disable-next-line no-unused-vars
const Sidebar = ({ users = [], user = {}, socket }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const panelRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      // focus search when panel opens
      setTimeout(() => searchRef.current?.focus(), 120);
      // trap focus inside panel (simple)
      const prev = document.activeElement;
      return () => prev?.focus?.();
    }
  }, [open]);

  const close = () => setOpen(false);

  const getInitials = (name = "?") =>
    name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const bgFromId = (id = "") => {
    // deterministic pastel color from id
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h << 5) - h + id.charCodeAt(i);
    const hue = Math.abs(h) % 360;
    return `hsl(${hue} 60% 65%)`;
  };

  const filtered = users.filter((u) =>
    `${u.username || ""}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* trigger button - keep it easy to find and keyboard accessible */}
      <button
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="sidebar-panel"
        title="Open user list"
        className="fixed bottom-6 right-6 z-[1000] px-4 py-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-2xl focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:scale-110 focus:shadow-[0_0_0.75rem_rgba(99,102,241,0.6)] transition-all duration-200 ease-out text-2xl md:text-3xl"
      >
        Users
      </button>

      {/* backdrop */}
      {open && (
        <div
          onClick={close}
          aria-hidden
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* sliding panel */}
      <aside
        id="sidebar-panel"
        ref={panelRef}
        className={`fixed top-0 left-0 h-full w-full sm:w-96 bg-white text-gray-900 z-50 transform transition-transform duration-300 shadow-xl flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Online Users</h2>
            <p className="text-sm text-gray-500">{users.length} connected</p>
          </div>

          <div className="flex items-center gap-2">
            {/* <button
              onClick={() => {
                navigator.clipboard?.writeText(socket?.id || "");
                // tiny feedback (non-blocking)
                // eslint-disable-next-line no-console
                console.log("copied id", socket?.id);
              }}
              title="Copy your socket id"
              className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Copy ID
            </button> */}

            <button
              onClick={close}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
              aria-label="Close user list"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4 border-b">
          <label className="sr-only" htmlFor="user-search">
            Search users
          </label>
          <div className="relative">
            <input
              ref={searchRef}
              id="user-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users... (Ctrl/Cmd+K)"
              className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <nav className="p-2 overflow-auto flex-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No users found
            </div>
          ) : (
            <ul className="space-y-2">
              {filtered.map((usr) => (
                <li key={usr.id}>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                    <div
                      className="flex items-center justify-center rounded-full w-10 h-10 flex-shrink-0 text-white font-semibold"
                      style={{ background: bgFromId(usr.id) }}
                    >
                      {getInitials(usr.username)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">
                          {usr.username}
                        </span>
                        {usr.id === socket.id && (
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {usr.status || "Online"}
                      </div>
                    </div>

                    <div className="text-right text-xs text-gray-400">
                      <div>{/* optionally show last active or role */}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </nav>

        <div className="p-4 border-t text-sm text-gray-600">
          Tip: Press <kbd className="px-2 py-0.5 bg-gray-100 rounded">Ctrl</kbd>
          /<kbd className="px-2 py-0.5 bg-gray-100 rounded">Cmd</kbd>+
          <kbd className="px-2 py-0.5 bg-gray-100 rounded">K</kbd> to open the
          list
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
