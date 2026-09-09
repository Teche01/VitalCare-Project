import api from "./api";

export const getAdminDashboardStats = async () => {
  const response = await api.get("/admin/dashboard/stats");

  return response.data;
};

export const getAllDepartments = async () => {
  const response = await api.get("/departments");

  return response.data;
};

export const createDepartment = async (departmentData) => {
  const response = await api.post("/departments", departmentData);

  return response.data;
};

export const changeDepartmentStatus = async (departmentId, active) => {
  const response = await api.patch(
    `/departments/${departmentId}/status`,
    null,
    {
      params: {
        active: active,
      },
    },
  );

  return response.data;
};

export const getAllDoctors = async () => {
  const response = await api.get("/doctors");

  return response.data;
};

export const createDoctor = async (doctorData) => {
  const response = await api.post("/doctors", doctorData);

  return response.data;
};

export const changeDoctorStatus = async (doctorId, active) => {
  const response = await api.patch(`/doctors/${doctorId}/status`, null, {
    params: {
      active: active,
    },
  });

  return response.data;
};

export const getAllReceptionists = async () => {
  const response = await api.get("/admin/receptionists");

  return response.data;
};

export const createReceptionist = async (receptionistData) => {
  const response = await api.post("/admin/receptionists", receptionistData);

  return response.data;
};

export const changeReceptionistStatus = async (receptionistId, active) => {
  const response = await api.patch(
    `/admin/receptionists/${receptionistId}/status`,
    null,
    {
      params: {
        active: active,
      },
    },
  );

  return response.data;
};

export const getDoctorAvailability =
  async (doctorId) => {

    const response = await api.get(
      `/doctor-availability/doctor/${doctorId}`
    );

    return response.data;
  };

export const createDoctorAvailability =
  async (availabilityData) => {

    const response = await api.post(
      "/doctor-availability",
      availabilityData
    );

    return response.data;
  };

export const deleteDoctorAvailability =
  async (availabilityId) => {

    await api.delete(
      `/doctor-availability/${availabilityId}`
    );
  };

export const getAllPatients =
  async () => {

    const response = await api.get(
      "/admin/patients"
    );

    return response.data;
  };

export const getAllAppointments =
  async () => {

    const response = await api.get(
      "/admin/appointments"
    );

    return response.data;
  };