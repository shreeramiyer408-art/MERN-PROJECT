import mongoose from "mongoose";

const weightSchema = new mongoose.Schema(
  {
    month: {
      type: String, // Example: "January 2026"
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    goalWeight: {
      type: Number,
    },

    notes: {
      type: String,
    },

    recordedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Weight", weightSchema);