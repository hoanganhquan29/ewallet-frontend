import axiosClient from "./axiosClient";

export const getTransactions = (
  page = 0,
  size = 10,
  filters = {}
) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("size", size);

  if (filters.type) params.append("type", filters.type);
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  if (filters.minAmount) params.append("minAmount", filters.minAmount);
  if (filters.maxAmount) params.append("maxAmount", filters.maxAmount);

  return axiosClient.get(`/wallet/transactions?${params.toString()}`);
};