import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import RecentTable from "../components/RecentTable";
import API from "../services/api";

function Dashboard() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const res = await API.get("/activities");
    setActivities(res.data);
  };

  const totalDuration = activities.reduce(
    (sum, a) => sum + Number(a.duration),
    0
  );

  return (
    <div>
      <Sidebar />
      <Navbar />

      <div className="ml-64 p-6 bg-slate-100 min-h-screen space-y-6">

        {/* Stats Section */}
        <div className="grid grid-cols-4 gap-6">
          <StatsCard title="Total Activities" value={activities.length} />
          <StatsCard title="Total Duration" value={`${totalDuration} mins`} />
          <StatsCard title="Calories Burned" value="--" />
          <StatsCard title="Current Weight" value="--" />
        </div>

        {/* Activity Summary Card */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">
            Activity Summary
          </h3>
          <p className="text-gray-600">
            You have completed {activities.length} activities with a total
            duration of {totalDuration} minutes.
          </p>
        </div>

        {/* Recent Table */}
        <RecentTable activities={activities} />

      </div>
    </div>
  );
}

export default Dashboard;