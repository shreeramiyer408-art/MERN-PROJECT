function RecentTable({ activities }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Name</th>
            <th>Duration</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((a) => (
            <tr key={a._id} className="border-b hover:bg-gray-50">
              <td className="py-2">{a.name}</td>
              <td>{a.duration} mins</td>
              <td>{a.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentTable;