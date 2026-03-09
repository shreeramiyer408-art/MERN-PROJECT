import React, { useEffect, useMemo, useState } from "react";
import API from "./api";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [clientSubmitted, setClientSubmitted] = useState(false);
  const [activities, setActivities] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [clientData, setClientData] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    targetWeight: "",
    goal: "Weight Loss",
    activityLevel: "Beginner",
    workoutDays: "",
    dietPreference: "Veg",
    dailyGoalTarget: "500",
    reminderTime: "",
  });

  const [generatedPlan, setGeneratedPlan] = useState(null);

  const [form, setForm] = useState({
    activityName: "",
    duration: "",
    intensity: "Low",
    category: "",
    caloriesBurned: "",
    date: "",
    steps: "",
    heartRate: "",
    distance: "",
    mealSuggestion: "",
    workoutPlan: "",
    monthlyWeight: "",
    monthlyWeightMonth: "",
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await API.get("/");
      setActivities(res.data);
    } catch (err) {
      console.error("Error fetching activities:", err);
    }
  };

  const handleClientChange = (e) => {
    setClientData({ ...clientData, [e.target.name]: e.target.value });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateBMI = (weight, height) => {
    const w = Number(weight);
    const h = Number(height) / 100;
    if (!w || !h) return "0";
    return (w / (h * h)).toFixed(1);
  };

  const calculateCalories = (goal) => {
    if (goal === "Weight Loss") return "1800 - 2000 kcal/day";
    if (goal === "Muscle Gain") return "2500 - 2800 kcal/day";
    return "2000 - 2200 kcal/day";
  };

  const getSuggestedPlan = (client) => {
    if (client.goal === "Weight Loss") {
      return {
        workoutPlan: [
          "Monday: 30 min Jogging + Plank (3 sets)",
          "Tuesday: Bodyweight Squats + Pushups + Lunges",
          "Wednesday: Rest / 20 min Light Walking",
          "Thursday: HIIT - Jumping Jacks, Burpees, Mountain Climbers",
          "Friday: Cycling 40 min + Core",
          "Saturday: Full Body Cardio Circuit",
          "Sunday: Rest",
        ],
        mealPlan: {
          breakfast: "Oats + Banana + 2 Boiled Eggs",
          lunch: "Brown Rice + Grilled Chicken/Paneer + Vegetables",
          dinner: "Vegetable Soup + Salad + Paneer",
          snacks: "Nuts + Fruits + Green Tea",
          protein: "80 - 100 g/day",
          calories: "1800 - 2000 kcal/day",
        },
      };
    }

    if (client.goal === "Muscle Gain") {
      return {
        workoutPlan: [
          "Monday: Chest + Triceps",
          "Tuesday: Back + Biceps",
          "Wednesday: Rest / Mobility",
          "Thursday: Legs + Squats + Calves",
          "Friday: Shoulders + Core",
          "Saturday: Light Cardio + Recovery",
          "Sunday: Rest",
        ],
        mealPlan: {
          breakfast: "Egg Omelette + Toast + Milk",
          lunch: "Rice + Chicken/Paneer + Vegetables",
          dinner: "Chapati + Dal + Paneer/Chicken",
          snacks: "Peanut Butter Sandwich + Banana",
          protein: "120 - 150 g/day",
          calories: "2500 - 2800 kcal/day",
        },
      };
    }

    return {
      workoutPlan: [
        "Monday: Light Cardio",
        "Tuesday: Full Body Workout",
        "Wednesday: Rest",
        "Thursday: Yoga / Stretching",
        "Friday: Strength Training",
        "Saturday: Walking",
        "Sunday: Rest",
      ],
      mealPlan: {
        breakfast: "Oats + Fruits",
        lunch: "Balanced Meal with Carbs + Protein + Vegetables",
        dinner: "Light Dinner + Soup",
        snacks: "Nuts + Yogurt",
        protein: "70 - 90 g/day",
        calories: "2000 - 2200 kcal/day",
      },
    };
  };

  const handleClientSubmit = (e) => {
    e.preventDefault();

    const plan = getSuggestedPlan(clientData);
    const bmi = calculateBMI(clientData.weight, clientData.height);
    const calories = calculateCalories(clientData.goal);

    setGeneratedPlan({
      ...plan,
      bmi,
      calories,
    });

    setClientSubmitted(true);
    setActivePage("Dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/", {
        activityName: form.activityName,
        duration: Number(form.duration),
        intensity: form.intensity,
        category: form.category,
        caloriesBurned: Number(form.caloriesBurned),
        date: form.date || new Date().toISOString(),
        stats: {
          steps: Number(form.steps) || 0,
          heartRate: Number(form.heartRate) || 0,
          distance: Number(form.distance) || 0,
        },
        mealSuggestion: form.mealSuggestion,
        workoutPlan: form.workoutPlan,
        dailyGoalTarget: Number(clientData.dailyGoalTarget) || 0,
        goalAchieved:
          totalCalories + (Number(form.caloriesBurned) || 0) >=
          Number(clientData.dailyGoalTarget || 0),
        reminderTime: clientData.reminderTime,
        monthlyWeightTracking: {
          weight: Number(form.monthlyWeight) || 0,
          month: form.monthlyWeightMonth,
        },
      });

      setForm({
        activityName: "",
        duration: "",
        intensity: "Low",
        category: "",
        caloriesBurned: "",
        date: "",
        steps: "",
        heartRate: "",
        distance: "",
        mealSuggestion: "",
        workoutPlan: "",
        monthlyWeight: "",
        monthlyWeightMonth: "",
      });

      fetchActivities();
      setActivePage("Activities");
    } catch (err) {
      console.error("Error adding activity:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/${id}`);
      fetchActivities();
    } catch (err) {
      console.error("Error deleting activity:", err);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  const totalActivities = activities.length;
  const totalCalories = activities.reduce(
    (sum, item) => sum + (Number(item.caloriesBurned) || 0),
    0
  );

  const avgDuration =
    totalActivities > 0
      ? Math.round(
          activities.reduce(
            (sum, item) => sum + (Number(item.duration) || 0),
            0
          ) / totalActivities
        )
      : 0;

  const dailyGoalTarget = Number(clientData.dailyGoalTarget) || 0;
  const dailyGoalProgress = dailyGoalTarget
    ? Math.min((totalCalories / dailyGoalTarget) * 100, 100)
    : 0;

  const categories = useMemo(() => {
    const unique = [
      ...new Set(
        activities
          .map((item) => item.category)
          .filter(Boolean)
          .map((item) => item.trim())
      ),
    ];
    return ["All", ...unique];
  }, [activities]);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesSearch = activity.activityName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || activity.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [activities, searchTerm, categoryFilter]);

  const latestWeight =
    activities
      .map((item) => item.monthlyWeightTracking)
      .filter(Boolean)
      .filter((item) => item.weight)
      .slice(-1)[0]?.weight || clientData.weight || "--";

  const getIntensityStyles = (intensity) => {
    if (intensity === "High") {
      return {
        ring: "border-red-500",
        badge: "bg-red-100 text-red-600",
        text: "text-red-500",
      };
    }

    if (intensity === "Medium") {
      return {
        ring: "border-green-500",
        badge: "bg-green-100 text-green-600",
        text: "text-green-500",
      };
    }

    return {
      ring: "border-yellow-400",
      badge: "bg-yellow-100 text-yellow-700",
      text: "text-yellow-600",
    };
  };

  const EmptyClientMessage = ({ title }) => (
    <div className="bg-white rounded-2xl shadow-md p-8 border border-yellow-200">
      <h3 className="text-2xl font-bold text-black mb-3">{title}</h3>
      <p className="text-slate-600 mb-5">
        Fill the client assessment form first to unlock this section.
      </p>
      <button
        onClick={() => setActivePage("Assessment")}
        className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold transition"
      >
        Go to Client Assessment
      </button>
    </div>
  );

  const renderClientForm = () => (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md p-8 border border-yellow-200">
        <h2 className="text-3xl font-bold text-black mb-2">
          Client Assessment Form
        </h2>
        <p className="text-slate-600 mb-8">
          Enter client details to generate a personalized fitness and meal plan.
        </p>

        <form onSubmit={handleClientSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={clientData.name}
              onChange={handleClientChange}
              className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={clientData.age}
              onChange={handleClientChange}
              className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
            <input
              type="number"
              name="height"
              placeholder="Height (cm)"
              value={clientData.height}
              onChange={handleClientChange}
              className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
            <input
              type="number"
              name="weight"
              placeholder="Weight (kg)"
              value={clientData.weight}
              onChange={handleClientChange}
              className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
            <input
              type="number"
              name="targetWeight"
              placeholder="Target Weight (kg)"
              value={clientData.targetWeight}
              onChange={handleClientChange}
              className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <input
              type="number"
              name="workoutDays"
              placeholder="Workout Days / Week"
              value={clientData.workoutDays}
              onChange={handleClientChange}
              className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <select
              name="goal"
              value={clientData.goal}
              onChange={handleClientChange}
              className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
            >
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <select
              name="activityLevel"
              value={clientData.activityLevel}
              onChange={handleClientChange}
              className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Moderate">Moderate</option>
              <option value="Active">Active</option>
            </select>
            <select
              name="dietPreference"
              value={clientData.dietPreference}
              onChange={handleClientChange}
              className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
            >
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
              <option value="Mixed">Mixed</option>
            </select>
            <input
              type="number"
              name="dailyGoalTarget"
              placeholder="Daily Goal Target (Calories)"
              value={clientData.dailyGoalTarget}
              onChange={handleClientChange}
              className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <input
              type="time"
              name="reminderTime"
              value={clientData.reminderTime}
              onChange={handleClientChange}
              className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-xl font-semibold shadow-md transition"
          >
            Generate Plan
          </button>
        </form>
      </div>
    </div>
  );

  const renderDashboard = () => {
    if (!clientSubmitted) {
      return <EmptyClientMessage title="Dashboard Locked" />;
    }

    return (
      <div className="space-y-8">
        {generatedPlan && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-yellow-200">
              <h3 className="text-xl font-semibold text-black mb-4">
                Client Profile
              </h3>
              <div className="space-y-2 text-slate-700">
                <p><span className="font-semibold">Name:</span> {clientData.name}</p>
                <p><span className="font-semibold">Age:</span> {clientData.age}</p>
                <p><span className="font-semibold">Goal:</span> {clientData.goal}</p>
                <p><span className="font-semibold">Current Weight:</span> {clientData.weight} kg</p>
                <p><span className="font-semibold">Target Weight:</span> {clientData.targetWeight || "--"} kg</p>
                <p><span className="font-semibold">Diet Preference:</span> {clientData.dietPreference}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-yellow-200">
              <h3 className="text-xl font-semibold text-black mb-4">
                Health Metrics
              </h3>
              <div className="space-y-2 text-slate-700">
                <p><span className="font-semibold">BMI:</span> {generatedPlan.bmi}</p>
                <p><span className="font-semibold">Recommended Calories:</span> {generatedPlan.calories}</p>
                <p><span className="font-semibold">Protein Target:</span> {generatedPlan.mealPlan.protein}</p>
                <p><span className="font-semibold">Reminder Time:</span> {clientData.reminderTime || "--"}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-black">
              Add New Activity
            </h3>
            <button
              onClick={handleExportPDF}
              className="bg-black text-yellow-400 px-4 py-2 rounded-xl font-medium hover:bg-slate-900 transition"
            >
              Export to PDF
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <input
                type="text"
                name="activityName"
                placeholder="Activity Name"
                value={form.activityName}
                onChange={handleChange}
                className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
                required
              />
              <input
                type="number"
                name="duration"
                placeholder="Duration (min)"
                value={form.duration}
                onChange={handleChange}
                className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
                required
              />
              <select
                name="intensity"
                value={form.intensity}
                onChange={handleChange}
                className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
                required
              />
              <input
                type="number"
                name="caloriesBurned"
                placeholder="Calories Burned"
                value={form.caloriesBurned}
                onChange={handleChange}
                className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
                required
              />
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
              <input
                type="number"
                name="steps"
                placeholder="Steps"
                value={form.steps}
                onChange={handleChange}
                className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
              <input
                type="number"
                name="heartRate"
                placeholder="Heart Rate"
                value={form.heartRate}
                onChange={handleChange}
                className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
              <input
                type="number"
                name="distance"
                placeholder="Distance (km)"
                value={form.distance}
                onChange={handleChange}
                className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
              <input
                type="text"
                name="mealSuggestion"
                placeholder="Meal Suggestion"
                value={form.mealSuggestion}
                onChange={handleChange}
                className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
              <input
                type="text"
                name="workoutPlan"
                placeholder="Workout Plan"
                value={form.workoutPlan}
                onChange={handleChange}
                className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
              <input
                type="number"
                name="monthlyWeight"
                placeholder="Monthly Weight (kg)"
                value={form.monthlyWeight}
                onChange={handleChange}
                className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
              <input
                type="text"
                name="monthlyWeightMonth"
                placeholder="Weight Month (e.g. March 2026)"
                value={form.monthlyWeightMonth}
                onChange={handleChange}
                className="border border-slate-300 rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none xl:col-span-2"
              />
            </div>

            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold shadow-md transition"
            >
              Add Activity
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-yellow-200">
            <p className="text-slate-500">Total Activities</p>
            <h3 className="text-3xl font-bold text-black mt-2">
              {totalActivities}
            </h3>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-yellow-200">
            <p className="text-slate-500">Total Calories</p>
            <h3 className="text-3xl font-bold text-black mt-2">
              {totalCalories}
            </h3>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-yellow-200">
            <p className="text-slate-500">Avg Duration</p>
            <h3 className="text-3xl font-bold text-black mt-2">
              {avgDuration} min
            </h3>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-yellow-200">
            <p className="text-slate-500">Latest Weight</p>
            <h3 className="text-3xl font-bold text-black mt-2">
              {latestWeight} kg
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold text-black">
              Daily Goal Tracker
            </h3>
            <span className="text-sm text-slate-600">
              {totalCalories} / {dailyGoalTarget || 0} kcal
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-yellow-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${dailyGoalProgress}%` }}
            />
          </div>

          <p className="text-slate-600 mt-3">
            {dailyGoalProgress >= 100
              ? "Daily goal achieved."
              : "Keep going to reach the daily goal."}
          </p>
        </div>
      </div>
    );
  };

  const renderActivities = () => (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-yellow-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h3 className="text-xl font-semibold text-black">
          All Activities
        </h3>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by activity"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-slate-300 rounded-xl px-4 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-slate-300 rounded-xl px-4 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 outline-none"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredActivities.length === 0 ? (
        <p className="text-slate-500">No matching activities found.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredActivities.map((activity) => {
            const style = getIntensityStyles(activity.intensity);

            return (
              <div
                key={activity._id}
                className="border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition bg-slate-50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-2xl font-bold text-black">
                      {activity.activityName}
                    </h4>

                    <div className="mt-3 space-y-2 text-slate-700">
                      <p>Duration: {activity.duration} min</p>
                      <p>Category: {activity.category}</p>
                      <p>Calories: {activity.caloriesBurned}</p>
                      <p>Date: {activity.date ? new Date(activity.date).toLocaleDateString() : "--"}</p>
                      <p>Steps: {activity.stats?.steps ?? 0}</p>
                      <p>Heart Rate: {activity.stats?.heartRate ?? 0}</p>
                      <p>Distance: {activity.stats?.distance ?? 0} km</p>
                      <p>Meal Suggestion: {activity.mealSuggestion || "--"}</p>
                      <p>Workout Plan: {activity.workoutPlan || "--"}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className={`w-20 h-20 rounded-full border-[8px] ${style.ring} flex items-center justify-center bg-white`}
                    >
                      <span className={`font-bold ${style.text}`}>
                        {activity.intensity}
                      </span>
                    </div>

                    <span
                      className={`mt-3 px-3 py-1 rounded-full text-sm font-medium ${style.badge}`}
                    >
                      {activity.intensity}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(activity._id)}
                  className="mt-6 bg-black text-yellow-400 px-5 py-2 rounded-xl font-semibold shadow-md hover:bg-slate-900 transition"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderWorkouts = () => {
    if (!clientSubmitted) {
      return <EmptyClientMessage title="Workout Plan Locked" />;
    }

    return (
      <div className="bg-white rounded-2xl shadow-md p-6 border border-yellow-200">
        <h3 className="text-xl font-semibold text-black mb-6">
          Weekly Workout Plan
        </h3>

        <ul className="space-y-3">
          {generatedPlan.workoutPlan.map((item, index) => (
            <li
              key={index}
              className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-slate-700"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-6 border border-yellow-200 rounded-xl p-4 bg-yellow-50 text-slate-700">
          <p className="font-semibold text-black">Workout Reminder</p>
          <p className="mt-2">
            Reminder time set for: {clientData.reminderTime || "Not set"}
          </p>
        </div>
      </div>
    );
  };

  const renderMeals = () => {
    if (!clientSubmitted) {
      return <EmptyClientMessage title="Meal Plan Locked" />;
    }

    return (
      <div className="bg-white rounded-2xl shadow-md p-6 border border-yellow-200">
        <h3 className="text-xl font-semibold text-black mb-6">
          Detailed Meal Plan
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50">
            <h4 className="font-bold text-black mb-3">Meals</h4>
            <div className="space-y-2 text-slate-700">
              <p><span className="font-semibold">Breakfast:</span> {generatedPlan.mealPlan.breakfast}</p>
              <p><span className="font-semibold">Lunch:</span> {generatedPlan.mealPlan.lunch}</p>
              <p><span className="font-semibold">Dinner:</span> {generatedPlan.mealPlan.dinner}</p>
              <p><span className="font-semibold">Snacks:</span> {generatedPlan.mealPlan.snacks}</p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50">
            <h4 className="font-bold text-black mb-3">Nutrition Targets</h4>
            <div className="space-y-2 text-slate-700">
              <p><span className="font-semibold">Calories:</span> {generatedPlan.mealPlan.calories}</p>
              <p><span className="font-semibold">Protein:</span> {generatedPlan.mealPlan.protein}</p>
              <p><span className="font-semibold">Diet Preference:</span> {clientData.dietPreference}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWeight = () => {
    if (!clientSubmitted) {
      return <EmptyClientMessage title="Weight Tracker Locked" />;
    }

    return (
      <div className="bg-white rounded-2xl shadow-md p-6 border border-yellow-200">
        <h3 className="text-xl font-semibold text-black mb-6">
          Weight Tracking
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-2xl p-5 bg-slate-50 text-center">
            <h4 className="font-bold text-black">Current Weight</h4>
            <p className="text-2xl font-bold text-yellow-600 mt-2">
              {clientData.weight} kg
            </p>
          </div>

          <div className="border rounded-2xl p-5 bg-slate-50 text-center">
            <h4 className="font-bold text-black">Target Weight</h4>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {clientData.targetWeight || "--"} kg
            </p>
          </div>

          <div className="border rounded-2xl p-5 bg-slate-50 text-center">
            <h4 className="font-bold text-black">BMI</h4>
            <p className="text-2xl font-bold text-black mt-2">
              {generatedPlan?.bmi || "--"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activePage) {
      case "Assessment":
        return renderClientForm();
      case "Activities":
        return renderActivities();
      case "Workouts":
        return renderWorkouts();
      case "Meals":
        return renderMeals();
      case "Weight":
        return renderWeight();
      default:
        return renderDashboard();
    }
  };

  const menuItems = [
    "Assessment",
    "Dashboard",
    "Activities",
    "Workouts",
    "Meals",
    "Weight",
  ];

  return (
    <div className="min-h-screen bg-yellow-50">
      <div className="flex">
        <aside className="hidden md:flex w-64 min-h-screen bg-black text-white flex-col p-6">
          <h1 className="text-2xl font-bold mb-10 text-yellow-400">
            FitnessTracker
          </h1>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => setActivePage(item)}
                className={`w-full text-left px-4 py-3 rounded-xl transition ${
                  activePage === item
                    ? "bg-yellow-400 text-black font-semibold"
                    : "text-slate-300 hover:bg-slate-900 hover:text-yellow-300"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b border-yellow-200">
            <h2 className="text-2xl font-semibold text-black">
              {activePage}
            </h2>
            <div className="w-10 h-10 rounded-full bg-black border-2 border-yellow-400" />
          </div>

          <div className="p-6">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}

export default App;