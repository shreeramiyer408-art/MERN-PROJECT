import express from "express";
import Weight from "../models/Weight.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const weight = new Weight(req.body);
    const savedWeight = await weight.save();
    res.status(201).json(savedWeight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const weights = await Weight.find().sort({ createdAt: -1 });
    res.json(weights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;