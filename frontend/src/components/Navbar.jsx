import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link
          to="/"
          className="text-2xl font-bold text-blue-700"
        >
          VitalCare
        </Link>

        <div className="flex items-center gap-6">

          <Link
            to="/"
            className="text-slate-600 hover:text-blue-700 font-medium"
          >
            Home
          </Link>

          <Link
            to="/login"
            className="text-slate-600 hover:text-blue-700 font-medium"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;