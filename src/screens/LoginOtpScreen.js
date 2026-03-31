import { useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

import { verifyOtp } from "../api/authApi";
import { COLORS, SIZES, SHADOW } from "../theme/theme";
import logo from "../assets/logo.png";

export default function LoginOtpScreen({ route, navigation }) {
  const { email } = route.params;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleVerify = async () => {
  if (!otp) {
    setError("Please enter OTP");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const res = await verifyOtp(email, otp.trim());
    const token = res.data;

    await AsyncStorage.setItem("token", token);

    const decoded = jwtDecode(token);

    if (decoded.role === "ADMIN") {
      navigation.replace("AdminHome");
    } else {
      navigation.replace("Home");
    }

  } catch (err) {
    setError(err.response?.data || "Invalid or expired OTP");
  } finally {
    setLoading(false);
  }
};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Login Verification</Text>
        <Text style={styles.subtitle}>
          Enter OTP sent to your email
        </Text>
      </View>

      {/* EMAIL INFO */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>{email}</Text>
      </View>

      {/* INPUT */}
      <View style={styles.inputContainer}>
        <TextInput
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
          placeholder="Enter OTP"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />
      </View>
{error ? (
  <Text style={{ color: "red", textAlign: "center", marginBottom: 10 }}>
    {error}
  </Text>
) : null}
      {/* BUTTON */}
      <TouchableOpacity
        onPress={handleVerify}
        disabled={loading}
        style={styles.button}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Verify Login</Text>
        )}
      </TouchableOpacity>
    </View>
     </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.primary,
  },

  subtitle: {
    color: COLORS.secondary,
    marginTop: 5,
    textAlign: "center",
  },

  infoBox: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    alignItems: "center",
  },

  infoText: {
    color: COLORS.primary,
  },

  inputContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 15,
    paddingHorizontal: 12,
  },

  input: {
    height: 50,
    color: COLORS.primary,
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 5,
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: SIZES.radius,
    alignItems: "center",
    ...SHADOW,
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: "600",
  },
});