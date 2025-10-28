// Login.jsx
import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import api from "../../../utils/axios";

/* ---------- helpers ---------- */
const Input = ({ type = "text", ...props }) => (
  <input
    type={type}
    {...props}
    className="mt-1 block w-full rounded-xl bg-white/90 px-4 py-3
               font-mono text-slate-800 placeholder-slate-500
               border-2 border-dashed border-slate-400
               focus:outline-none focus:border-indigo-500 focus:bg-white
               transition"
  />
);

const Button = ({ children, disabled, ...props }) => (
  <button
    disabled={disabled}
    {...props}
    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl
               bg-indigo-600 text-white font-bold tracking-wide
               hover:bg-indigo-500 active:bg-indigo-700
               disabled:opacity-60 disabled:cursor-wait
               shadow-lg shadow-indigo-600/30
               transition"
  >
    {children}
  </button>
);

/* ---------- main ---------- */
export default function Login({ setLoggedIn, setUserId }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("auth/login", {
        email,
        password,
      });
      setLoggedIn(true);
      setUserId(data.userId);
      localStorage.setItem("userId", data.userId);
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userId_expires", expiresAt.toString());
      if (data.token) localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Can't sign in — check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* invisible global styles */}
      <style>{`
        @keyframes doodle {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          100% {
            transform: translate(-100%, -100%) rotate(360deg);
          }
        }
        .doodle {
          position: absolute;
          width: 200%;
          height: 200%;
          top: 0;
          left: 0;
          background: url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h80v80h-80z' fill='none' stroke='%23ffffff22' stroke-width='2'/%3E%3C/svg%3E");
          animation: doodle 60s linear infinite;
          pointer-events: none;
        }
      `}</style>

      <main
        className="min-h-screen grid place-items-center p-4 relative overflow-hidden
                       bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50"
      >
        {/* animated grid overlay */}
        <div className="doodle" />

        {/* subtle marker strokes */}
        <svg
          className="absolute top-10 left-10 w-48 h-48 opacity-20 rotate-12"
          viewBox="0 0 200 200"
        >
          <path
            d="M20 100 C 40 30, 120 30, 180 100"
            stroke="#10b981"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <svg
          className="absolute bottom-10 right-10 w-56 h-56 opacity-15 -rotate-6"
          viewBox="0 0 200 200"
        >
          <path
            d="M10 80 Q 100 20 190 80"
            stroke="#6366f1"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        {/* login card */}
        <section
          className="relative w-full max-w-md
                           bg-yellow-100 border-2 border-yellow-300/60
                           rounded-2xl shadow-2xl shadow-yellow-900/10
                           p-6 sm:p-8 rotate-[-1deg] hover:rotate-0 transition-transform duration-300"
        >
          {/* push-pin */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2
                          w-6 h-6 rounded-full bg-gradient-to-b from-red-500 to-red-600 shadow-md"
          />
          <h1
            className="text-3xl font-black text-slate-800 text-center mb-1
                         underline decoration-wavy decoration-indigo-500"
          >
            Whiteboard
          </h1>
          <p className="text-center text-slate-600 mb-6">
            Sign in to start drawing
          </p>

          {error && (
            <div
              role="alert"
              className="mb-4 text-sm text-red-700 bg-red-200/70 px-4 py-2 rounded-lg"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Email</span>
              <Input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">Password</span>
              <div className="relative mt-1">
                <Input
                  type={show ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-slate-800"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <Button disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            New here?
            <Link
              to="/register"
              className="ml-1 text-indigo-600 font-bold hover:underline"
            >
              Create an account
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
