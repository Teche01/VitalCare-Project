import {
  useEffect,
  useState,
} from "react";

import {
  getPatientProfile,
  updatePatientProfile,
} from "../services/patientService";

function PatientProfile({
  patientId,
}) {

  const [profile, setProfile] =
    useState(null);

  const [formData, setFormData] =
    useState({
      fullName: "",
      dateOfBirth: "",
      gender: "",
      phone: "",
      address: "",
    });

  const [editing, setEditing] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =========================
  // LOAD PROFILE
  // =========================

  const loadProfile =
    async () => {

      if (!patientId) {
        return;
      }

      try {

        setLoading(true);
        setError("");

        const data =
          await getPatientProfile(
            patientId
          );

        setProfile(data);

        setFormData({
          fullName:
            data.fullName || "",

          dateOfBirth:
            data.dateOfBirth || "",

          gender:
            data.gender || "",

          phone:
            data.phone || "",

          address:
            data.address || "",
        });

      } catch (err) {

        const message =
          err.response?.data?.message ||
          "Unable to load profile.";

        setError(message);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {
    loadProfile();
  }, [patientId]);

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange =
    (event) => {

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

  // =========================
  // UPDATE
  // =========================

  const handleUpdate =
    async (event) => {

      event.preventDefault();

      try {

        setSaving(true);
        setError("");
        setSuccess("");

        const updatedProfile =
          await updatePatientProfile(
            patientId,
            formData
          );

        setProfile(
          updatedProfile
        );

        setEditing(false);

        setSuccess(
          "Profile updated successfully."
        );

        // Update displayed navbar name too

        const storedUser =
          JSON.parse(
            localStorage.getItem(
              "vitalcareUser"
            )
          );

        if (storedUser) {

          storedUser.fullName =
            updatedProfile.fullName;

          localStorage.setItem(
            "vitalcareUser",
            JSON.stringify(
              storedUser
            )
          );
        }

      } catch (err) {

        const message =
          err.response?.data?.message ||
          "Unable to update profile.";

        setError(message);

      } finally {

        setSaving(false);
      }
    };

  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancel =
    () => {

      setEditing(false);
      setError("");

      setFormData({
        fullName:
          profile?.fullName || "",

        dateOfBirth:
          profile?.dateOfBirth || "",

        gender:
          profile?.gender || "",

        phone:
          profile?.phone || "",

        address:
          profile?.address || "",
      });
    };

  if (loading) {

    return (
      <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-8 text-center text-blue-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="mt-10">

      <div className="mb-5">

        <h2 className="text-2xl font-bold text-slate-900">
          My Profile
        </h2>

        <p className="mt-1 text-slate-600">
          View and update your personal information.
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

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-7">

        {!editing ? (

          <>
            <div className="grid md:grid-cols-2 gap-6">

              <div>

                <p className="text-sm text-slate-500">
                  Patient ID
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {profile?.patientId}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Full Name
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {profile?.fullName}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Email
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {profile?.email}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Phone
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {profile?.phone}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Date of Birth
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {profile?.dateOfBirth}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Gender
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {profile?.gender}
                </p>

              </div>

              <div className="md:col-span-2">

                <p className="text-sm text-slate-500">
                  Address
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {profile?.address || "-"}
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() => {
                setEditing(true);
                setSuccess("");
              }}
              className="mt-7 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </>

        ) : (

          <form
            onSubmit={handleUpdate}
            className="space-y-5"
          >

            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="w-full border border-slate-200 bg-slate-100 rounded-lg px-4 py-3 text-slate-500"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3"
                >

                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3"
                />

              </div>

              <div className="md:col-span-2">

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 resize-none"
                />

              </div>

            </div>

            <div className="flex gap-3">

              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="bg-slate-100 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>

            </div>

          </form>

        )}

      </div>

    </div>
  );
}

export default PatientProfile;