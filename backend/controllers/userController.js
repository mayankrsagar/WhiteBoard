import User from "../models/User.js";

export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.params.userId).select(
      "username email"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}
