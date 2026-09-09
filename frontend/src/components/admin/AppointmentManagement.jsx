import { useEffect, useState } from "react";

import { getAllAppointments } from "../../services/adminService";

function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllAppointments();

      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments", err);

      setError("Unable to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appointment) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      appointment.patientName?.toLowerCase().includes(searchValue) ||
      appointment.doctorName?.toLowerCase().includes(searchValue) ||
      appointment.departmentName?.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "ALL" || appointment.appointmentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mt-10">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-900">
          Appointment Management
        </h2>

        <p className="mt-1 text-slate-600">
          View and monitor hospital appointments.
        </p>
      </div>

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                All Appointments
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Total: {appointments.length}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search patient, doctor or department"
                className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-slate-300 px-4 py-3"
              >
                <option value="ALL">All Status</option>

                <option value="BOOKED">Booked</option>

                <option value="COMPLETED">Completed</option>

                <option value="CANCELLED">Cancelled</option>

                <option value="NO_SHOW">No Show</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-blue-600">
            Loading appointments...
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No appointments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-4">Appointment</th>

                  <th className="px-5 py-4">Patient</th>

                  <th className="px-5 py-4">Doctor</th>

                  <th className="px-5 py-4">Date & Time</th>

                  <th className="px-5 py-4">Status</th>

                  <th className="px-5 py-4">Arrival</th>
                </tr>
              </thead>

              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment.appointmentId}
                    className="border-t border-slate-100"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium">
                        #{appointment.appointmentId}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {appointment.reasonCategory}
                      </p>
                    </td>

                    <td className="px-5 py-4">{appointment.patientName}</td>

                    <td className="px-5 py-4">
                      <p>{appointment.doctorName}</p>

                      <p className="text-sm text-slate-500">
                        {appointment.departmentName}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p>{appointment.appointmentDate}</p>

                      <p className="text-sm text-slate-500">
                        {appointment.appointmentTime}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-xs font-medium bg-slate-100 px-3 py-1 rounded-full">
                        {appointment.appointmentStatus}
                      </span>
                    </td>

                    <td className="px-5 py-4">{appointment.arrivalStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentManagement;
