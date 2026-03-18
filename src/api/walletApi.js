import axiosClient from "./axiosClient";

export const getBalance = () => {
  return axiosClient.get("/wallet/balance");
};
export const requestTransfer = (data) => {
  return axiosClient.post("/wallet/transfer/request", data);
};

export const verifyTransfer = (data) => {
  return axiosClient.post("/wallet/transfer/verify", data);
};
