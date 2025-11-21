import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/authRoutes.js";
import boardRoutes from "./src/routes/boardRoutes.js";
import listRoutes from "./src/routes/listRoutes.js";
import cardRoutes from "./src/routes/cardRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on PORT ${process.env.PORT}`)
);
