import api from "./api";

export const registerPatient = async (patientData) => {
  const response = await api.post("/auth/register/patient", patientData);

  return response.data;
};

export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);

  return response.data;
};

export const setupInitialAdmin = async (adminData) => {
  const response = await api.post("/auth/setup-admin", adminData);

  return response.data;
};
