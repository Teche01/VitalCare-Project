import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

function LoginPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");

    try {

      setLoading(true);

      const response =
        await loginUser(formData);

      localStorage.setItem(
        "vitalcareUser",
        JSON.stringify(response)
      );

      switch (response.role) {

        case "PATIENT":
          navigate("/patient/dashboard");
          break;

        case "DOCTOR":
          navigate("/doctor/dashboard");
          break;

        case "RECEPTIONIST":
          navigate("/receptionist/dashboard");
          break;

        case "ADMIN":
          navigate("/admin/dashboard");
          break;

        default:
          setError("Invalid user role.");
      }

    } catch (err) {

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid email or password.";

      setError(message);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-slate-50 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8">

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-slate-600">
            Login to your VitalCare account.
          </p>

        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <p className="mt-6 text-center text-slate-600">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default LoginPage;