import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";


const host = Constants.expoConfig.hostUri.split(":")[0];

const axiosClient = axios.create({
  baseURL: `http://${host}:8081/api`,
  headers: {
    "Content-Type": "application/json",
  },
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