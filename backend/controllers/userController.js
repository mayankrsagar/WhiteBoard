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
