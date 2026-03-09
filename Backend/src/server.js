import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dns from "node:dns";

import { connectDB } from "./config/connectDB.js";
import activityRoutes from "./routes/activityRoutes.js";
import weightRoutes from "./routes/weightRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";

// =============================
// CONFIG
// =============================
dotenv.config();
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// =============================
// INITIALIZE EXPRESS
// =============================
const app = express();

// =============================
// MIDDLEWARE
// =============================
app.use(cors());
app.use(express.json());

// =============================
// ROUTES
// =============================
app.get("/", (req, res) => {
  res.json({ message: "Fitness Tracker API is running..." });
});

app.use("/api/activities", activityRoutes);
app.use("/api/weights", weightRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/workouts", workoutRoutes);

// =============================
// PORT
// =============================
const port = process.env.PORT || 5000;

// =============================
// START SERVER AFTER DB CONNECTS
// =============================
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    
  });
});