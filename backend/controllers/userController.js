import fs from "fs";
import { join } from "path";

import User from "../models/User.js";

// export async function getProfile(req, res, next) {
//   try {
//     const user = await User.findById(req.params.userId).select(
//       "username email"
//     );
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.json(user);
//   } catch (err) {
//     next(err);
//   }
// }

// controllers/userController.js
export async function getProfile(req, res, next) {
  try {
    // req.user is set by your JWT/session middleware
    const user = await User.findById(req.user.id || req.User._id).select(
      "-password"
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export const updateProfile = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.username = username || user.username;
    await user.save();
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file sent" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    /* optional: delete old avatar from disk */
    if (user.avatar) {
      const oldPath = join("img", user.avatar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    user.avatar = req.file.filename;
    await user.save();

    const url = `http://localhost:5000/img/${req.file.filename}`;
    res.json({ status: "ok", url });
  } catch (err) {
    next(err);
  }
};
