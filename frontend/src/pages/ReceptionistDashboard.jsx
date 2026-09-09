import { useEffect, useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";

import {
  getTodaysAppointments,
  searchAppointmentsByName,
  searchAppointmentsByPhone,
  getReceptionistAppointment,
  markPatientArrived,
  markPatientNoShow,
} from "../services/receptionistService";

function ReceptionistDashboard() {
  const user = JSON.parse(
    localStorage.getItem("vitalcareUser")
  );

  const [appointments, setAppointments] =
    useState([]);

  const [searchType, setSearchType] =
    useState("name");

  const [searchValue, setSearchValue] =
    useState("");

  const [
    selectedAppointment,
    setSelectedAppointment,
  ] = useState(null);

  const [
    markingArrivalId,
    setMarkingArrivalId,
  ] = useState(null);

  const [
    markingNoShowId,
    setMarkingNoShowId,
  ] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =========================
  // LOAD TODAY'S APPOINTMENTS
  // =========================

  const loadTodaysAppointments =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getTodaysAppointments();

        setAppointments(data);

      } catch (err) {
        console.error(
          "Failed to load today's appointments",
          err
        );

        setError(
          "Unable to load today's appointments."
        );

      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadTodaysAppointments();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const handleSearch =
    async (event) => {
      event.preventDefault();

      setError("");
      setSuccess("");

      if (!searchValue.trim()) {
        await loadTodaysAppointments();
        return;
      }

      try {
        setLoading(true);

        let data;

        if (searchType === "name") {
          data =
            await searchAppointmentsByName(
              searchValue
            );
        } else {
          data =
            await searchAppointmentsByPhone(
              searchValue
            );
        }

        setAppointments(data);

      } catch (err) {
        console.error(
          "Failed to search appointments",
          err
        );

        setError(
          "Unable to search appointments."
        );

      } finally {
        setLoading(false);
      }
    };

  // =========================
  // CLEAR SEARCH
  // =========================

  const handleClearSearch =
    async () => {
      setSearchValue("");
      setError("");
      setSuccess("");

      await loadTodaysAppointments();
    };

  // =========================
  // VIEW APPOINTMENT DETAILS
  // =========================

  const handleViewAppointment =
    async (appointmentId) => {
      try {
        setError("");

        const data =
          await getReceptionistAppointment(
            appointmentId
          );

        setSelectedAppointment(data);

      } catch (err) {
        console.error(
          "Failed to load appointment details",
          err
        );

        setError(
          "Unable to load appointment details."
        );
      }
    };

  // =========================
  // MARK PATIENT ARRIVED
  // =========================

  const handleMarkArrived =
    async (appointmentId) => {
      const confirmed =
        window.confirm(
          "Confirm that the patient has arrived at the hospital?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setError("");
        setSuccess("");

        setMarkingArrivalId(
          appointmentId
        );

        const updatedAppointment =
          await markPatientArrived(
            appointmentId
          );

        setSuccess(
          "Patient marked as arrived successfully."
        );

        setSelectedAppointment(
          updatedAppointment
        );

        await loadTodaysAppointments();

      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to mark patient as arrived.";

        setError(message);

      } finally {
        setMarkingArrivalId(null);
      }
    };

  // =========================
  // CHECK NO-SHOW ELIGIBILITY
  // =========================

  const canMarkNoShow =
    (appointment) => {
      if (!appointment) {
        return false;
      }

      if (
        appointment.appointmentStatus !==
          "BOOKED" ||
        appointment.arrivalStatus !==
          "PENDING"
      ) {
        return false;
      }

      const appointmentDateTime =
        new Date(
          `${appointment.appointmentDate}T${appointment.appointmentTime}`
        );

      const noShowAllowedTime =
        new Date(
          appointmentDateTime.getTime() +
            15 * 60 * 1000
        );

      return (
        new Date() >=
        noShowAllowedTime
      );
    };

  // =========================
  // MARK NO SHOW
  // =========================

  const handleMarkNoShow =
    async (appointmentId) => {
      const confirmed =
        window.confirm(
          "Mark this patient as No Show?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setError("");
        setSuccess("");

        setMarkingNoShowId(
          appointmentId
        );

        await markPatientNoShow(
          appointmentId
        );

        setSuccess(
          "Patient marked as No Show."
        );

        // Close modal because this appointment
        // is no longer part of the active queue.
        setSelectedAppointment(null);

        await loadTodaysAppointments();

      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to mark patient as No Show.";

        setError(message);

      } finally {
        setMarkingNoShowId(null);
      }
    };

  return (
    <div className="min-h-screen bg-slate-50">

      <DashboardNavbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* =========================
            HEADER
        ========================== */}

        <div className="mb-10">

          <p className="text-sm font-medium text-blue-600">
            Receptionist Portal
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Welcome, {user?.fullName}
          </h1>

          <p className="mt-2 text-slate-600">
            Manage today's appointments
            and verify patient arrivals.
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
            SEARCH
        ========================== */}

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-900">
            Search Patient Appointment
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Search today's appointments
            using patient name or phone.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-5 flex flex-col md:flex-row gap-3"
          >

            <select
              value={searchType}
              onChange={(event) =>
                setSearchType(
                  event.target.value
                )
              }
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            >

              <option value="name">
                Patient Name
              </option>

              <option value="phone">
                Phone Number
              </option>

            </select>

            <input
              type="text"
              value={searchValue}
              onChange={(event) =>
                setSearchValue(
                  event.target.value
                )
              }
              placeholder={
                searchType === "name"
                  ? "Enter patient name"
                  : "Enter phone number"
              }
              className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Search
            </button>

            <button
              type="button"
              onClick={
                handleClearSearch
              }
              className="border border-slate-300 px-6 py-3 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Clear
            </button>

          </form>

        </div>

        {/* =========================
            TODAY'S APPOINTMENTS
        ========================== */}

        <div className="mt-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-200">

            <h2 className="text-2xl font-bold text-slate-900">
              Today's Appointments
            </h2>

            <p className="mt-1 text-slate-600">
              Review active appointments
              and confirm patient arrival.
            </p>

          </div>

          {loading && (
            <div className="p-8 text-center text-blue-600">
              Loading appointments...
            </div>
          )}

          {!loading &&
            appointments.length === 0 && (

            <div className="p-10 text-center">
              <p className="text-slate-500">
                No active appointments found.
              </p>
            </div>

          )}

          {!loading &&
            appointments.length > 0 && (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="bg-slate-50 border-b border-slate-200">

                  <tr>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Time
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Patient
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Doctor
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Department
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Status
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Arrival
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {appointments.map(
                    (appointment) => (

                    <tr
                      key={
                        appointment.appointmentId
                      }
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >

                      <td className="px-6 py-4 font-medium text-slate-900">
                        {
                          appointment.appointmentTime
                        }
                      </td>

                      <td className="px-6 py-4">

                        <p className="font-medium text-slate-900">
                          {
                            appointment.patientName
                          }
                        </p>

                        <p className="text-sm text-slate-500">
                          {
                            appointment.patientPhone
                          }
                        </p>

                      </td>

                      <td className="px-6 py-4 text-slate-700">
                        {
                          appointment.doctorName
                        }
                      </td>

                      <td className="px-6 py-4 text-slate-700">
                        {
                          appointment.departmentName
                        }
                      </td>

                      <td className="px-6 py-4">

                        <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-medium">
                          {
                            appointment.appointmentStatus
                          }
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={
                            appointment.arrivalStatus ===
                            "ARRIVED"
                              ? "bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full font-medium"
                              : "bg-amber-50 text-amber-700 text-xs px-3 py-1 rounded-full font-medium"
                          }
                        >
                          {
                            appointment.arrivalStatus
                          }
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <button
                          type="button"
                          onClick={() =>
                            handleViewAppointment(
                              appointment.appointmentId
                            )
                          }
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          View
                        </button>

                      </td>

                    </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* =========================
          APPOINTMENT DETAILS MODAL
      ========================== */}

      {selectedAppointment && (

        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">

          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}

            <div className="px-7 py-5 border-b border-slate-200 flex justify-between items-center">

              <div>

                <h2 className="text-2xl font-bold text-slate-900">
                  Appointment Details
                </h2>

                <p className="text-sm text-slate-500 mt-1">

                  Appointment #

                  {
                    selectedAppointment
                      .appointmentId
                  }

                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedAppointment(
                    null
                  )
                }
                className="text-xl text-slate-500 hover:text-slate-900"
              >
                ✕
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="p-7">

              <div className="grid sm:grid-cols-2 gap-6">

                <div>

                  <p className="text-xs uppercase font-semibold text-slate-500">
                    Patient Name
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {
                      selectedAppointment
                        .patientName
                    }
                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase font-semibold text-slate-500">
                    Patient ID
                  </p>

                  <p className="mt-1 text-slate-900">
                    {
                      selectedAppointment
                        .patientId
                    }
                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase font-semibold text-slate-500">
                    Phone
                  </p>

                  <p className="mt-1 text-slate-900">
                    {
                      selectedAppointment
                        .patientPhone
                    }
                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase font-semibold text-slate-500">
                    Gender
                  </p>

                  <p className="mt-1 text-slate-900">
                    {
                      selectedAppointment
                        .patientGender
                    }
                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase font-semibold text-slate-500">
                    Doctor
                  </p>

                  <p className="mt-1 text-slate-900">
                    {
                      selectedAppointment
                        .doctorName
                    }
                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase font-semibold text-slate-500">
                    Department
                  </p>

                  <p className="mt-1 text-slate-900">
                    {
                      selectedAppointment
                        .departmentName
                    }
                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase font-semibold text-slate-500">
                    Date
                  </p>

                  <p className="mt-1 text-slate-900">
                    {
                      selectedAppointment
                        .appointmentDate
                    }
                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase font-semibold text-slate-500">
                    Time
                  </p>

                  <p className="mt-1 text-slate-900">
                    {
                      selectedAppointment
                        .appointmentTime
                    }
                  </p>

                </div>

              </div>

              {/* =========================
                  REASON
              ========================== */}

              <div className="mt-7 border-t border-slate-200 pt-6">

                <p className="text-xs uppercase font-semibold text-slate-500">
                  Reason for Visit
                </p>

                <p className="mt-2 font-medium text-slate-900">
                  {
                    selectedAppointment
                      .reasonCategory
                  }
                </p>

                {selectedAppointment
                  .reasonDetails && (

                  <p className="mt-2 text-slate-600">
                    {
                      selectedAppointment
                        .reasonDetails
                    }
                  </p>

                )}

              </div>

              {/* =========================
                  ARRIVAL
              ========================== */}

              <div className="mt-7 border-t border-slate-200 pt-6">

                <p className="text-sm font-medium text-slate-700">
                  Arrival Status
                </p>

                <p className="mt-2">

                  <span
                    className={
                      selectedAppointment
                        .arrivalStatus ===
                      "ARRIVED"
                        ? "bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                        : "bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-medium"
                    }
                  >

                    {
                      selectedAppointment
                        .arrivalStatus
                    }

                  </span>

                </p>

                {selectedAppointment
                  .arrivedAt && (

                  <p className="mt-3 text-sm text-slate-500">

                    Arrived at:{" "}

                    {
                      selectedAppointment
                        .arrivedAt
                    }

                  </p>

                )}

              </div>

              {/* =========================
                  ACTION BUTTONS
              ========================== */}

              <div className="mt-8 flex flex-wrap justify-end gap-3">

                {/* CLOSE */}

                <button
                  type="button"
                  onClick={() =>
                    setSelectedAppointment(
                      null
                    )
                  }
                  className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>

                {/* MARK ARRIVED */}

                {selectedAppointment
                  .appointmentStatus ===
                  "BOOKED" &&
                  selectedAppointment
                    .arrivalStatus ===
                    "PENDING" && (

                  <button
                    type="button"
                    disabled={
                      markingArrivalId ===
                      selectedAppointment
                        .appointmentId
                    }
                    onClick={() =>
                      handleMarkArrived(
                        selectedAppointment
                          .appointmentId
                      )
                    }
                    className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >

                    {markingArrivalId ===
                    selectedAppointment
                      .appointmentId
                      ? "Marking..."
                      : "Mark as Arrived"}

                  </button>

                )}

                {/* MARK NO SHOW */}

                {canMarkNoShow(
                  selectedAppointment
                ) && (

                  <button
                    type="button"
                    onClick={() =>
                      handleMarkNoShow(
                        selectedAppointment
                          .appointmentId
                      )
                    }
                    disabled={
                      markingNoShowId ===
                      selectedAppointment
                        .appointmentId
                    }
                    className="px-5 py-2.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium disabled:opacity-50"
                  >

                    {markingNoShowId ===
                    selectedAppointment
                      .appointmentId
                      ? "Updating..."
                      : "Mark No Show"}

                  </button>

                )}

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default ReceptionistDashboard;