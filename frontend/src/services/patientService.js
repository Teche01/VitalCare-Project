import api from "./api";

export const getActiveDepartments = async () => {
  const response = await api.get(
    "/departments/active"
  );

  return response.data;
};

export const getDoctorsByDepartment = async (
  departmentId
) => {
  const response = await api.get(
    `/doctors/department/${departmentId}`
  );

  return response.data;
};

export const getDoctorSlots = async (
  doctorId,
  date
) => {
  const response = await api.get(
    `/doctor-availability/doctor/${doctorId}/slots`,
    {
      params: {
        date: date,
      },
    }
  );

  return response.data;
};

export const bookAppointment = async (
  appointmentData
) => {
  const response = await api.post(
    "/appointments",
    appointmentData
  );

  return response.data;
};

export const getPatientAppointments = async (
  patientId
) => {
  const response = await api.get(
    `/appointments/patient/${patientId}`
  );

  return response.data;
};

export const cancelAppointment = async (
  appointmentId,
  patientId
) => {

  const response = await api.patch(
    `/appointments/${appointmentId}/cancel`,
    null,
    {
      params: {
        patientId: patientId,
      },
    }
  );

  return response.data;
};

export const getPatientPrescriptions = async (
  patientId
) => {

  const response = await api.get(
    `/consultations/prescriptions/patient/${patientId}`
  );

  return response.data;
};

export const getPatientProfile =
  async (patientId) => {

    const response = await api.get(
      `/patients/${patientId}`
    );

    return response.data;
  };

export const updatePatientProfile =
  async (
    patientId,
    profileData
  ) => {

    const response = await api.put(
      `/patients/${patientId}`,
      profileData
    );

    return response.data;
  };