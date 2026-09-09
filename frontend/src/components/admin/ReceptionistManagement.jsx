import { useEffect, useState } from "react";

import {
  getAllReceptionists,
  createReceptionist,
  changeReceptionistStatus,
} from "../../services/adminService";

function ReceptionistManagement({
  refreshStats,
}) {

  const [receptionists, setReceptionists] =
    useState([]);

  const [formData, setFormData] =
    useState({
      fullName: "",
      email: "",
      password: "",
      phone: "",
    });

  const [creating, setCreating] =
    useState(false);

  const [
    changingReceptionistId,
    setChangingReceptionistId,
  ] = useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const loadReceptionists =
    async () => {

      try {

        const data =
          await getAllReceptionists();

        setReceptionists(data);

      } catch (err) {

        console.error(
          "Failed to load receptionists",
          err
        );

        setError(
          "Unable to load receptionists."
        );
      }
    };

  useEffect(() => {
    loadReceptionists();
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

  const handleCreateReceptionist =
    async (event) => {

      event.preventDefault();

      setError("");
      setSuccess("");

      try {

        setCreating(true);

        await createReceptionist(
          formData
        );

        setSuccess(
          "Receptionist account created successfully."
        );

        setFormData({
          fullName: "",
          email: "",
          password: "",
          phone: "",
        });

        await loadReceptionists();

        if (refreshStats) {
          await refreshStats();
        }

      } catch (err) {

        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to create receptionist.";

        setError(message);

      } finally {

        setCreating(false);
      }
    };

  const handleStatusChange =
    async (
      receptionistId,
      currentStatus
    ) => {

      const newStatus =
        !currentStatus;

      const confirmed =
        window.confirm(
          newStatus
            ? "Activate this receptionist?"
            : "Deactivate this receptionist?"
        );

      if (!confirmed) {
        return;
      }

      try {

        setChangingReceptionistId(
          receptionistId
        );

        setError("");
        setSuccess("");

        await changeReceptionistStatus(
          receptionistId,
          newStatus
        );

        setSuccess(
          newStatus
            ? "Receptionist activated successfully."
            : "Receptionist deactivated successfully."
        );

        await loadReceptionists();

      } catch (err) {

        setError(
          "Unable to update receptionist status."
        );

      } finally {

        setChangingReceptionistId(
          null
        );
      }
    };

  return (
    <div className="mt-10">

      <div className="mb-5">

        <h2 className="text-2xl font-bold text-slate-900">
          Receptionist Management
        </h2>

        <p className="mt-1 text-slate-600">
          Create and manage hospital
          receptionist accounts.
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

        {/* CREATE */}

        <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">

          <h3 className="text-xl font-bold text-slate-900">
            Add Receptionist
          </h3>

          <form
            onSubmit={
              handleCreateReceptionist
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
              placeholder="Full name"
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

            <button
              type="submit"
              disabled={creating}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >

              {creating
                ? "Creating..."
                : "Create Receptionist"}

            </button>

          </form>

        </div>

        {/* LIST */}

        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-200">

            <h3 className="text-xl font-bold text-slate-900">
              Receptionists
            </h3>

          </div>

          {receptionists.length === 0 ? (

            <div className="p-10 text-center text-slate-500">
              No receptionists created yet.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="px-5 py-4">
                      Name
                    </th>

                    <th className="px-5 py-4">
                      Email
                    </th>

                    <th className="px-5 py-4">
                      Phone
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

                  {receptionists.map(
                    (receptionist) => (

                    <tr
                      key={
                        receptionist.receptionistId
                      }
                      className="border-t border-slate-100"
                    >

                      <td className="px-5 py-4 font-medium">
                        {
                          receptionist.fullName
                        }
                      </td>

                      <td className="px-5 py-4">
                        {
                          receptionist.email
                        }
                      </td>

                      <td className="px-5 py-4">
                        {
                          receptionist.phone
                        }
                      </td>

                      <td className="px-5 py-4">

                        {receptionist.active
                          ? "ACTIVE"
                          : "INACTIVE"}

                      </td>

                      <td className="px-5 py-4">

                        <button
                          type="button"
                          disabled={
                            changingReceptionistId ===
                            receptionist.receptionistId
                          }
                          onClick={() =>
                            handleStatusChange(
                              receptionist.receptionistId,
                              receptionist.active
                            )
                          }
                          className={
                            receptionist.active
                              ? "text-red-600 font-medium"
                              : "text-green-600 font-medium"
                          }
                        >

                          {receptionist.active
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

export default ReceptionistManagement;