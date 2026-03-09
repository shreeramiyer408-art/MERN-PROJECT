export default function ActivityTable({ activities, deleteActivity }) {
return ( <div className="bg-white p-6 rounded-xl shadow">


  <h2 className="text-lg font-semibold mb-4">Activities</h2>

  {activities.length === 0 ? (
    <p className="text-gray-500">No activities yet.</p>
  ) : (
    <table className="w-full text-left">

      <thead>
        <tr className="border-b">
          <th className="py-2">Activity</th>
          <th>Duration</th>
          <th>Calories</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {activities.map((a, index) => (
          <tr key={index} className="border-b">

            <td className="py-2">{a.name}</td>
            <td>{a.duration} min</td>
            <td>{a.calories}</td>

            <td>
              {deleteActivity && (
                <button
                  onClick={() => deleteActivity(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </td>

          </tr>
        ))}
      </tbody>

    </table>
  )}

</div>


);
}
