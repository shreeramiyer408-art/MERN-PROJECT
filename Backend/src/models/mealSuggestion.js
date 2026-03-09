import mongoose from "mongoose";

const mealSuggestionSchema = new mongoose.Schema(
  {
    mealName: {
      type: String,
      required: true,
    },

    mealType: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
      required: true,
    },

    calories: {
      type: Number,
      required: true,
    },

    protein: {
      type: Number,
      default: 0,
    },

    carbs: {
      type: Number,
      default: 0,
    },

    fats: {
      type: Number,
      default: 0,
    },

    recommendedFor: {
      type: String,
      enum: ["Weight Loss", "Muscle Gain", "Maintenance"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("MealSuggestion", mealSuggestionSchema);