import mongoose from "mongoose";

const statsSchema = new mongoose.Schema(
  {
    totalActivities: {
      type: Number,
      default: 0,
    },

    totalCaloriesBurned: {
      type: Number,
      default: 0,
    },

    averageDuration: {
      type: Number,
      default: 0,
    },

    monthlyWeightChange: {
      type: Number,
      default: 0,
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Stats", statsSchema);