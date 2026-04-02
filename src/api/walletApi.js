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

export const requestDeposit = async (data) => {
  const res = await axiosClient.post("/wallet/deposit/request", data);
  return res.data;
};

export const confirmDeposit = async (transactionId) => {
  return axiosClient.post("/wallet/deposit/callback", {
    transactionId: transactionId,
    status: "SUCCESS",
     signature: "fake-sign",
  });
};

export const requestMoney = async (receiverEmail, amount) => {
  const idempotencyKey =
    Date.now().toString() + Math.random().toString(36).substring(2);

  return axiosClient.post(
    "/wallet/request-money",
    {
      receiverEmail,
      amount,
    },
    {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    }
  );
};

export const getPendingRequests = async () => {
  return axiosClient.get("/wallet/request-money/pending");
};

export const acceptRequest = async (id) => {
  const key =
    Date.now().toString() + Math.random().toString(36).substring(2);

  return axiosClient.post(
    `/wallet/request-money/${id}/accept`,
    {},
    {
      headers: {
        "Idempotency-Key": key,
      },
    }
  );
};

export const rejectRequest = async (id) => {
  const key =
    Date.now().toString() + Math.random().toString(36).substring(2);

  return axiosClient.post(
    `/wallet/request-money/${id}/reject`,
    {},
    {
      headers: {
        "Idempotency-Key": key,
      },
    }
  );
};
