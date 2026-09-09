import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  setupInitialAdmin,
} from "../services/authService";

function AdminSetupPage() {

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");
      setSuccess("");

      if (
        password !== confirmPassword
      ) {
        setError(
          "Passwords do not match."
        );

        return;
      }

      try {

        setLoading(true);

        await setupInitialAdmin({
          email,
          password,
        });

        setSuccess(
          "Administrator account created successfully."
        );

        setEmail("");
        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          navigate("/login");
        }, 1200);

      } catch (err) {

        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to create administrator account.";

        setError(message);

      } finally {

        setLoading(false);
      }
    };

  return (
    <div className="min-h-[calc(100vh-70px)] bg-slate-50 flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8">

        <div className="text-center mb-7">

          <p className="text-sm font-semibold text-blue-600">
            VitalCare Setup
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Create Initial Administrator
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            This setup can be completed only once.
          </p>

        </div>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Admin Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="admin@vitalcare.com"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Enter password"
              minLength="6"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              placeholder="Re-enter password"
              minLength="6"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Creating Administrator..."
              : "Create Administrator"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default AdminSetupPage;