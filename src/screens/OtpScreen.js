import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet, 
    Image,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback, 
    Keyboard
} from "react-native";
import { COLORS, SIZES, SHADOW } from "../theme/theme";
import logo from "../assets/logo.png";
import { verifyTransfer } from "../api/walletApi";

export default function OtpScreen({ route, navigation }) {
  const { receiverEmail, amount } = route.params;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp) {
      return Alert.alert("Error", "Please enter the OTP");
    }

    try {
      setLoading(true);

      await verifyTransfer({
        receiverEmail,
        amount: Number(amount),
        otp,
      });

      Alert.alert("Success", "Transfer completed successfully");
      navigation.navigate("Home");
    } catch (err) {
      Alert.alert(
        "Error",
        JSON.stringify(err.response?.data || "Verification failed"),
      );
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
              <Text style={styles.headerSubtitle}>Security Verification</Text>
              <Text style={styles.headerTitle}>Verify OTP</Text>
              <Text style={styles.description}>
                A 6-digit code has been sent to your email. Please enter it below to confirm your transfer.
              </Text>
            </View>

            {/* TRANSACTION SUMMARY INFO */}
            <View style={styles.infoBox}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Recipient</Text>
                <Text style={styles.infoValue} numberOfLines={1}>{receiverEmail}</Text>
              </View>
              <View style={[styles.infoItem, { borderBottomWidth: 0 }]}>
                <Text style={styles.infoLabel}>Amount</Text>
                <Text style={styles.infoValue}>{Number(amount).toLocaleString()} ₫</Text>
              </View>
            </View>

            {/* OTP INPUT SECTION */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Enter Code</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  placeholder="000000"
                  placeholderTextColor="#AEAEB2"
                  maxLength={6}
                  style={styles.otpInput}
                  selectionColor="#000"
                />
              </View>
            </View>

            {/* ACTION SECTION */}
            <View style={styles.footer}>
              {loading ? (
                <ActivityIndicator color="#000" size="large" />
              ) : (
                <TouchableOpacity
                  onPress={handleVerify}
                  style={styles.confirmButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>Confirm Transfer</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={styles.resendLink}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.resendLinkText}>Back to Transfer</Text>
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
    marginBottom: 32,
  },
  logoWrapper: {
    backgroundColor: "#F2F2F7",
    padding: 10,
    borderRadius: 14,
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
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
  infoBox: {
    backgroundColor: "#F9F9F9",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginBottom: 32,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  infoLabel: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#1C1C1E",
    fontWeight: "700",
    maxWidth: '70%',
  },
  inputSection: {
    marginBottom: 40,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 12,
    textTransform: "uppercase",
    textAlign: 'center',
  },
  inputWrapper: {
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInput: {
    fontSize: 36,
    fontWeight: "800",
    color: "#000",
    textAlign: "center",
    letterSpacing: 10, // Tạo khoảng cách giữa các số OTP
    width: '100%',
  },
  footer: {
    width: '100%',
  },
  confirmButton: {
    backgroundColor: "#000000",
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  resendLink: {
    marginTop: 20,
    alignItems: "center",
  },
  resendLinkText: {
    color: "#8E8E93",
    fontSize: 14,
    fontWeight: "600",
  },
});