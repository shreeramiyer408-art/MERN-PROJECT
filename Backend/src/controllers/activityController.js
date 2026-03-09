import Activity from "../models/activityModel.js";

// ===============================
// GET ALL ACTIVITIES
// Includes: Search + Category Filter
// ===============================
export const getAllActivities = async (req, res) => {
  try {
    const { search, category, date } = req.query;

    let filter = {};

    // Search by Activity Name
    if (search) {
      filter.activityName = { $regex: search, $options: "i" };
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Filter by specific date (Daily tracking)
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      filter.date = { $gte: start, $lte: end };
    }

    const activities = await Activity.find(filter).sort({ createdAt: -1 });

    res.status(200).json(activities);
  } catch (error) {
    console.error("Error in getAllActivities controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ===============================
// GET ACTIVITY BY ID
// ===============================
export const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json(activity);
  } catch (error) {
    console.error("Error in getActivityById controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ===============================
// CREATE ACTIVITY
// Includes: Intensity Color Logic + Daily Goal Check
// ===============================
export const createActivity = async (req, res) => {
  try {
    const {
      activityName,
      duration,
      intensity,
      category,
      caloriesBurned,
      date,
      stats,
      mealSuggestion,
      workoutPlan,
      dailyGoalTarget,
      reminderTime
    } = req.body;

    if (!activityName || !duration || !intensity || !category) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    // Color coded intensity
    let intensityColor = "green";
    if (intensity === "Medium") intensityColor = "orange";
    if (intensity === "High") intensityColor = "red";

    // Daily goal tracker logic
    let goalAchieved = false;
    if (caloriesBurned && dailyGoalTarget) {
      goalAchieved = caloriesBurned >= dailyGoalTarget;
    }

    const activity = new Activity({
      activityName,
      duration,
      intensity,
      intensityColor,
      category,
      caloriesBurned,
      date,
      stats,
      mealSuggestion,
      workoutPlan,
      dailyGoalTarget,
      goalAchieved,
      reminderTime
    });

    const savedActivity = await activity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    console.error("Error in createActivity controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ===============================
// UPDATE ACTIVITY
// ===============================
export const updateActivity = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Update intensity color dynamically
    if (updateData.intensity) {
      if (updateData.intensity === "Low") updateData.intensityColor = "green";
      if (updateData.intensity === "Medium") updateData.intensityColor = "orange";
      if (updateData.intensity === "High") updateData.intensityColor = "red";
    }

    // Update goal status if calories & goal exist
    if (updateData.caloriesBurned && updateData.dailyGoalTarget) {
      updateData.goalAchieved =
        updateData.caloriesBurned >= updateData.dailyGoalTarget;
    }

    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json(updatedActivity);
  } catch (error) {
    console.error("Error in updateActivity controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ===============================
// DELETE ACTIVITY
// ===============================
export const deleteActivity = async (req, res) => {
  try {
    const deletedActivity = await Activity.findByIdAndDelete(req.params.id);

    if (!deletedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error in deleteActivity controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
