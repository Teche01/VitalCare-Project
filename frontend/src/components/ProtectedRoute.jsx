import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  allowedRole,
}) {

  const storedUser =
    localStorage.getItem(
      "vitalcareUser"
    );

  if (!storedUser) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const user =
    JSON.parse(storedUser);

  if (
    allowedRole &&
    user.role !== allowedRole
  ) {

    switch (user.role) {

      case "PATIENT":
        return (
          <Navigate
            to="/patient/dashboard"
            replace
          />
        );

      case "DOCTOR":
        return (
          <Navigate
            to="/doctor/dashboard"
            replace
          />
        );

      case "RECEPTIONIST":
        return (
          <Navigate
            to="/receptionist/dashboard"
            replace
          />
        );

      case "ADMIN":
        return (
          <Navigate
            to="/admin/dashboard"
            replace
          />
        );

      default:
        return (
          <Navigate
            to="/login"
            replace
          />
        );
    }
  }

  return children;
}

export default ProtectedRoute;