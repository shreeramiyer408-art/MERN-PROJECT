import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    activityName: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    intensity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },

    category: {
  type: String,
  required: true
},

    caloriesBurned: {
      type: Number,
      required: true,
      min: 0,
    },

    stats: {
      steps: { type: Number, default: 0 },
      heartRate: { type: Number, default: 0 },
      distance: { type: Number, default: 0 }, // km
    },

    dailyGoalTarget: {
      type: Number,
      default: 0,
    },

    goalAchieved: {
      type: Boolean,
      default: false,
    },

    reminderTime: {
      type: String,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

activitySchema.index({ activityName: "text" });

export default mongoose.model("Activity", activitySchema);