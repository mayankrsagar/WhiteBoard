import express from "express";

import { deleteImage, getUserImages } from "../controllers/imageController.js";

const router = express.Router();

router.get("/", getUserImages);
router.delete("/:filename", deleteImage);

export default router;
