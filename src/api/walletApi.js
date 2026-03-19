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

export const requestDeposit = async (amount) => {
  const res = await axiosClient.post("/wallet/deposit/request", {
    amount,
  });
  return res.data;
};

export const confirmDeposit = async (transactionId) => {
  return axiosClient.post("/wallet/deposit/callback", {
    transactionId: transactionId,
    status: "SUCCESS",
     signature: "fake-sign",
  });
};
