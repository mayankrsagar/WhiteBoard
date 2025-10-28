import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { dirname, join } from "path";
import { Server as SocketIO } from "socket.io";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import socketHandler from "./middleware/socket.js";
import routes from "./routes/index.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);

/*  CORS: adjust origin to your Vite / React dev server  */
const io = new SocketIO(server, {
  cors: {
    origin: "http://localhost:5173", // ← your front-end URL
    methods: ["GET", "POST"],
    credentials: true, // allow cookies
  },
});

/* ---------- middleware ---------- */
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // same here
app.use(express.json());
app.use("/img", express.static(join(__dirname, "img")));

/* ---------- DB ---------- */
connectDB();

/* ---------- routes ---------- */
app.use("/api", routes);

/* ---------- socket ---------- */
socketHandler(io);

/* ---------- error ---------- */
app.use(errorHandler);

export default server;
