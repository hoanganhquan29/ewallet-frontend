import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
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
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.innerContainer}>
            
            {/* HEADER SECTION */}
            <View style={styles.header}>
              <View style={styles.logoWrapper}>
                <Image source={logo} style={styles.logo} />
              </View>
              <Text style={styles.headerSubtitle}>Security First</Text>
              <Text style={styles.headerTitle}>Login Verification</Text>
              <Text style={styles.description}>
                We've sent a unique verification code to your email address:
              </Text>
              <Text style={styles.emailText}>{email}</Text>
            </View>

            {/* INPUT SECTION */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Verification Code</Text>
              <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
                <TextInput
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  placeholder="000 000"
                  placeholderTextColor="#AEAEB2"
                  style={styles.input}
                  maxLength={6}
                />
              </View>
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}
            </View>

            {/* ACTION SECTION */}
            <View style={styles.footer}>
              {loading ? (
                <ActivityIndicator color="#000" size="large" />
              ) : (
                <TouchableOpacity
                  onPress={handleVerify}
                  style={styles.button}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>Verify and Login</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backButtonText}>Back to login</Text>
              </TouchableOpacity>
            </View>

          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 40,
  },
  logoWrapper: {
    backgroundColor: "#F2F2F7",
    padding: 10,
    borderRadius: 14,
    marginBottom: 20,
  },
  logo: {
    width: 44,
    height: 44,
    resizeMode: "contain",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1C1C1E",
    marginTop: 4,
  },
  description: {
    fontSize: 15,
    color: "#636366",
    marginTop: 12,
    lineHeight: 22,
  },
  emailText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
    marginTop: 4,
  },
  inputSection: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  inputWrapper: {
    backgroundColor: "#F2F2F7",
    borderRadius: 18,
    height: 70,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputError: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF2F2",
  },
  input: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    letterSpacing: 8,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
    fontWeight: "500",
  },
  footer: {
    width: '100%',
  },
  button: {
    backgroundColor: "#000000",
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  backButton: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 10,
  },
  backButtonText: {
    color: "#8E8E93",
    fontSize: 14,
    fontWeight: "600",
  },
});