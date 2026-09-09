import { useEffect, useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import PatientProfile from "../components/PatientProfile";
import { downloadPrescriptionPdf } from "../utils/prescriptionPdf";

import {
  getActiveDepartments,
  getDoctorsByDepartment,
  getDoctorSlots,
  bookAppointment,
  getPatientAppointments,
  cancelAppointment,
  getPatientPrescriptions,
} from "../services/patientService";

function PatientDashboard() {
  const user = JSON.parse(localStorage.getItem("vitalcareUser"));

  const patientId = user?.profileId;

  // =========================
  // DATA STATES
  // =========================

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  // =========================
  // BOOKING FORM STATES
  // =========================

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reasonCategory, setReasonCategory] = useState("");
  const [reasonDetails, setReasonDetails] = useState("");

  // =========================
  // PRESCRIPTION STATE
  // =========================

  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // =========================
  // LOADING STATES
  // =========================

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [cancellingAppointmentId, setCancellingAppointmentId] = useState(null);

  // =========================
  // MESSAGE STATES
  // =========================

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // REASON OPTIONS
  // =========================

  const reasonOptions = [
    {
      value: "GENERAL_CONSULTATION",
      label: "General Consultation",
    },
    {
      value: "FEVER",
      label: "Fever",
    },
    {
      value: "COLD_COUGH",
      label: "Cold / Cough",
    },
    {
      value: "HEADACHE",
      label: "Headache",
    },
    {
      value: "CHEST_PAIN",
      label: "Chest Pain",
    },
    {
      value: "BREATHING_DIFFICULTY",
      label: "Breathing Difficulty",
    },
    {
      value: "HIGH_BLOOD_PRESSURE",
      label: "High Blood Pressure",
    },
    {
      value: "SKIN_RASH_ITCHING",
      label: "Skin Rash / Itching",
    },
    {
      value: "HAIR_SCALP_PROBLEM",
      label: "Hair / Scalp Problem",
    },
    {
      value: "STOMACH_PAIN",
      label: "Stomach Pain",
    },
    {
      value: "DIGESTIVE_PROBLEM",
      label: "Digestive Problem",
    },
    {
      value: "JOINT_PAIN",
      label: "Joint Pain",
    },
    {
      value: "BACK_PAIN",
      label: "Back Pain",
    },
    {
      value: "BONE_INJURY",
      label: "Bone Injury",
    },
    {
      value: "EAR_PROBLEM",
      label: "Ear Problem",
    },
    {
      value: "NOSE_SINUS_PROBLEM",
      label: "Nose / Sinus Problem",
    },
    {
      value: "THROAT_PROBLEM",
      label: "Throat Problem",
    },
    {
      value: "EYE_PROBLEM",
      label: "Eye Problem",
    },
    {
      value: "VISION_PROBLEM",
      label: "Vision Problem",
    },
    {
      value: "CHILD_HEALTH_CONSULTATION",
      label: "Child Health Consultation",
    },
    {
      value: "WOMENS_HEALTH_CONSULTATION",
      label: "Women's Health Consultation",
    },
    {
      value: "ROUTINE_CHECKUP",
      label: "Routine Check-up",
    },
    {
      value: "FOLLOW_UP_CONSULTATION",
      label: "Follow-up Consultation",
    },
    {
      value: "OTHER",
      label: "Other",
    },
  ];

  // =========================
  // LOAD DEPARTMENTS
  // =========================

  const loadDepartments = async () => {
    try {
      const data = await getActiveDepartments();

      setDepartments(data);
    } catch (err) {
      console.error("Failed to load departments", err);
    }
  };

  // =========================
  // LOAD APPOINTMENTS
  // =========================

  const loadAppointments = async () => {
    if (!patientId) {
      return;
    }

    try {
      const data = await getPatientAppointments(patientId);

      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments", err);
    }
  };

  // =========================
  // LOAD PRESCRIPTIONS
  // =========================

  const loadPrescriptions = async () => {
    if (!patientId) {
      return;
    }

    try {
      const data = await getPatientPrescriptions(patientId);

      setPrescriptions(data);
    } catch (err) {
      console.error("Failed to load prescriptions", err);
    }
  };

  // =========================
  // LOAD PAGE DATA
  // =========================

  useEffect(() => {
    loadDepartments();
    loadAppointments();
    loadPrescriptions();
  }, []);

  // =========================
  // DEPARTMENT CHANGE
  // =========================

  const handleDepartmentChange = async (event) => {
    const departmentId = event.target.value;

    setSelectedDepartment(departmentId);

    setSelectedDoctor("");
    setSelectedDate("");
    setSelectedTime("");
    setSlots([]);

    if (!departmentId) {
      setDoctors([]);
      return;
    }

    try {
      setError("");

      const data = await getDoctorsByDepartment(departmentId);

      setDoctors(data);
    } catch (err) {
      setDoctors([]);

      setError("Unable to load doctors.");
    }
  };

  // =========================
  // LOAD DOCTOR SLOTS
  // =========================

  const loadSlots = async (doctorId, date) => {
    if (!doctorId || !date) {
      setSlots([]);
      return;
    }

    try {
      setLoadingSlots(true);
      setError("");

      const data = await getDoctorSlots(doctorId, date);

      setSlots(data);
    } catch (err) {
      setSlots([]);

      setError("Unable to load appointment slots.");
    } finally {
      setLoadingSlots(false);
    }
  };

  // =========================
  // DOCTOR CHANGE
  // =========================

  const handleDoctorChange = (event) => {
    const doctorId = event.target.value;

    setSelectedDoctor(doctorId);
    setSelectedTime("");

    loadSlots(doctorId, selectedDate);
  };

  // =========================
  // DATE CHANGE
  // =========================

  const handleDateChange = (event) => {
    const date = event.target.value;

    setSelectedDate(date);
    setSelectedTime("");

    loadSlots(selectedDoctor, date);
  };

  // =========================
  // REASON CHANGE
  // =========================

  const handleReasonChange = (event) => {
    const reason = event.target.value;

    setReasonCategory(reason);

    if (reason !== "OTHER") {
      setReasonDetails("");
    }
  };

  // =========================
  // BOOK APPOINTMENT
  // =========================

  const handleBooking = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !selectedDepartment ||
      !selectedDoctor ||
      !selectedDate ||
      !selectedTime ||
      !reasonCategory
    ) {
      setError("Please complete all required appointment details.");
      return;
    }

    if (reasonCategory === "OTHER" && !reasonDetails.trim()) {
      setError("Please describe your symptoms or concern.");
      return;
    }

    const appointmentData = {
      patientId: patientId,
      doctorId: Number(selectedDoctor),
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      reasonCategory: reasonCategory,
      reasonDetails: reasonDetails,
    };

    try {
      setBooking(true);

      await bookAppointment(appointmentData);

      setSuccess("Appointment booked successfully.");

      setSelectedTime("");
      setReasonCategory("");
      setReasonDetails("");

      await loadSlots(selectedDoctor, selectedDate);
      await loadAppointments();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to book appointment.";

      setError(message);
    } finally {
      setBooking(false);
    }
  };

  // =========================
  // CANCEL APPOINTMENT
  // =========================

  const handleCancelAppointment = async (appointmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      setCancellingAppointmentId(appointmentId);

      await cancelAppointment(appointmentId, patientId);

      setSuccess("Appointment cancelled successfully.");

      await loadAppointments();

      if (selectedDoctor && selectedDate) {
        await loadSlots(selectedDoctor, selectedDate);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to cancel appointment.";

      setError(message);
    } finally {
      setCancellingAppointmentId(null);
    }
  };

  // =========================
  // FIND PRESCRIPTION
  // =========================

  const getPrescriptionForAppointment = (appointmentId) => {
    return prescriptions.find(
      (prescription) => prescription.appointmentId === appointmentId,
    );
  };

  // =========================
  // GET TODAY'S DATE
  // =========================

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* WELCOME */}

        <div className="mb-10">
          <p className="text-sm font-medium text-blue-600">Patient Portal</p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Welcome, {user?.fullName}
          </h1>

          <p className="mt-2 text-slate-600">
            Book appointments and view your consultation schedule.
          </p>
        </div>

        {/* PATIENT PROFILE */}

        <div className="mb-8">
          <PatientProfile />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* =========================
              BOOK APPOINTMENT
          ========================== */}

          <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Book Appointment
            </h2>

            <p className="mt-1 text-slate-600">
              Select your department, doctor and preferred time.
            </p>

            {error && (
              <div className="mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <form onSubmit={handleBooking} className="mt-7 space-y-6">
              {/* DEPARTMENT */}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Department
                </label>

                <select
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select Department</option>

                  {departments.map((department) => (
                    <option
                      key={department.departmentId}
                      value={department.departmentId}
                    >
                      {department.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              {/* DOCTOR */}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Doctor
                </label>

                <select
                  value={selectedDoctor}
                  onChange={handleDoctorChange}
                  required
                  disabled={!selectedDepartment}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select Doctor</option>

                  {doctors.map((doctor) => (
                    <option key={doctor.doctorId} value={doctor.doctorId}>
                      {doctor.fullName}
                      {" - "}
                      {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              {/* DATE */}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Appointment Date
                </label>

                <input
                  type="date"
                  value={selectedDate}
                  min={getTodayDate()}
                  disabled={!selectedDoctor}
                  onChange={handleDateChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none disabled:bg-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* TIME SLOTS */}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Available Time Slots
                </label>

                {!selectedDate && (
                  <p className="text-sm text-slate-500">
                    Select a doctor and date to view available slots.
                  </p>
                )}

                {loadingSlots && (
                  <p className="text-sm text-blue-600">Loading slots...</p>
                )}

                {!loadingSlots && selectedDate && slots.length === 0 && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-4 py-3 text-sm">
                    No appointment slots are available for this date.
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={
                        selectedTime === slot.time
                          ? "px-4 py-2 rounded-lg bg-blue-600 text-white"
                          : slot.available
                            ? "px-4 py-2 rounded-lg border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100"
                            : "px-4 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                      }
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* SELECTED SLOT */}

              {selectedTime && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-sm text-blue-700 font-medium">
                    Selected Appointment
                  </p>

                  <p className="mt-1 text-slate-700">
                    {selectedDate} at {selectedTime}
                  </p>
                </div>
              )}

              {/* REASON */}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason for Visit
                </label>

                <select
                  value={reasonCategory}
                  onChange={handleReasonChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select Reason</option>

                  {reasonOptions.map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* OTHER DETAILS */}

              {reasonCategory === "OTHER" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Describe Your Symptoms or Concern
                    <span className="text-red-500"> *</span>
                  </label>

                  <textarea
                    rows="4"
                    value={reasonDetails}
                    onChange={(event) => setReasonDetails(event.target.value)}
                    placeholder="Briefly describe your symptoms or concern"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              )}

              {/* BOOK */}

              <button
                type="submit"
                disabled={booking || !selectedTime}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {booking ? "Booking Appointment..." : "Confirm Appointment"}
              </button>
            </form>
          </div>

          {/* =========================
              MY APPOINTMENTS
          ========================== */}

          <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              My Appointments
            </h2>

            <p className="mt-1 text-slate-600">
              View your appointment history and status.
            </p>

            <div className="mt-7 space-y-4">
              {appointments.length === 0 && (
                <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center">
                  <p className="text-slate-500">No appointments found.</p>
                </div>
              )}

              {appointments.map((appointment) => {
                const prescription = getPrescriptionForAppointment(
                  appointment.appointmentId,
                );

                return (
                  <div
                    key={appointment.appointmentId}
                    className="border border-slate-200 rounded-xl p-5"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg text-slate-900">
                          {appointment.doctorName}
                        </h3>

                        <p className="text-sm text-blue-600 mt-1">
                          {appointment.departmentName}
                        </p>
                      </div>

                      <span className="h-fit bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1 rounded-full">
                        {appointment.appointmentStatus}
                      </span>
                    </div>

                    <div className="mt-4 text-sm text-slate-600 space-y-1">
                      <p>
                        <span className="font-medium text-slate-700">
                          Date:
                        </span>{" "}
                        {appointment.appointmentDate}
                      </p>

                      <p>
                        <span className="font-medium text-slate-700">
                          Time:
                        </span>{" "}
                        {appointment.appointmentTime}
                      </p>

                      <p>
                        <span className="font-medium text-slate-700">
                          Reason:
                        </span>{" "}
                        {appointment.reasonCategory}
                      </p>

                      {appointment.reasonDetails && (
                        <p>
                          <span className="font-medium text-slate-700">
                            Details:
                          </span>{" "}
                          {appointment.reasonDetails}
                        </p>
                      )}

                      <p>
                        <span className="font-medium text-slate-700">
                          Arrival:
                        </span>{" "}
                        {appointment.arrivalStatus}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {appointment.appointmentStatus === "BOOKED" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleCancelAppointment(appointment.appointmentId)
                          }
                          disabled={
                            cancellingAppointmentId ===
                            appointment.appointmentId
                          }
                          className="px-4 py-2 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-sm font-medium disabled:opacity-50"
                        >
                          {cancellingAppointmentId === appointment.appointmentId
                            ? "Cancelling..."
                            : "Cancel Appointment"}
                        </button>
                      )}

                      {prescription && (
                        <button
                          type="button"
                          onClick={() => setSelectedPrescription(prescription)}
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium"
                        >
                          View Prescription
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          PRESCRIPTION MODAL
      ========================== */}

      {selectedPrescription && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            <div className="border-b border-slate-200 px-7 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  VitalCare Prescription
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Prescription #{selectedPrescription.prescriptionId}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPrescription(null)}
                className="text-slate-500 hover:text-slate-900 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-7">
              <div className="grid md:grid-cols-2 gap-5 border-b border-slate-200 pb-6">
                <div>
                  <p className="text-xs uppercase text-slate-500 font-semibold">
                    Patient
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {selectedPrescription.patientName}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-500 font-semibold">
                    Doctor
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {selectedPrescription.doctorName}
                  </p>

                  <p className="text-sm text-slate-500">
                    {selectedPrescription.specialization}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-500 font-semibold">
                    Department
                  </p>

                  <p className="mt-1 text-slate-900">
                    {selectedPrescription.departmentName}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase text-slate-500 font-semibold">
                    Consultation Date
                  </p>

                  <p className="mt-1 text-slate-900">
                    {selectedPrescription.appointmentDate}
                  </p>
                </div>
              </div>

              {/* DIAGNOSIS */}

              <div className="py-6 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Diagnosis</h3>

                <p className="mt-2 text-slate-600">
                  {selectedPrescription.diagnosis || "Not specified"}
                </p>
              </div>

              {/* CONSULTATION NOTES */}

              {selectedPrescription.consultationNotes && (
                <div className="py-6 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900">
                    Consultation Notes
                  </h3>

                  <p className="mt-2 text-slate-600">
                    {selectedPrescription.consultationNotes}
                  </p>
                </div>
              )}

              {/* MEDICINES */}

              <div className="py-6 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Medicines</h3>

                <div className="mt-4 space-y-4">
                  {selectedPrescription.medicines?.length > 0 ? (
                    selectedPrescription.medicines.map((medicine, index) => (
                      <div
                        key={index}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-4"
                      >
                        <p className="font-semibold text-slate-900">
                          {medicine.medicineName}
                        </p>

                        <div className="mt-3 grid sm:grid-cols-3 gap-3 text-sm">
                          <p>
                            <span className="font-medium">Dosage:</span>{" "}
                            {medicine.dosage}
                          </p>

                          <p>
                            <span className="font-medium">Frequency:</span>{" "}
                            {medicine.frequency}
                          </p>

                          <p>
                            <span className="font-medium">Duration:</span>{" "}
                            {medicine.duration}
                          </p>
                        </div>

                        {medicine.instructions && (
                          <p className="mt-3 text-sm text-slate-600">
                            <span className="font-medium text-slate-700">
                              Instructions:
                            </span>{" "}
                            {medicine.instructions}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500">No medicines prescribed.</p>
                  )}
                </div>
              </div>

              {/* GENERAL ADVICE */}

              {selectedPrescription.generalAdvice && (
                <div className="py-6 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900">
                    General Advice
                  </h3>

                  <p className="mt-2 text-slate-600">
                    {selectedPrescription.generalAdvice}
                  </p>
                </div>
              )}

              {/* FOLLOW-UP */}

              {selectedPrescription.followUpDate && (
                <div className="py-6">
                  <h3 className="font-semibold text-slate-900">
                    Follow-up Date
                  </h3>

                  <p className="mt-2 text-blue-600 font-medium">
                    {selectedPrescription.followUpDate}
                  </p>
                </div>
              )}

              {/* BUTTONS */}

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPrescription(null)}
                  className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => downloadPrescriptionPdf(selectedPrescription)}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Download Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;
