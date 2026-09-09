import api from "./api";

export const getArrivedPatients = async (
  doctorId
) => {
  const response = await api.get(
    `/consultations/doctor/${doctorId}/arrived`
  );

  return response.data;
};

export const createPrescription = async (
  prescriptionData
) => {
  const response = await api.post(
    "/consultations/prescriptions",
    prescriptionData
  );

  return response.data;
};

export const getPrescriptionByAppointment = async (
  appointmentId
) => {
  const response = await api.get(
    `/consultations/prescriptions/appointment/${appointmentId}`
  );

  return response.data;
};