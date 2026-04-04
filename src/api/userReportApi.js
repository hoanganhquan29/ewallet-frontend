import axiosClient from "./axiosClient";

export const getOverview = (userId) => {
  return axiosClient.get(`/user/report/overview?userId=${userId}`);
};

export const getTimeStats = (userId, start, end) => {
  return axiosClient.get(
    `/user/report/time?userId=${userId}&start=${start}&end=${end}`
  );
};

export const getTrend = (userId, start, end) => {
  return axiosClient.get(
    `/user/report/trend?userId=${userId}&start=${start}&end=${end}`
  );
};

export const getTop = (userId) => {
  return axiosClient.get(`/user/report/top?userId=${userId}`);
};

export const getMonthlyTrend = (userId) => {
  return axiosClient.get(`/user/report/trend/monthly?userId=${userId}`);
};

export const getYearlyTrend = (userId) => {
  return axiosClient.get(`/user/report/trend/yearly?userId=${userId}`);
};