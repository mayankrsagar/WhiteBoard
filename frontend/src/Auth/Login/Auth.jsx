// src/Auth/Login/Login.jsx
import React, { useState } from "react";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) =>
    setData({ ...data, [input.name]: input.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await axios.post(
        "http://localhost:5000/api/auth",
        data
      );
      localStorage.setItem("token", res.data);
      navigate("/Dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl flex w-full max-w-4xl">
        {/* LEFT – form */}
        <div className="w-full md:w-1/2 p-10 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={data.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={data.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {error && <div className="text-sm text-red-600">{error}</div>}

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* RIGHT – CTA */}
        <div className="w-full md:w-1/2 bg-indigo-600 text-white rounded-r-2xl flex flex-col items-center justify-center p-10">
          <h2 className="text-3xl font-bold mb-4">New Here?</h2>
          <Link
            to="/register"
            className="border-2 border-white px-8 py-2 rounded-full hover:bg-white hover:text-indigo-600 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
