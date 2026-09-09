import {
  Link,
  useNavigate,
} from "react-router-dom";

function DashboardNavbar() {

  const navigate =
    useNavigate();

  const user = JSON.parse(
    localStorage.getItem(
      "vitalcareUser"
    )
  );

  const handleLogout = () => {

    localStorage.removeItem(
      "vitalcareUser"
    );

    navigate("/login", {
      replace: true,
    });
  };

  const getDashboardPath = () => {

    switch (user?.role) {

      case "PATIENT":
        return "/patient/dashboard";

      case "DOCTOR":
        return "/doctor/dashboard";

      case "RECEPTIONIST":
        return "/receptionist/dashboard";

      case "ADMIN":
        return "/admin/dashboard";

      default:
        return "/";
    }
  };

  const getRoleLabel = () => {

    switch (user?.role) {

      case "PATIENT":
        return "Patient";

      case "DOCTOR":
        return "Doctor";

      case "RECEPTIONIST":
        return "Receptionist";

      case "ADMIN":
        return "Administrator";

      default:
        return "";
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">

        {/* LOGO */}

        <div className="flex items-center gap-8">

          <Link
            to={getDashboardPath()}
            className="text-2xl font-bold text-blue-700"
          >
            VitalCare
          </Link>

          <Link
            to={getDashboardPath()}
            className="hidden md:block text-slate-600 hover:text-blue-700 font-medium"
          >
            Dashboard
          </Link>

        </div>

        {/* USER */}

        <div className="flex items-center gap-5">

          <div className="hidden sm:block text-right">

            <p className="text-sm font-semibold text-slate-900">
              {user?.fullName}
            </p>

            <p className="text-xs text-slate-500">
              {getRoleLabel()}
            </p>

          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100"
          >
            Logout
          </button>

        </div>

      </div>

    </nav>
  );
}

export default DashboardNavbar;