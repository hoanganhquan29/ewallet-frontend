import axiosClient from './axiosClient'

export const getUsers = () => {
  return axiosClient.get('/admin/users')
}

export const getAllTransactions = (page = 0) => {
  return axiosClient.get(`/admin/transactions?page=${page}&size=10`)
}

export const getSuspicious = (page = 0, size = 10) => {
  return axiosClient.get(`/admin/transactions/suspicious?page=${page}&size=${size}`)
}

export const getAuditLogs = (page = 0, size = 10) => {
  return axiosClient.get(`/admin/audit-logs?page=${page}&size=${size}`)
}