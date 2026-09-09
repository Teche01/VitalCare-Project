import { useEffect, useState } from "react";

import {
  getAllDoctors,
  createDoctor,
  changeDoctorStatus,
} from "../../services/adminService";

function DoctorManagement({
  departments,
  refreshStats,
}) {

  const [doctors, setDoctors] =
    useState([]);

  const [formData, setFormData] =
    useState({
      fullName: "",
      email: "",
      password: "",
      departmentId: "",
      specialization: "",
      qualification: "",
      experienceYears: "",
      phone: "",
      consultationDurationMinutes: 20,
    });

  const [creating, setCreating] =
    useState(false);

  const [
    changingDoctorId,
    setChangingDoctorId,
  ] = useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const loadDoctors = async () => {

    try {

      const data =
        await getAllDoctors();

      setDoctors(data);

    } catch (err) {

      console.error(
        "Failed to load doctors",
        err
      );

      setError(
        "Unable to load doctors."
      );
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  const handleCreateDoctor =
    async (event) => {

      event.preventDefault();

      setError("");
      setSuccess("");

      const doctorData = {

        fullName:
          formData.fullName,

        email:
          formData.email,

        password:
          formData.password,

        departmentId:
          Number(
            formData.departmentId
          ),

        specialization:
          formData.specialization,

        qualification:
          formData.qualification,

        experienceYears:
          formData.experienceYears
            ? Number(
                formData.experienceYears
              )
            : 0,

        phone:
          formData.phone,

        consultationDurationMinutes:
          Number(
            formData
              .consultationDurationMinutes
          ),
      };

      try {

        setCreating(true);

        await createDoctor(
          doctorData
        );

        setSuccess(
          "Doctor account created successfully."
        );

        setFormData({
          fullName: "",
          email: "",
          password: "",
          departmentId: "",
          specialization: "",
          qualification: "",
          experienceYears: "",
          phone: "",
          consultationDurationMinutes: 20,
        });

        await loadDoctors();

        if (refreshStats) {
          await refreshStats();
        }

      } catch (err) {

        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to create doctor.";

        setError(message);

      } finally {

        setCreating(false);
      }
    };

  const handleStatusChange =
    async (
      doctorId,
      currentStatus
    ) => {

      const newStatus =
        !currentStatus;

      const confirmed =
        window.confirm(
          newStatus
            ? "Activate this doctor?"
            : "Deactivate this doctor?"
        );

      if (!confirmed) {
        return;
      }

      try {

        setChangingDoctorId(
          doctorId
        );

        setError("");
        setSuccess("");

        await changeDoctorStatus(
          doctorId,
          newStatus
        );

        setSuccess(
          newStatus
            ? "Doctor activated successfully."
            : "Doctor deactivated successfully."
        );

        await loadDoctors();

      } catch (err) {

        setError(
          "Unable to change doctor status."
        );

      } finally {

        setChangingDoctorId(
          null
        );
      }
    };

  return (
    <div className="mt-10">

      <div className="mb-5">

        <h2 className="text-2xl font-bold text-slate-900">
          Doctor Management
        </h2>

        <p className="mt-1 text-slate-600">
          Create doctor accounts and
          assign them to hospital departments.
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

        {/* CREATE DOCTOR */}

        <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">

          <h3 className="text-xl font-bold text-slate-900">
            Add Doctor
          </h3>

          <form
            onSubmit={
              handleCreateDoctor
            }
            className="mt-6 space-y-4"
          >

            <input
              type="text"
              name="fullName"
              value={
                formData.fullName
              }
              onChange={
                handleChange
              }
              placeholder="Doctor full name"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            />

            <input
              type="email"
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              placeholder="Email"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            />

            <input
              type="password"
              name="password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              placeholder="Initial password"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            />

            <select
              name="departmentId"
              value={
                formData.departmentId
              }
              onChange={
                handleChange
              }
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            >

              <option value="">
                Select Department
              </option>

              {departments
                .filter(
                  (department) =>
                    department.active
                )
                .map(
                  (department) => (

                    <option
                      key={
                        department.departmentId
                      }
                      value={
                        department.departmentId
                      }
                    >
                      {
                        department.departmentName
                      }
                    </option>

                  )
                )}

            </select>

            <input
              type="text"
              name="specialization"
              value={
                formData.specialization
              }
              onChange={
                handleChange
              }
              placeholder="Specialization"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            />

            <input
              type="text"
              name="qualification"
              value={
                formData.qualification
              }
              onChange={
                handleChange
              }
              placeholder="Qualification"
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            />

            <input
              type="number"
              name="experienceYears"
              value={
                formData.experienceYears
              }
              onChange={
                handleChange
              }
              min="0"
              placeholder="Experience in years"
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            />

            <input
              type="tel"
              name="phone"
              value={
                formData.phone
              }
              onChange={
                handleChange
              }
              placeholder="Phone number"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            />

            <div>

              <label className="block text-sm text-slate-600 mb-2">
                Consultation Duration
              </label>

              <select
                name="consultationDurationMinutes"
                value={
                  formData
                    .consultationDurationMinutes
                }
                onChange={
                  handleChange
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
              >

                <option value="15">
                  15 Minutes
                </option>

                <option value="20">
                  20 Minutes
                </option>

                <option value="30">
                  30 Minutes
                </option>

                <option value="45">
                  45 Minutes
                </option>

              </select>

            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >

              {creating
                ? "Creating Doctor..."
                : "Create Doctor"}

            </button>

          </form>

        </div>

        {/* DOCTOR LIST */}

        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-200">

            <h3 className="text-xl font-bold text-slate-900">
              Doctors
            </h3>

          </div>

          {doctors.length === 0 ? (

            <div className="p-10 text-center text-slate-500">
              No doctors created yet.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="px-5 py-4">
                      Doctor
                    </th>

                    <th className="px-5 py-4">
                      Department
                    </th>

                    <th className="px-5 py-4">
                      Specialization
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {doctors.map(
                    (doctor) => (

                    <tr
                      key={
                        doctor.doctorId
                      }
                      className="border-t border-slate-100"
                    >

                      <td className="px-5 py-4">

                        <p className="font-medium">
                          {
                            doctor.fullName
                          }
                        </p>

                        <p className="text-sm text-slate-500">
                          {doctor.email}
                        </p>

                      </td>

                      <td className="px-5 py-4">
                        {
                          doctor.departmentName
                        }
                      </td>

                      <td className="px-5 py-4">
                        {
                          doctor.specialization
                        }
                      </td>

                      <td className="px-5 py-4">

                        {doctor.active
                          ? "ACTIVE"
                          : "INACTIVE"}

                      </td>

                      <td className="px-5 py-4">

                        <button
                          type="button"
                          disabled={
                            changingDoctorId ===
                            doctor.doctorId
                          }
                          onClick={() =>
                            handleStatusChange(
                              doctor.doctorId,
                              doctor.active
                            )
                          }
                          className={
                            doctor.active
                              ? "text-red-600 font-medium"
                              : "text-green-600 font-medium"
                          }
                        >

                          {doctor.active
                            ? "Deactivate"
                            : "Activate"}

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

export default DoctorManagement;