import axiosClient from "./axiosClient";

export const login = (data) => {
  return axiosClient.post("/auth/login", data);
};

export const register = (data) => {
  return axiosClient.post("/auth/register", data);
};

export const verifyOtp = (email, otp) => {
  return axiosClient.post("/auth/verify-otp", {
    email,
    otp
  });
};