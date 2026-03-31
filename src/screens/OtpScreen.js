import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { StyleSheet, Image } from "react-native";
import { COLORS, SIZES, SHADOW } from "../theme/theme";
import logo from "../assets/logo.png";
import { verifyTransfer } from "../api/walletApi";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
export default function OtpScreen({ route, navigation }) {
  const { receiverEmail, amount } = route.params;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp) {
      return Alert.alert("Error", "Enter OTP");
    }

    try {
      setLoading(true);

      await verifyTransfer({
        receiverEmail,
        amount: Number(amount),
        otp,
      });

      Alert.alert("Success", "Transfer completed");

      navigation.navigate("Home");
    } catch (err) {
      Alert.alert(
        "Error",
        JSON.stringify(err.response?.data || "Verify failed"),
      );
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
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>
        Enter the code sent to your email
      </Text>
    </View>

    {/* INFO */}
    <View style={styles.infoBox}>
      <Text style={styles.infoText}>
        To: {receiverEmail}
      </Text>
      <Text style={styles.infoText}>
        Amount: {Number(amount).toLocaleString()} ₫
      </Text>
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

    {/* BUTTON */}
    <TouchableOpacity
      onPress={handleVerify}
      disabled={loading}
      style={styles.button}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.buttonText}>Confirm Transfer</Text>
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
  },

  infoText: {
    color: COLORS.primary,
    marginBottom: 5,
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
