// src/pages/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../../utils/axios";
import imagePaths from "../../assets/img/imagePaths";

/* ----------  main component  ---------- */
export default function Dashboard() {
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

  /* ----------  data fetch  ---------- */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/users/profile");
        setUsername(data.user.username);
        setEmail(data.user.email);
        setImages(data.user.images || []);
      } catch {
        toast.error("Could not load dashboard");
      }
    })();
  }, []);

  /* ----------  delete image  ---------- */
  const deleteImage = async (filename) => {
    try {
      await api.delete(`/images/${filename}`);
      setImages((prev) => prev.filter((f) => f !== filename));
      toast.success("Image removed");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ----------  carousel helpers  ---------- */
  const prevSlide = () =>
    setCarouselIndex((i) => (i - 1 + heroImages.length) % heroImages.length);
  const nextSlide = () => setCarouselIndex((i) => (i + 1) % heroImages.length);

  /* ----------  icons  ---------- */
  const IconMenu = (props) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
    </svg>
  );
  const IconClose = (props) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
    </svg>
  );
  const IconChevronLeft = (props) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
    </svg>
  );
  const IconChevronRight = (props) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
    </svg>
  );
  const IconTrash = (props) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6zM14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ----------  TOP BAR  ---------- */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white shadow md:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="p-2 rounded hover:bg-gray-100"
          >
            <IconMenu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm font-medium">
            {username || "—"}
          </span>
          <Link
            to="/logout"
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Log out
          </Link>
        </div>
      </header>

      {/* ----------  SIDEBAR  ---------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-white shadow-xl transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <div>
            <div className="font-semibold">{username}</div>
            <div className="text-xs text-gray-500">{email}</div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded hover:bg-gray-100"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            to="/main"
            className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
          >
            <span>Create Room</span>
          </Link>
          <Link
            to="/main"
            className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
          >
            <span>Whiteboard</span>
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
          >
            <span>Profile</span>
          </Link>
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ----------  MAIN CONTENT  ---------- */}
      <main className="px-4 py-6 md:px-8">
        {/* hero carousel */}
        <section className="relative w-full h-[60vh] md:h-[70vh] rounded-xl overflow-hidden shadow-lg">
          <img
            src={heroImages[carouselIndex]}
            alt=""
            className="w-full h-full object-cover"
          />

          <button
            onClick={prevSlide}
            aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/70 rounded-full hover:bg-white"
          >
            <IconChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/70 rounded-full hover:bg-white"
          >
            <IconChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselIndex(i)}
                className={`w-3 h-3 rounded-full ${
                  i === carouselIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </section>

        {/* creations grid */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Creations</h2>
          {images.length === 0 ? (
            <p className="text-gray-600">You don't have any creations yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((file) => (
                <div
                  key={file}
                  className="relative group rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                >
                  <img
                    src={`http://localhost:5000/img/${file}`}
                    alt={file}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => deleteImage(file)}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    aria-label={`Delete ${file}`}
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
