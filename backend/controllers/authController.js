import jwt from "jsonwebtoken";

import User from "../models/User.js";

export async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    res.json({ message: "User registered successfully", userId: user._id });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ✅ Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    // ✅ Set cookie
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ← remove the “v”
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful", userId: user._id });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  await res.clearCookie("token").json({ message: "Logout successful" });
}
