import React, { useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { confirmDeposit } from "../api/walletApi";
import { COLORS, SIZES, SHADOW } from "../theme/theme";
import logo from "../assets/logo.png";
import { Image } from "react-native";
export default function PaymentScreen({ route, navigation }) {
  const { transactionId, amount } = route.params;
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    try {
      setLoading(true);

      await confirmDeposit(transactionId);

      Alert.alert("Success", "Payment successful");

      navigation.navigate("Home", { refresh: true });

    } catch (err) {
      Alert.alert("Error", "Payment failed");
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
      <Text style={styles.title}>Payment</Text>
      <Text style={styles.subtitle}>Complete your deposit</Text>
    </View>

    {/* AMOUNT CARD */}
    <View style={styles.card}>
      <Text style={styles.label}>Amount</Text>
      <Text style={styles.amount}>
        {Number(amount).toLocaleString()} ₫
      </Text>
    </View>

    {/* INPUTS */}
    <View style={styles.inputContainer}>
      <TextInput placeholder="Card Number" style={styles.input} />
    </View>

    <View style={styles.inputContainer}>
      <TextInput placeholder="MM/YY" style={styles.input} />
    </View>

    <View style={styles.inputContainer}>
      <TextInput
        placeholder="CVV"
        style={styles.input}
        secureTextEntry
      />
    </View>

    {/* BUTTON */}
    {loading ? (
      <ActivityIndicator style={{ marginTop: 10 }} />
    ) : (
      <TouchableOpacity style={styles.button} onPress={handlePay}>
        <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>
    )}

    {/* CANCEL */}
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.cancel}
    >
      <Text style={styles.cancelText}>Cancel</Text>
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
    width: 70,
    height: 70,
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

  card: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: SIZES.radius,
    marginBottom: 20,
    ...SHADOW,
  },

  label: {
    color: "#ccc",
  },

  amount: {
    color: "white",
    fontSize: 26,
    fontWeight: "700",
    marginTop: 5,
  },

  inputContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
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

  cancel: {
    marginTop: 15,
    alignItems: "center",
  },

  cancelText: {
    color: "red",
  },
});