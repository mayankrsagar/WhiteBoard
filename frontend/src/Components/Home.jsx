// src/Components/Home.jsx
import React from "react";

import { Link } from "react-router-dom";

import imagePaths from "../assets/img/imagePaths";

const Home = () => (
  <div
    className={`w-screen bg-white text-gray-800 bg-[url(${imagePaths.bg})] bg-cover bg-center bg-no-repeat flex flex-col items-center`}
  >
    {/* ---------- HERO ---------- */}
    <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 lg:gap-16">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            The go-to digital whiteboard for real-time collaboration
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Easily share ideas and collaborate with others — in real-time or
            asynchronously — with a free online whiteboard from Draw.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
            </svg>
            Start a Whiteboard
          </Link>
        </div>

        <div className="flex-1 flex justify-center">
          <img
            src={imagePaths.image1}
            alt="Digital Whiteboard"
            className="w-full max-w-md h-auto"
          />
        </div>
      </div>
    </section>

    {/* ---------- FEATURES ---------- */}
    <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          Easy-to-use functionality designed for seamless team collaboration
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mt-12">
          <FeatureCard
            img={imagePaths.image2}
            title="Infinite & resizable canvas options"
            text="Choose the right canvas for your collaboration goals — flexibility without limits."
          />
          <FeatureCard
            img={imagePaths.image4}
            title="Video meeting integrations"
            text="Seamlessly add visual collaboration to meetings with Microsoft Teams, Webex, and Zoom."
          />
          <FeatureCard
            img={imagePaths.image3}
            title="Easy sharing"
            text="Share your workspace instantly with anyone in the world using our unique URL system."
          />
        </div>
      </div>
    </section>

    {/* ---------- HOW-TO ---------- */}
    <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
          How to get started with online whiteboarding
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 text-center">
          <StepCard
            img={imagePaths.image5}
            step="Step 1: Sign Up"
            text="Create an account to access our online whiteboarding tools."
          />
          <StepCard
            img={imagePaths.image6}
            step="Step 2: Choose a Board"
            text="Select a whiteboard or create a new one to begin collaborating."
          />
          <StepCard
            img={imagePaths.image7}
            step="Step 3: Start Collaborating"
            text="Invite team members and start collaborating in real-time!"
          />
        </div>
      </div>
    </section>

    {/* ---------- CONTACT ---------- */}
    <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 md:mb-8">
          Contact Us
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
    </section>

    {/* ---------- FOOTER ---------- */}
    <Footer />
  </div>
);

/* ---------- sub-components ---------- */
const FeatureCard = ({ img, title, text }) => (
  <div className="flex flex-col items-center space-y-3">
    <img src={img} alt={title} className="h-20 object-contain" />
    <h3 className="text-lg sm:text-xl font-semibold">{title}</h3>
    <p className="text-gray-600 text-sm sm:text-base">{text}</p>
  </div>
);

const StepCard = ({ img, step, text }) => (
  <div className="space-y-3">
    <img src={img} alt={step} className="h-20 mx-auto object-contain" />
    <h3 className="text-lg sm:text-xl font-semibold">{step}</h3>
    <p className="text-gray-600 text-sm sm:text-base">{text}</p>
  </div>
);

const ContactInfo = () => (
  <div className="space-y-2 text-gray-700">
    <p className="font-medium">
      For any inquiries or support, feel free to contact us:
    </p>
    <p>Email: example@example.com</p>
    <p>Phone: +1234567890</p>
    <p>Address: 123 Street, City, Country</p>
  </div>
);

const ContactForm = () => (
  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
    <div>
      <label className="block mb-1 font-medium">Name</label>
      <input
        type="text"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div>
      <label className="block mb-1 font-medium">Email</label>
      <input
        type="email"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div>
      <label className="block mb-1 font-medium">Message</label>
      <textarea
        rows={4}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <button
      type="submit"
      className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
    >
      Submit
    </button>
  </form>
);

const Footer = () => (
  <footer className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div>
        <p className="mb-2">Follow Us</p>
        <div className="flex gap-4">
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <img src={imagePaths.image8} alt="FB" className="h-8" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <img src={imagePaths.image9} alt="TW" className="h-8" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <img src={imagePaths.image10} alt="IG" className="h-8" />
          </a>
        </div>
      </div>
      <div className="text-sm text-right">
        © 2023 YourWebsite. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Home;
