import React, { useState } from "react";
import API from "../api";

function ActivityForm() {
  const [form, setForm] = useState({
    activityName: "",
    duration: "",
    intensity: "Low",
    category: "",
    caloriesBurned: "",
    steps: "",
    heartRate: "",
    distance: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await API.post("/", {
        activityName: form.activityName,
        duration: Number(form.duration) || 0,
        intensity: form.intensity,
        category: form.category,
        caloriesBurned: Number(form.caloriesBurned) || 0,

        stats: {
          steps: Number(form.steps) || 0,
          heartRate: Number(form.heartRate) || 0,
          distance: Number(form.distance) || 0
        }
      });

      alert("Activity Added!");

      setForm({
        activityName: "",
        duration: "",
        intensity: "Low",
        category: "",
        caloriesBurned: "",
        steps: "",
        heartRate: "",
        distance: ""
      });

      window.location.reload();

    } catch (error) {
      console.error("Error adding activity:", error);
      alert("Failed to add activity");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        name="activityName"
        placeholder="Activity Name"
        value={form.activityName}
        className="w-full p-3 rounded-xl border border-white/30 bg-white/30 backdrop-blur-md text-white placeholder-white"
        onChange={handleChange}
        required
      />

      <input
        name="duration"
        placeholder="Duration (min)"
        value={form.duration}
        className="w-full p-3 rounded-xl border border-white/30 bg-white/30 backdrop-blur-md text-white placeholder-white"
        onChange={handleChange}
        required
      />

      <select
        name="intensity"
        value={form.intensity}
        className="w-full p-3 rounded-xl border border-white/30 bg-white/30 backdrop-blur-md text-white"
        onChange={handleChange}
      >
        <option className="text-black">Low</option>
        <option className="text-black">Medium</option>
        <option className="text-black">High</option>
      </select>

      <input
        name="category"
        placeholder="Category"
        value={form.category}
        className="w-full p-3 rounded-xl border border-white/30 bg-white/30 backdrop-blur-md text-white placeholder-white"
        onChange={handleChange}
        required
      />

      <input
        name="caloriesBurned"
        placeholder="Calories Burned"
        value={form.caloriesBurned}
        className="w-full p-3 rounded-xl border border-white/30 bg-white/30 backdrop-blur-md text-white placeholder-white"
        onChange={handleChange}
      />

      <div className="grid grid-cols-3 gap-4">

        <input
          name="steps"
          placeholder="Steps"
          value={form.steps}
          className="p-3 rounded-xl border border-white/30 bg-white/30 backdrop-blur-md text-white placeholder-white"
          onChange={handleChange}
        />

        <input
          name="heartRate"
          placeholder="Heart Rate"
          value={form.heartRate}
          className="p-3 rounded-xl border border-white/30 bg-white/30 backdrop-blur-md text-white placeholder-white"
          onChange={handleChange}
        />

        <input
          name="distance"
          placeholder="Distance (km)"
          value={form.distance}
          className="p-3 rounded-xl border border-white/30 bg-white/30 backdrop-blur-md text-white placeholder-white"
          onChange={handleChange}
        />

      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition duration-300"
      >
        Add Activity
      </button>

    </form>
  );
}

export default ActivityForm;
