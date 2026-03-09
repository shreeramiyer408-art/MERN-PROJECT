import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-slate-900 text-white fixed left-0 top-0 p-6">
      <h1 className="text-2xl font-bold mb-10">FitnessPro</h1>

      <nav className="flex flex-col space-y-4 text-gray-300">
        <Link to="/" className="hover:text-white">Dashboard</Link>
        <Link to="/activities" className="hover:text-white">Activities</Link>
        <Link to="/workouts" className="hover:text-white">Workouts</Link>
        <Link to="/meals" className="hover:text-white">Meals</Link>
        <Link to="/weight" className="hover:text-white">Weight</Link>
      </nav>
    </div>
  );
}

export default Sidebar;