import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../api/authApi";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Please fill all fields");
    }

    try {
      setLoading(true);
await AsyncStorage.removeItem("token");
      console.log("Sending:", { email, password });

      const res = await login({ email, password });

      console.log("RESPONSE:", res.data);

      const raw = res.data;

      console.log("RAW RESPONSE:", raw);

      // backend trả dạng: "token.xxx"
      let token = raw;

      if (raw.startsWith("token.")) {
        token = raw.replace("token.", "");
      }

      await AsyncStorage.setItem("token", token);

      if (!token) {
        throw new Error("Token not found in response");
      }

      await AsyncStorage.setItem("token", token);

const decoded = jwtDecode(token);
console.log("DECODED TOKEN:", decoded);


if (!decoded.userId) {
  Alert.alert("ERROR", "JWT không có userId → backend chưa đúng");
  return;
}
      navigation.replace("Home");
    } catch (err) {
      console.log("ERROR FULL:", err);
      console.log("ERROR RESPONSE:", err.response?.data);
      console.log("STATUS:", err.response?.status);

      Alert.alert(
        "Login failed",
        JSON.stringify(err.response?.data || err.message),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 20 }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: "blue",
          padding: 15,
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white" }}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
