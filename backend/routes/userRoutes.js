import express from "express";

import {
  getProfile,
  updateProfile,
  uploadAvatar,
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// router.get("/profile/:userId", auth, getProfile);
// routes/userRoutes.js  (or wherever your user routes live)
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
// router.post("/update-avatar", auth, updateAvatar);
router.post("/avatar", auth, upload.single("avatar"), uploadAvatar);
export default router;
