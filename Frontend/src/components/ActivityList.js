import React, { useEffect, useState } from "react";
import API from "../api";

function ActivityList() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const res = await API.get("/");
    setActivities(res.data);
  };

  const deleteActivity = async (id) => {
    await API.delete(`/${id}`);
    fetchActivities();
  };

  const total = activities.length;

  const totalCalories = activities.reduce(
    (sum, a) => sum + (a.caloriesBurned || 0),
    0
  );

  const avgDuration =
    total === 0
      ? 0
      : Math.round(
          activities.reduce((sum, a) => sum + a.duration, 0) / total
        );

  return (
    <div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Activities" value={total} />
        <StatCard title="Total Calories" value={totalCalories} />
        <StatCard title="Avg Duration" value={`${avgDuration} min`} />
      </div>

      <div className="space-y-8">
        {activities.map((activity) => {

          const percent =
            activity.intensity === "High"
              ? 90
              : activity.intensity === "Medium"
              ? 60
              : 40;

          const offset = 283 - (283 * percent) / 100;

          const color =
            activity.intensity === "High"
              ? "#ef4444"
              : activity.intensity === "Medium"
              ? "#22c55e"
              : "#facc15";

          return (
            <div
              key={activity._id}
              className="backdrop-blur-lg bg-white/30 p-6 rounded-3xl shadow-xl border border-white/30 hover:scale-[1.02] transition duration-300"
            >
              <div className="flex justify-between items-center">

                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {activity.activityName}
                  </h3>

                  <div className="mt-3 text-white/90 space-y-1 text-sm">
                    <p>Duration: {activity.duration} min</p>
                    <p>Category: {activity.category}</p>
                    <p>Calories: {activity.caloriesBurned}</p>
                  </div>
                </div>

                {/* Circular Progress */}
                <div className="relative w-24 h-24">
                  <svg className="transform -rotate-90" width="100" height="100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke={color}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="283"
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm">
                    {activity.intensity}
                  </div>
                </div>

              </div>

              <button
                onClick={() => deleteActivity(activity._id)}
                className="mt-6 px-5 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-110 transition duration-300"
              >
                Delete
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="backdrop-blur-lg bg-white/30 p-6 rounded-3xl shadow-xl border border-white/30 text-center">
      <h4 className="text-white/80 text-sm">{title}</h4>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
  );
}

export default ActivityList;