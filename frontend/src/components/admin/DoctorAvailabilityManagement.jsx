import { useState } from "react";

import {
  getDoctorAvailability,
  createDoctorAvailability,
  deleteDoctorAvailability,
} from "../../services/adminService";

function DoctorAvailabilityManagement({
  doctors,
}) {

  const [
    selectedDoctor,
    setSelectedDoctor,
  ] = useState("");

  const [
    availabilities,
    setAvailabilities,
  ] = useState([]);

  const [dayOfWeek, setDayOfWeek] =
    useState("");

  const [startTime, setStartTime] =
    useState("");

  const [endTime, setEndTime] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [
    deletingAvailabilityId,
    setDeletingAvailabilityId,
  ] = useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const days = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  // =========================
  // LOAD AVAILABILITY
  // =========================

  const loadAvailability =
    async (doctorId) => {

      if (!doctorId) {

        setAvailabilities([]);
        return;
      }

      try {

        setLoading(true);
        setError("");

        const data =
          await getDoctorAvailability(
            doctorId
          );

        setAvailabilities(data);

      } catch (err) {

        console.error(
          "Failed to load availability",
          err
        );

        setError(
          "Unable to load doctor availability."
        );

      } finally {

        setLoading(false);
      }
    };

  // =========================
  // DOCTOR CHANGE
  // =========================

  const handleDoctorChange =
    async (event) => {

      const doctorId =
        event.target.value;

      setSelectedDoctor(
        doctorId
      );

      setDayOfWeek("");
      setStartTime("");
      setEndTime("");

      await loadAvailability(
        doctorId
      );
    };

  // =========================
  // CREATE AVAILABILITY
  // =========================

  const handleCreateAvailability =
    async (event) => {

      event.preventDefault();

      setError("");
      setSuccess("");

      if (
        !selectedDoctor ||
        !dayOfWeek ||
        !startTime ||
        !endTime
      ) {

        setError(
          "Please complete all availability details."
        );

        return;
      }

      if (startTime >= endTime) {

        setError(
          "End time must be later than start time."
        );

        return;
      }

      const availabilityData = {

        doctorId:
          Number(selectedDoctor),

        dayOfWeek:
          dayOfWeek,

        startTime:
          startTime,

        endTime:
          endTime,
      };

      try {

        setCreating(true);

        await createDoctorAvailability(
          availabilityData
        );

        setSuccess(
          "Doctor availability added successfully."
        );

        setDayOfWeek("");
        setStartTime("");
        setEndTime("");

        await loadAvailability(
          selectedDoctor
        );

      } catch (err) {

        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to add doctor availability.";

        setError(message);

      } finally {

        setCreating(false);
      }
    };

  // =========================
  // DELETE
  // =========================

  const handleDeleteAvailability =
    async (availabilityId) => {

      const confirmed =
        window.confirm(
          "Delete this availability schedule?"
        );

      if (!confirmed) {
        return;
      }

      try {

        setError("");
        setSuccess("");

        setDeletingAvailabilityId(
          availabilityId
        );

        await deleteDoctorAvailability(
          availabilityId
        );

        setSuccess(
          "Availability schedule deleted successfully."
        );

        await loadAvailability(
          selectedDoctor
        );

      } catch (err) {

        setError(
          "Unable to delete availability schedule."
        );

      } finally {

        setDeletingAvailabilityId(
          null
        );
      }
    };

  return (
    <div className="mt-10">

      {/* HEADER */}

      <div className="mb-5">

        <h2 className="text-2xl font-bold text-slate-900">
          Doctor Availability Management
        </h2>

        <p className="mt-1 text-slate-600">
          Configure working days and
          consultation hours for doctors.
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

      <div className="grid lg:grid-cols-3 gap-8">

        {/* =========================
            ADD AVAILABILITY
        ========================== */}

        <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">

          <h3 className="text-xl font-bold text-slate-900">
            Add Availability
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            Choose a doctor and define
            their working hours.
          </p>

          <form
            onSubmit={
              handleCreateAvailability
            }
            className="mt-6 space-y-5"
          >

            {/* DOCTOR */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Doctor
              </label>

              <select
                value={
                  selectedDoctor
                }
                onChange={
                  handleDoctorChange
                }
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
              >

                <option value="">
                  Select Doctor
                </option>

                {doctors
                  .filter(
                    (doctor) =>
                      doctor.active
                  )
                  .map(
                    (doctor) => (

                      <option
                        key={
                          doctor.doctorId
                        }
                        value={
                          doctor.doctorId
                        }
                      >
                        {
                          doctor.fullName
                        }
                        {" - "}
                        {
                          doctor.specialization
                        }
                      </option>

                    )
                  )}

              </select>

            </div>

            {/* DAY */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Day
              </label>

              <select
                value={
                  dayOfWeek
                }
                onChange={(event) =>
                  setDayOfWeek(
                    event.target.value
                  )
                }
                required
                disabled={
                  !selectedDoctor
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 disabled:bg-slate-100"
              >

                <option value="">
                  Select Day
                </option>

                {days.map(
                  (day) => (

                    <option
                      key={day}
                      value={day}
                    >
                      {day}
                    </option>

                  )
                )}

              </select>

            </div>

            {/* START */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Start Time
              </label>

              <input
                type="time"
                value={
                  startTime
                }
                onChange={(event) =>
                  setStartTime(
                    event.target.value
                  )
                }
                disabled={
                  !selectedDoctor
                }
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 disabled:bg-slate-100"
              />

            </div>

            {/* END */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                End Time
              </label>

              <input
                type="time"
                value={
                  endTime
                }
                onChange={(event) =>
                  setEndTime(
                    event.target.value
                  )
                }
                disabled={
                  !selectedDoctor
                }
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 disabled:bg-slate-100"
              />

            </div>

            <button
              type="submit"
              disabled={
                creating ||
                !selectedDoctor
              }
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >

              {creating
                ? "Adding Availability..."
                : "Add Availability"}

            </button>

          </form>

        </div>

        {/* =========================
            EXISTING SCHEDULE
        ========================== */}

        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-200">

            <h3 className="text-xl font-bold text-slate-900">
              Existing Schedule
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              View working hours for the
              selected doctor.
            </p>

          </div>

          {!selectedDoctor && (

            <div className="p-10 text-center text-slate-500">
              Select a doctor to view
              their schedule.
            </div>

          )}

          {selectedDoctor &&
            loading && (

            <div className="p-10 text-center text-blue-600">
              Loading availability...
            </div>

          )}

          {selectedDoctor &&
            !loading &&
            availabilities.length ===
              0 && (

            <div className="p-10 text-center">

              <p className="font-medium text-slate-700">
                No availability configured.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Add the doctor's first
                working schedule using
                the form.
              </p>

            </div>

          )}

          {selectedDoctor &&
            !loading &&
            availabilities.length >
              0 && (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Day
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Start Time
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      End Time
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {availabilities.map(
                    (availability) => (

                    <tr
                      key={
                        availability.availabilityId
                      }
                      className="border-t border-slate-100"
                    >

                      <td className="px-6 py-4 font-medium text-slate-900">
                        {
                          availability.dayOfWeek
                        }
                      </td>

                      <td className="px-6 py-4 text-slate-700">
                        {
                          availability.startTime
                        }
                      </td>

                      <td className="px-6 py-4 text-slate-700">
                        {
                          availability.endTime
                        }
                      </td>

                      <td className="px-6 py-4">

                        <button
                          type="button"
                          disabled={
                            deletingAvailabilityId ===
                            availability.availabilityId
                          }
                          onClick={() =>
                            handleDeleteAvailability(
                              availability.availabilityId
                            )
                          }
                          className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                        >

                          {deletingAvailabilityId ===
                          availability.availabilityId
                            ? "Deleting..."
                            : "Delete"}

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

    </div>
  );
}

export default DoctorAvailabilityManagement;