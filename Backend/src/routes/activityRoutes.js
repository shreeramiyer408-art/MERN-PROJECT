import express from "express";
import {
  createActivity,
  deleteActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
  
} from "../controllers/activityController.js";

const router = express.Router();

/*
====================================
        BASIC CRUD ROUTES
====================================
*/

// GET all activities
router.get("/", getAllActivities);

// GET single activity
router.get("/:id", getActivityById);

// CREATE activity
router.post("/", createActivity);

// UPDATE activity
router.put("/:id", updateActivity);

// DELETE activity
router.delete("/:id", deleteActivity);


/*
====================================
        ADDITIONAL FEATURES
====================================
*/

// Export all activities to PDF


// Monthly progress


export default router;