import express from "express";

import { deleteImage, getUserImages } from "../controllers/imageController.js";

const router = express.Router();

router.get("/:userId", getUserImages);
router.delete("/:filename/:userId", deleteImage);

export default router;
