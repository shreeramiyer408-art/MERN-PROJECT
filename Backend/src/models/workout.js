import mongoose from "mongoose";

const workoutPlanSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
    },

    goal: {
      type: String,
      enum: ["Weight Loss", "Muscle Gain", "Endurance", "General Fitness"],
      required: true,
    },

    durationWeeks: {
      type: Number,
      required: true,
    },

    exercises: [
      {
        exerciseName: String,
        sets: Number,
        reps: Number,
        restTimeSeconds: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("WorkoutPlan", workoutPlanSchema);