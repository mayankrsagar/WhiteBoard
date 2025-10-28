import User from "../models/User.js";

export async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.images.push(req.file.filename);
    await user.save();

    res.json({ status: "ok", data: req.file });
  } catch (err) {
    next(err);
  }
}
