import { useEffect, useState } from "react";

import DoctorManagement from "../components/admin/DoctorManagement";
import ReceptionistManagement from "../components/admin/ReceptionistManagement";
import DoctorAvailabilityManagement from "../components/admin/DoctorAvailabilityManagement";
import PatientManagement from "../components/admin/PatientManagement";
import AppointmentManagement from "../components/admin/AppointmentManagement";
import DashboardNavbar from "../components/DashboardNavbar";

import {
  getAdminDashboardStats,
  getAllDepartments,
  createDepartment,
  changeDepartmentStatus,
  getAllDoctors,
} from "../services/adminService";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("vitalcareUser"));

  const [stats, setStats] = useState(null);

  const [departments, setDepartments] = useState([]);

  const [doctors, setDoctors] = useState([]);

  const [departmentName, setDepartmentName] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const [creatingDepartment, setCreatingDepartment] = useState(false);

  const [changingDepartmentId, setChangingDepartmentId] = useState(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // =========================
  // LOAD DASHBOARD
  // =========================

  const loadDashboardStats = async () => {
    try {
      const data = await getAdminDashboardStats();

      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard statistics", err);

      setError("Unable to load dashboard statistics.");
    }
  };

  // =========================
  // LOAD DEPARTMENTS
  // =========================

  const loadDepartments = async () => {
    try {
      const data = await getAllDepartments();

      setDepartments(data);
    } catch (err) {
      console.error("Failed to load departments", err);

      setError("Unable to load departments.");
    }
  };

  const loadDoctors = async () => {
    try {
      const data = await getAllDoctors();

      setDoctors(data);
    } catch (err) {
      console.error("Failed to load doctors", err);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        loadDashboardStats(),
        loadDepartments(),
        loadDoctors(),
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  // =========================
  // CREATE DEPARTMENT
  // =========================

  const handleCreateDepartment = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!departmentName.trim()) {
      setError("Department name is required.");

      return;
    }

    const departmentData = {
      departmentName: departmentName.trim(),

      description: description.trim(),
    };

    try {
      setCreatingDepartment(true);

      await createDepartment(departmentData);

      setSuccess("Department created successfully.");

      setDepartmentName("");
      setDescription("");

      await loadDepartments();
      await loadDashboardStats();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to create department.";

      setError(message);
    } finally {
      setCreatingDepartment(false);
    }
  };

  // =========================
  // CHANGE DEPARTMENT STATUS
  // =========================

  const handleStatusChange = async (departmentId, currentStatus) => {
    const newStatus = !currentStatus;

    const message = newStatus
      ? "Activate this department?"
      : "Deactivate this department?";

    const confirmed = window.confirm(message);

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      setChangingDepartmentId(departmentId);

      await changeDepartmentStatus(departmentId, newStatus);

      setSuccess(
        newStatus
          ? "Department activated successfully."
          : "Department deactivated successfully.",
      );

      await loadDepartments();
    } catch (err) {
      const responseMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to change department status.";

      setError(responseMessage);
    } finally {
      setChangingDepartmentId(null);
    }
  };

  // =========================
  // STAT CARD
  // =========================

  const StatCard = ({ title, value }) => {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <p className="text-sm text-slate-500">{title}</p>

        <p className="mt-2 text-3xl font-bold text-slate-900">{value ?? 0}</p>
      </div>
    );
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* =========================
            HEADER
        ========================== */}

        <div className="mb-10">
          <p className="text-sm font-medium text-blue-600">Admin Portal</p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Welcome, {user?.fullName}
          </h1>

          <p className="mt-2 text-slate-600">
            Monitor hospital activity and manage VitalCare resources.
          </p>
        </div>

        {/* =========================
            MESSAGES
        ========================== */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* =========================
            LOADING
        ========================== */}

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-blue-600">
            Loading dashboard...
          </div>
        ) : (
          <>
            {/* =========================
                STATISTICS - ROW 1
            ========================== */}

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard title="Total Patients" value={stats?.totalPatients} />

              <StatCard title="Total Doctors" value={stats?.totalDoctors} />

              <StatCard
                title="Receptionists"
                value={stats?.totalReceptionists}
              />

              <StatCard title="Departments" value={stats?.totalDepartments} />
            </div>

            {/* =========================
                STATISTICS - ROW 2
            ========================== */}

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
              <StatCard
                title="Today's Appointments"
                value={stats?.todayAppointments}
              />

              <StatCard title="Booked" value={stats?.bookedAppointments} />

              <StatCard
                title="Completed"
                value={stats?.completedAppointments}
              />

              <StatCard
                title="Cancelled"
                value={stats?.cancelledAppointments}
              />
            </div>

            {/* =========================
                DEPARTMENT MANAGEMENT
            ========================== */}

            <div className="grid lg:grid-cols-3 gap-8 mt-10">
              {/* =====================
                  ADD DEPARTMENT
              ====================== */}

              <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  Add Department
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Create a new hospital department.
                </p>

                <form
                  onSubmit={handleCreateDepartment}
                  className="mt-6 space-y-5"
                >
                  {/* DEPARTMENT NAME */}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Department Name
                    </label>

                    <input
                      type="text"
                      value={departmentName}
                      onChange={(event) =>
                        setDepartmentName(event.target.value)
                      }
                      placeholder="e.g. Cardiology"
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* DESCRIPTION */}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>

                    <textarea
                      rows="4"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Short department description"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* ADD BUTTON */}

                  <button
                    type="submit"
                    disabled={creatingDepartment}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                  >
                    {creatingDepartment ? "Creating..." : "Add Department"}
                  </button>
                </form>
              </div>

              {/* =====================
                  DEPARTMENT LIST
              ====================== */}

              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900">
                    Departments
                  </h2>

                  <p className="mt-1 text-sm text-slate-600">
                    Manage hospital departments and their availability.
                  </p>
                </div>

                {departments.length === 0 ? (
                  <div className="p-10 text-center text-slate-500">
                    No departments found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      {/* TABLE HEADER */}

                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                            Department
                          </th>

                          <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                            Description
                          </th>

                          <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                            Status
                          </th>

                          <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                            Action
                          </th>
                        </tr>
                      </thead>

                      {/* TABLE BODY */}

                      <tbody>
                        {departments.map((department) => (
                          <tr
                            key={department.departmentId}
                            className="border-b border-slate-100"
                          >
                            {/* NAME */}

                            <td className="px-6 py-4">
                              <p className="font-medium text-slate-900">
                                {department.departmentName}
                              </p>

                              <p className="text-xs text-slate-500 mt-1">
                                ID: {department.departmentId}
                              </p>
                            </td>

                            {/* DESCRIPTION */}

                            <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">
                              {department.description || "-"}
                            </td>

                            {/* STATUS */}

                            <td className="px-6 py-4">
                              <span
                                className={
                                  department.active
                                    ? "bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full font-medium"
                                    : "bg-red-50 text-red-700 text-xs px-3 py-1 rounded-full font-medium"
                                }
                              >
                                {department.active ? "ACTIVE" : "INACTIVE"}
                              </span>
                            </td>

                            {/* ACTION */}

                            <td className="px-6 py-4">
                              <button
                                type="button"
                                disabled={
                                  changingDepartmentId ===
                                  department.departmentId
                                }
                                onClick={() =>
                                  handleStatusChange(
                                    department.departmentId,
                                    department.active,
                                  )
                                }
                                className={
                                  department.active
                                    ? "text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                                    : "text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-50"
                                }
                              >
                                {changingDepartmentId ===
                                department.departmentId
                                  ? "Updating..."
                                  : department.active
                                    ? "Deactivate"
                                    : "Activate"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* =================================
                DOCTOR MANAGEMENT - STEP 20
            ================================== */}

            <DoctorManagement
              departments={departments}
              refreshStats={loadDashboardStats}
            />

            <DoctorAvailabilityManagement doctors={doctors} />

            {/* =================================
                RECEPTIONIST MANAGEMENT - STEP 20
            ================================== */}

            <ReceptionistManagement refreshStats={loadDashboardStats} />

            <PatientManagement />

            <AppointmentManagement />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
