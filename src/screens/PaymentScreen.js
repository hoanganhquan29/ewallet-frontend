import React, { useState } from "react";
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
    <View style={styles.container}>
      <Text style={styles.title}>Fake Payment Gateway</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Amount</Text>
        <Text style={styles.amount}>
          {Number(amount).toLocaleString()} VND
        </Text>
      </View>

      <TextInput placeholder="Card Number" style={styles.input} />
      <TextInput placeholder="MM/YY" style={styles.input} />
      <TextInput placeholder="CVV" style={styles.input} secureTextEntry />

      {loading ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handlePay}>
          <Text style={styles.buttonText}>Pay Now</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.cancel}
      >
        <Text style={{ color: "red" }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f5f7fb",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
  },
  label: {
    color: "gray",
  },
  amount: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#0066ff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  cancel: {
    marginTop: 15,
    alignItems: "center",
  },
});