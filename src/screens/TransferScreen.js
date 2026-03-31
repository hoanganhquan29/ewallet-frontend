import { useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
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
import { requestTransfer } from "../api/walletApi";

export default function TransferScreen({ navigation }) {
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!receiverEmail || !amount) {
      return Alert.alert("Error", "Fill all fields");
    }

    if (Number(amount) <= 0) {
      return Alert.alert("Error", "Amount must > 0");
    }

    try {
      setLoading(true);

      await requestTransfer({
        receiverEmail,
        amount: Number(amount),
      });

      Alert.alert("Success", "OTP sent");

      navigation.navigate("OTP", {
        receiverEmail,
        amount,
      });
    } catch (err) {
      Alert.alert(
        "Error",
        JSON.stringify(err.response?.data || "Transfer failed"),
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
      <Text style={styles.title}>Transfer</Text>
      <Text style={styles.subtitle}>Send money to another user</Text>
    </View>

    {/* RECEIVER */}
    <View style={styles.inputContainer}>
      <TextInput
        value={receiverEmail}
        onChangeText={setReceiverEmail}
        placeholder="Receiver Email"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
      />
    </View>

    {/* AMOUNT */}
    <View style={styles.inputContainer}>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="Enter amount"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
      />
    </View>

    {/* BUTTON */}
    <TouchableOpacity
      onPress={handleSendOtp}
      disabled={loading}
      style={styles.button}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.buttonText}>Send OTP</Text>
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
    marginBottom: 30,
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
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginTop: 10,
    ...SHADOW,
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: "600",
  },
});