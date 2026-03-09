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

    await API.post("/", {
      activityName: form.activityName,
      duration: Number(form.duration),
      intensity: form.intensity,
      category: form.category,
      caloriesBurned: Number(form.caloriesBurned),
      stats: {
        steps: Number(form.steps),
        heartRate: Number(form.heartRate),
        distance: Number(form.distance)
      }
    });

    alert("Activity Added!");
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        name="activityName"
        placeholder="Activity Name"
        className="w-full p-3 rounded-xl border border-white/30 bg-white/30 backdrop-blur-md text-white placeholder-white"
        onChange={handleChange}
        required
      />

      <input
        name="duration"
        placeholder="Duration (min)"
        className="w-full p-3 rounded-xl border border-white/30 bg-white/30 backdrop-blur-md text-white placeholder-white"
        onChange={handleChange}
        required
      />

      <select
        name="intensity"
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
        className="w-full p-3 rounded-xl border border-white/30 bg-white/30 backdrop-blur-md text-white placeholder-white"
        onChange={handleChange}
        required
      />

      <input
        name="caloriesBurned"
        placeholder="Calories Burned"
        className="w-full p-3 rounded-xl border border-white/30 bg-white/30 backdrop-blur-md text-white placeholder-white"
        onChange={handleChange}
      />

      <div className="grid grid-cols-3 gap-4">
        <input
          name="steps"
          placeholder="Steps"
          className="p-3 rounded-xl border border-white/30 bg-white/30 backdrop-blur-md text-white placeholder-white"
          onChange={handleChange}
        />

        <input
          name="heartRate"
          placeholder="Heart Rate"
          className="p-3 rounded-xl border border-white/30 bg-white/30 backdrop-blur-md text-white placeholder-white"
          onChange={handleChange}
        />

        <input
          name="distance"
          placeholder="Distance (km)"
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
