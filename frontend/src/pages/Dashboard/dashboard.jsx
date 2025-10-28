import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import api from "../../../utils/axios";
import imagePaths from "../../assets/img/imagePaths";

export default function Dashboard() {
  // eslint-disable-next-line no-unused-vars
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [images, setImages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(0);

  const heroImages = [
    imagePaths.image11,
    imagePaths.image12,
    imagePaths.image13,
  ];

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchUserImages = async () => {
      try {
        const response = await api.get(`/images`);
        setImages(response.data.images || []);
      } catch (error) {
        console.error("Error fetching images:", error);
        setImages([]);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`users/profile`);
        setUsername(response.data.user.username || "");
        setEmail(response.data.email || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
        setUsername("");
        setEmail("");
      }
    };

    fetchUserImages();
    fetchUserProfile();
  }, [userId]);

  const deleteImage = async (filename) => {
    try {
      await api.delete(`/images/${filename}`);
      const response = await api.get(`/images`);
      setImages(response.data.images || []);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserId("");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.clear();
    window.location.reload();
  };

  // carousel controls
  const prevSlide = () =>
    setCarouselIndex((i) => (i - 1 + heroImages.length) % heroImages.length);
  const nextSlide = () => setCarouselIndex((i) => (i + 1) % heroImages.length);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:px-8 bg-white shadow">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring"
          >
            {/* hamburger */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex sm:items-center sm:gap-3">
            <div className="text-sm font-medium">{username || "Guest"}</div>
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar (slide-over) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!sidebarOpen}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1z" />
            </svg>
            <Link to="/profile" className="block">
              <div className="font-semibold text-base text-blue-600 hover:underline">
                Profile
              </div>
              <div className="text-xs text-gray-500">View your account</div>
            </Link>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <span className="sr-only">Close panel</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <div className="text-sm font-bold">{username || "—"}</div>
            <div className="text-xs text-gray-500">{email || "—"}</div>
          </div>

          <nav className="space-y-2">
            <a
              href="/main"
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              Create Room
            </a>

            <a
              href="/main"
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8.447.276a.5.5 0 0 0-.894 0L7.19 1H2.5A1.5 1.5 0 0 0 1 2.5V10h14V2.5A1.5 1.5 0 0 0 13.5 1H8.809L8.447.276Z" />
                <path
                  fillRule="evenodd"
                  d="M.5 11a.5.5 0 0 0 0 1h2.86l-.845 3.379a.5.5 0 0 0 .97.242L3.89 14h8.22l.405 1.621a.5.5 0 0 0 .97-.242L12.64 12h2.86a.5.5 0 0 0 0-1H.5Zm3.64 2 .25-1h7.22l.25 1H4.14Z"
                />
              </svg>
              Whiteboard
            </a>

            <button
              onClick={handleLogout}
              className="w-full text-left p-2 rounded hover:bg-gray-100"
            >
              Log out
            </button>
          </nav>
        </div>
      </aside>

      {/* Overlay when sidebar is open (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Hero carousel */}
        <section className="relative rounded-lg overflow-hidden shadow-md">
          <img
            src={heroImages[carouselIndex]}
            alt={`Hero ${carouselIndex + 1}`}
            className="object-cover w-full h-[60vh] md:h-[70vh]"
          />

          <div className="absolute inset-0 flex items-center justify-between px-3 md:px-6">
            <button
              onClick={prevSlide}
              aria-label="Previous"
              className="p-2 bg-white/70 rounded-full hover:bg-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              aria-label="Next"
              className="p-2 bg-white/70 rounded-full hover:bg-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </button>
          </div>

          {/* indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselIndex(i)}
                className={`w-3 h-3 rounded-full ${
                  i === carouselIndex ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Creations */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Creations</h2>

          {images.length === 0 ? (
            <div className="text-gray-500">
              You don't have any creations yet.
            </div>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 list-none p-0">
              {images.map((image, index) => (
                <li
                  key={index}
                  className="relative rounded overflow-hidden shadow-sm bg-white"
                >
                  <img
                    src={`http://localhost:5000/img/${image}`}
                    alt={`creation-${index}`}
                    className="w-full h-48 object-cover"
                  />

                  <button
                    onClick={() => deleteImage(image)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-red-600 text-white shadow hover:bg-red-700 focus:outline-none"
                    aria-label={`Delete ${image}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
