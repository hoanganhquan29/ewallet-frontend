import React, { useState } from "react";
import { useEffect } from "react";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { requestDeposit } from "../api/walletApi";
import { TouchableOpacity } from "react-native";
import { COLORS, SIZES, SHADOW } from "../theme/theme";
export default function DepositScreen({ navigation }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const getReturnUrl = () => {
  const host = Constants.expoConfig?.hostUri;
  return `exp://${host}/--/payment-success`;
};

  /*useEffect(() => {
  const sub = Linking.addEventListener("url", (event) => {
    console.log("DEEPLINK:", event.url);

    if (event.url.includes("payment-success")) {
      navigation.navigate("Home");
    }

    if (event.url.includes("payment-cancel")) {
      navigation.navigate("Home");
    }
  });

  return () => sub.remove();
}, []);*/

  const handleDeposit = async () => {
    const numericAmount = parseInt(amount);

    if (!numericAmount || numericAmount < 1000) {
      Alert.alert("Error", "Minimum is 1000 VND");
      return;
    }

    try {
      setLoading(true);

const successUrl = getReturnUrl();
const cancelUrl = successUrl.replace("payment-success", "payment-cancel");

const res = await requestDeposit({
  amount: numericAmount,
  successUrl,
  cancelUrl,
});

Linking.openURL(res.url);

    } catch (err) {
      Alert.alert("Error", "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
  <View style={styles.container}>

    {/* HEADER */}
    <View style={styles.header}>
      <Text style={styles.title}>Deposit</Text>
      <Text style={styles.subtitle}>Add money to your wallet</Text>
    </View>

    {/* INPUT */}
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
    </View>

    {/* BUTTON */}
    {loading ? (
      <ActivityIndicator style={{ marginTop: 10 }} />
    ) : (
      <TouchableOpacity style={styles.button} onPress={handleDeposit}>
        <Text style={styles.buttonText}>Deposit</Text>
      </TouchableOpacity>
    )}

  </View>
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

  title: {
    fontSize: 28,
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
    marginBottom: 20,
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
    ...SHADOW,
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: "600",
  },
});