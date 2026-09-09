import { useEffect, useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";

import {
  getArrivedPatients,
  createPrescription,
} from "../services/doctorService";

function DoctorDashboard() {
  const user = JSON.parse(localStorage.getItem("vitalcareUser"));

  const doctorId = user?.profileId;

  // =========================
  // DATA STATES
  // =========================

  const [patients, setPatients] = useState([]);

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // =========================
  // CONSULTATION STATES
  // =========================

  const [diagnosis, setDiagnosis] = useState("");

  const [consultationNotes, setConsultationNotes] = useState("");

  const [generalAdvice, setGeneralAdvice] = useState("");

  const [followUpDate, setFollowUpDate] = useState("");

  const [medicines, setMedicines] = useState([
    {
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    },
  ]);

  // =========================
  // UI STATES
  // =========================

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // =========================
  // LOAD ARRIVED PATIENTS
  // =========================

  const loadArrivedPatients = async () => {
    if (!doctorId) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getArrivedPatients(doctorId);

      setPatients(data);
    } catch (err) {
      console.error("Failed to load arrived patients", err);

      setError("Unable to load today's patients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArrivedPatients();
  }, []);

  // =========================
  // OPEN CONSULTATION
  // =========================

  const handleOpenConsultation = (appointment) => {
    setSelectedAppointment(appointment);

    setDiagnosis("");
    setConsultationNotes("");
    setGeneralAdvice("");
    setFollowUpDate("");

    setMedicines([
      {
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);

    setError("");
    setSuccess("");
  };

  // =========================
  // CLOSE CONSULTATION
  // =========================

  const handleCloseConsultation = () => {
    setSelectedAppointment(null);

    setDiagnosis("");
    setConsultationNotes("");
    setGeneralAdvice("");
    setFollowUpDate("");

    setMedicines([
      {
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);
  };

  // =========================
  // MEDICINE CHANGE
  // =========================

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = medicines.map((medicine, medicineIndex) =>
      medicineIndex === index
        ? {
            ...medicine,
            [field]: value,
          }
        : medicine,
    );

    setMedicines(updatedMedicines);
  };

  // =========================
  // ADD MEDICINE
  // =========================

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      {
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);
  };

  // =========================
  // REMOVE MEDICINE
  // =========================

  const removeMedicine = (index) => {
    if (medicines.length === 1) {
      setMedicines([
        {
          medicineName: "",
          dosage: "",
          frequency: "",
          duration: "",
          instructions: "",
        },
      ]);

      return;
    }

    const updatedMedicines = medicines.filter(
      (_, medicineIndex) => medicineIndex !== index,
    );

    setMedicines(updatedMedicines);
  };

  // =========================
  // SAVE PRESCRIPTION
  // =========================

  const handleSavePrescription = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedAppointment) {
      setError("No appointment selected.");

      return;
    }

    if (!diagnosis.trim()) {
      setError("Please enter the diagnosis.");

      return;
    }

    const validMedicines = medicines.filter((medicine) =>
      medicine.medicineName.trim(),
    );

    const prescriptionData = {
      appointmentId: selectedAppointment.appointmentId,

      diagnosis: diagnosis,

      consultationNotes: consultationNotes,

      generalAdvice: generalAdvice,

      followUpDate: followUpDate,

      medicines: validMedicines,
    };

    try {
      setSaving(true);

      await createPrescription(prescriptionData);

      setSuccess("Prescription saved successfully. Consultation completed.");

      await loadArrivedPatients();

      setTimeout(() => {
        handleCloseConsultation();
      }, 1200);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to save prescription.";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // TODAY
  // =========================

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* =========================
            HEADER
        ========================== */}

        <div className="mb-10">
          <p className="text-sm font-medium text-blue-600">Doctor Portal</p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Welcome, {user?.fullName}
          </h1>

          <p className="mt-2 text-slate-600">
            View arrived patients and complete consultations.
          </p>
        </div>

        {/* =========================
            MESSAGES
        ========================== */}

        {error && !selectedAppointment && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* =========================
            SUMMARY CARD
        ========================== */}

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Waiting Patients</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {patients.length}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Doctor</p>

            <p className="mt-2 text-lg font-semibold text-slate-900">
              {user?.fullName}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Date</p>

            <p className="mt-2 text-lg font-semibold text-slate-900">
              {getTodayDate()}
            </p>
          </div>
        </div>

        {/* =========================
            PATIENT QUEUE
        ========================== */}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">
              Today's Arrived Patients
            </h2>

            <p className="mt-1 text-slate-600">
              Patients who have been verified by reception and are ready for
              consultation.
            </p>
          </div>

          {loading && (
            <div className="p-10 text-center text-blue-600">
              Loading patients...
            </div>
          )}

          {!loading && patients.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-lg font-medium text-slate-700">
                No patients waiting.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Arrived patients will appear here after receptionist
                verification.
              </p>
            </div>
          )}

          {!loading && patients.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Appointment
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Patient
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Reason
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
                  {patients.map((appointment) => (
                    <tr
                      key={appointment.appointmentId}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">
                          {appointment.appointmentTime}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          Appointment #{appointment.appointmentId}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">
                          {appointment.patientName}
                        </p>

                        <p className="text-sm text-slate-500">
                          {appointment.patientPhone}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-slate-700">
                          {appointment.reasonCategory}
                        </p>

                        {appointment.reasonDetails && (
                          <p className="text-sm text-slate-500 mt-1 max-w-xs">
                            {appointment.reasonDetails}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                          ARRIVED
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleOpenConsultation(appointment)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                          Start Consultation
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

      {/* =========================
          CONSULTATION MODAL
      ========================== */}

      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4 py-6">
          <div className="bg-white w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-xl">
            {/* =====================
                MODAL HEADER
            ====================== */}

            <div className="px-7 py-5 border-b border-slate-200 flex justify-between gap-5 items-start">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Consultation
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {selectedAppointment.patientName}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Appointment #{selectedAppointment.appointmentId}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseConsultation}
                className="text-xl text-slate-500 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="p-7">
              {/* =====================
                  PATIENT DETAILS
              ====================== */}

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-900 mb-4">
                  Patient & Appointment Details
                </h3>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div>
                    <p className="text-xs uppercase font-semibold text-slate-500">
                      Patient ID
                    </p>

                    <p className="mt-1 text-slate-900">
                      {selectedAppointment.patientId}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase font-semibold text-slate-500">
                      Phone
                    </p>

                    <p className="mt-1 text-slate-900">
                      {selectedAppointment.patientPhone}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase font-semibold text-slate-500">
                      Gender
                    </p>

                    <p className="mt-1 text-slate-900">
                      {selectedAppointment.patientGender}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase font-semibold text-slate-500">
                      DOB
                    </p>

                    <p className="mt-1 text-slate-900">
                      {selectedAppointment.patientDateOfBirth || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase font-semibold text-slate-500">
                      Date
                    </p>

                    <p className="mt-1 text-slate-900">
                      {selectedAppointment.appointmentDate}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase font-semibold text-slate-500">
                      Time
                    </p>

                    <p className="mt-1 text-slate-900">
                      {selectedAppointment.appointmentTime}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs uppercase font-semibold text-slate-500">
                      Reason
                    </p>

                    <p className="mt-1 text-slate-900">
                      {selectedAppointment.reasonCategory}
                    </p>

                    {selectedAppointment.reasonDetails && (
                      <p className="mt-1 text-sm text-slate-600">
                        {selectedAppointment.reasonDetails}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* =====================
                  FORM
              ====================== */}

              <form
                onSubmit={handleSavePrescription}
                className="mt-7 space-y-7"
              >
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    {success}
                  </div>
                )}

                {/* =====================
                    DIAGNOSIS
                ====================== */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Diagnosis
                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(event) => setDiagnosis(event.target.value)}
                    placeholder="Enter diagnosis"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* =====================
                    CONSULTATION NOTES
                ====================== */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Consultation Notes
                  </label>

                  <textarea
                    rows="4"
                    value={consultationNotes}
                    onChange={(event) =>
                      setConsultationNotes(event.target.value)
                    }
                    placeholder="Enter symptoms, examination findings or consultation notes"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* =====================
                    MEDICINES
                ====================== */}

                <div>
                  {/* MEDICINE SECTION HEADER */}

                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900">
                      Medicines
                    </h3>

                    <p className="text-sm text-slate-500">
                      Add medicines if required.
                    </p>
                  </div>

                  {/* MEDICINE CARDS */}

                  <div className="space-y-5">
                    {medicines.map((medicine, index) => (
                      <div
                        key={index}
                        className="border border-slate-200 bg-slate-50 rounded-xl p-5"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-slate-800">
                            Medicine {index + 1}
                          </h4>

                          <button
                            type="button"
                            onClick={() => removeMedicine(index)}
                            className="text-red-600 text-sm hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          {/* MEDICINE NAME */}

                          <div>
                            <label className="block text-sm text-slate-600 mb-1">
                              Medicine Name
                            </label>

                            <input
                              type="text"
                              value={medicine.medicineName}
                              onChange={(event) =>
                                handleMedicineChange(
                                  index,
                                  "medicineName",
                                  event.target.value,
                                )
                              }
                              placeholder="e.g. Cetirizine 10mg"
                              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
                            />
                          </div>

                          {/* DOSAGE */}

                          <div>
                            <label className="block text-sm text-slate-600 mb-1">
                              Dosage
                            </label>

                            <input
                              type="text"
                              value={medicine.dosage}
                              onChange={(event) =>
                                handleMedicineChange(
                                  index,
                                  "dosage",
                                  event.target.value,
                                )
                              }
                              placeholder="e.g. 1 tablet"
                              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
                            />
                          </div>

                          {/* FREQUENCY */}

                          <div>
                            <label className="block text-sm text-slate-600 mb-1">
                              Frequency
                            </label>

                            <input
                              type="text"
                              value={medicine.frequency}
                              onChange={(event) =>
                                handleMedicineChange(
                                  index,
                                  "frequency",
                                  event.target.value,
                                )
                              }
                              placeholder="e.g. Twice daily"
                              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
                            />
                          </div>

                          {/* DURATION */}

                          <div>
                            <label className="block text-sm text-slate-600 mb-1">
                              Duration
                            </label>

                            <input
                              type="text"
                              value={medicine.duration}
                              onChange={(event) =>
                                handleMedicineChange(
                                  index,
                                  "duration",
                                  event.target.value,
                                )
                              }
                              placeholder="e.g. 5 days"
                              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
                            />
                          </div>

                          {/* INSTRUCTIONS */}

                          <div className="md:col-span-2">
                            <label className="block text-sm text-slate-600 mb-1">
                              Instructions
                            </label>

                            <input
                              type="text"
                              value={medicine.instructions}
                              onChange={(event) =>
                                handleMedicineChange(
                                  index,
                                  "instructions",
                                  event.target.value,
                                )
                              }
                              placeholder="e.g. Take after dinner"
                              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* =====================
                      ADD MEDICINE BUTTON
                  ====================== */}

                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={addMedicine}
                      className="px-4 py-2.5 border border-blue-200 text-blue-600 bg-blue-50 rounded-lg text-sm font-medium hover:bg-blue-100"
                    >
                      + Add Medicine
                    </button>
                  </div>
                </div>

                {/* =====================
                    GENERAL ADVICE
                ====================== */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    General Advice
                  </label>

                  <textarea
                    rows="3"
                    value={generalAdvice}
                    onChange={(event) => setGeneralAdvice(event.target.value)}
                    placeholder="Enter diet, rest or general medical advice"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* =====================
                    FOLLOW-UP
                ====================== */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Follow-up Date
                  </label>

                  <input
                    type="date"
                    value={followUpDate}
                    min={getTodayDate()}
                    onChange={(event) => setFollowUpDate(event.target.value)}
                    className="w-full md:w-72 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* =====================
                    ACTIONS
                ====================== */}

                <div className="border-t border-slate-200 pt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseConsultation}
                    disabled={saving}
                    className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving
                      ? "Saving Prescription..."
                      : "Save Prescription & Complete"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
