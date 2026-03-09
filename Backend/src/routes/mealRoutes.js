import express from "express";
import MealSuggestion from "../models/mealSuggestion.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const meal = new MealSuggestion(req.body);
    const savedMeal = await meal.save();
    res.status(201).json(savedMeal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const meals = await MealSuggestion.find();
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;