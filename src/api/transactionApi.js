import axiosClient from "./axiosClient";

export const getTransactions = (page = 0, size = 10) => {
  return axiosClient.get(`/wallet/transactions?page=${page}&size=${size}`);
};
