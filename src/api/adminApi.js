import axiosClient from './axiosClient'


export const getUsers = () => {
  return axiosClient.get('/admin/users')
}
export const getAllTransactions = (params) => {
  return axiosClient.get(`/admin/transactions`, {
    params,
  });
};
export const getSuspicious = (page = 0, size = 10) => {
  return axiosClient.get(`/admin/transactions/suspicious?page=${page}&size=${size}`)
}

export const getAuditLogs = ({
  page = 0,
  size = 10,
  action,
  userId,
  from,
  to,
}) => {
  return axiosClient.get("/admin/audit-logs", {
    params: {
      page,
      size,
      action: action || undefined,
      userId: userId || undefined,
      from: from ? `${from}T00:00:00` : undefined,
to: to ? `${to}T23:59:59` : undefined,
    },
  });
};
export const lockUser = async (email) => {
  const res = await axiosClient.post(`/admin/lock/${email}`)
  return res
}

export const unlockUser = (email) => {
  return axiosClient.post(`/admin/unlock/${email}`)
}
export const deleteUser = (email) => {
  return axiosClient.delete(`/admin/users/${email}`)
}
export const updateUser = (email, data) => {
  return axiosClient.put(`/admin/users/${email}`, data)
}