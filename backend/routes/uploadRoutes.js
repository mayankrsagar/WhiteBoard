import express from "express";

import { uploadImage } from "../controllers/uploadController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/", upload.single("file"), uploadImage);

export default router;
