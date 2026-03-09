import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function ActivityChart({ activities }) {

  const data = activities.map((a) => ({
    name: a.name,
    calories: a.calories
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-lg font-semibold mb-4">
        Calories Burned
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="calories" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}