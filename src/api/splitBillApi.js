import axiosClient from "./axiosClient";

// CREATE
export const createSplitBill = (data) => {
  return axiosClient.post("/wallet/split-bill", data);
};

// ACCEPT
export const acceptSplit = (detailId) => {
  return axiosClient.post(`/wallet/split-bill/${detailId}/accept`);
};

// REJECT
export const rejectSplit = (detailId) => {
  return axiosClient.post(`/wallet/split-bill/${detailId}/reject`);
};

// ⚠️ CẦN BACKEND CONFIRM
export const getMySplitBills = () => {
  return axiosClient.get("/wallet/split-bill");
};

export const getSplitBillDetail = (id) => {
  return axiosClient.get(`/wallet/split-bill/${id}`);
};