import express from "express";

import auth from "../middleware/auth.js";
import authRoutes from "./authRoutes.js";
import imageRoutes from "./imageRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

/* ---------- public ---------- */
router.use("/auth", authRoutes);

/* ---------- protected ---------- */
router.use("/users", auth, userRoutes); // profile needs login
router.use("/upload", auth, uploadRoutes);
router.use("/images", auth, imageRoutes);

export default router;
