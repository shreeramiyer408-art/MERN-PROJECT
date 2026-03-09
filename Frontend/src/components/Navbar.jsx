export default function Navbar() {
  return (
    <div className="bg-white shadow p-4 flex justify-between">
      <h1 className="text-xl font-bold">Fitness Tracker</h1>

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Dark Mode
      </button>
    </div>
  );
}