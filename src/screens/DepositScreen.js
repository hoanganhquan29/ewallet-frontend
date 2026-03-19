import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { requestDeposit } from "../api/walletApi";

export default function DepositScreen({ navigation }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    const numericAmount = parseInt(amount);

    if (!numericAmount || numericAmount < 1000) {
      Alert.alert("Error", "Minimum is 1000 VND");
      return;
    }

    try {
      setLoading(true);

      const res = await requestDeposit(numericAmount);

      navigation.navigate("Payment", {
        transactionId: res.transactionId,
        amount: numericAmount,
      });

    } catch (err) {
      Alert.alert("Error", "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deposit</Text>

      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text style={styles.button} onPress={handleDeposit}>
          Deposit
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "blue",
    color: "white",
    padding: 15,
    textAlign: "center",
    borderRadius: 10,
  },
});