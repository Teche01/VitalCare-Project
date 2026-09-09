import api from "./api";

export const getTodaysAppointments = async () => {
  const response = await api.get(
    "/receptionist/appointments/today"
  );

  return response.data;
};

export const searchAppointmentsByName = async (
  patientName
) => {
  const response = await api.get(
    "/receptionist/appointments/search/name",
    {
      params: {
        patientName: patientName,
      },
    }
  );

  return response.data;
};

export const searchAppointmentsByPhone = async (
  phone
) => {
  const response = await api.get(
    "/receptionist/appointments/search/phone",
    {
      params: {
        phone: phone,
      },
    }
  );

  return response.data;
};

export const getReceptionistAppointment = async (
  appointmentId
) => {
  const response = await api.get(
    `/receptionist/appointments/${appointmentId}`
  );

  return response.data;
};

export const markPatientArrived = async (
  appointmentId
) => {
  const response = await api.patch(
    `/receptionist/appointments/${appointmentId}/arrived`
  );

  return response.data;
};

export const markPatientNoShow =
  async (appointmentId) => {

    const response = await api.patch(
      `/receptionist/appointments/${appointmentId}/no-show`
    );

    return response.data;
  };