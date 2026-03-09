import express from "express";
import Workout from "../models/workout.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const workout = new WorkoutPlan(req.body);
    const savedWorkout = await workout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const workouts = await WorkoutPlan.find();
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;