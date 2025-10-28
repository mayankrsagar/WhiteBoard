// src/components/Navbar.jsx
import React from "react";

import { Link } from "react-router-dom";

const Navbar = ({ loggedIn, userId, mobileOpen, setMobileOpen, onLogout }) => {
  /* -------------  LINK DATA  ------------- */
  const publicLinks = [
    { label: "Home", to: "/" },
    { label: "Features", to: "/" },
    { label: "Login / Register", to: "/login" },
  ];

  const privateLinks = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Rooms", to: "/main" },
  ];

  /* -------------  USER PILL  ------------- */
  const UserPill = ({ mobile }) => (
    <div
      className={`flex items-center gap-2 rounded-full bg-gray-800 text-white ${
        mobile ? "px-3 py-2 text-base" : "px-3 py-1 text-sm"
      }`}
    >
      <span className={mobile ? "" : "hidden sm:inline"}>
        {userId.slice(-6)}
      </span>
      <div className="w-6 h-6 rounded-full bg-indigo-500 grid place-items-center font-bold text-xs uppercase">
        {userId.slice(-1)}
      </div>
    </div>
  );

  /* -------------  COMMON LINK RENDER  ------------- */
  const renderLinks = (links, mobile) =>
    links.map((l) => (
      <Link
        key={l.label}
        to={l.to}
        onClick={mobile ? () => setMobileOpen(false) : undefined}
        className={`block px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition ${
          mobile ? "text-base" : "text-sm"
        }`}
      >
        {l.label}
      </Link>
    ));

  /* -------------  JSX  ------------- */
  return (
    <nav className="bg-red-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-wide hover:text-indigo-400 transition md:text-3xl"
          >
            Whiteboard
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-end">
            {loggedIn ? (
              <>
                {renderLinks(privateLinks)}
                <UserPill />
                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>{renderLinks(publicLinks)}</>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="text-white hover:text-indigo-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-3 space-y-2">
            {loggedIn ? (
              <>
                {renderLinks(privateLinks, true)}
                <div className="px-4">
                  <UserPill mobile />
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-md text-base font-medium hover:bg-gray-800 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>{renderLinks(publicLinks, true)}</>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
