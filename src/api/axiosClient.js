import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://192.168.1.2:8081/api", // 👈 SỬA Ở ĐÂY
});

axiosClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Idempotency-Key"] = Date.now().toString();
  return config;
});

export default axiosClient;
