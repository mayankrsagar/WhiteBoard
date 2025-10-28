import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import User from "../models/User.js";

// __dirname workaround for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function getUserImages(req, res, next) {
  try {
    const user = await User.findById(req.params.userId).select("images");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ images: user.images });
  } catch (err) {
    next(err);
  }
}

export async function deleteImage(req, res, next) {
  try {
    const { filename, userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const idx = user.images.indexOf(filename);
    if (idx === -1) {
      return res.status(404).json({ error: "Image not found" });
    }

    user.images.splice(idx, 1);
    await user.save();

    fs.unlink(join(__dirname, "..", "img", filename), (err) => {
      if (err) console.error(err);
    });

    res.json({ message: "Image deleted" });
  } catch (err) {
    next(err);
  }
}
