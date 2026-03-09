export default function StatsCards({ activities }) {

  const totalCalories = activities.reduce(
    (sum, a) => sum + a.calories,
    0
  );

  const avgDuration =
    activities.length > 0
      ? (
          activities.reduce((sum, a) => sum + a.duration, 0) /
          activities.length
        ).toFixed(1)
      : 0;

  return (
    <div className="grid grid-cols-3 gap-6">

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">Total Activities</p>
        <h2 className="text-3xl font-bold">{activities.length}</h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">Total Calories</p>
        <h2 className="text-3xl font-bold">{totalCalories}</h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">Avg Duration</p>
        <h2 className="text-3xl font-bold">{avgDuration} min</h2>
      </div>

    </div>
  );
}