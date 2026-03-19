import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  Button,
  StyleSheet,
} from "react-native";

import { getBalance } from "../api/walletApi";

export default function HomeScreen({ navigation }) {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadBalance = async () => {
    try {
      setLoading(true);

      const res = await getBalance();

      console.log("BALANCE:", res.data);

      setBalance(res.data);
    } catch (err) {
      console.log("ERROR:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBalance();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Wallet Balance</Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text style={{ fontSize: 30, marginVertical: 20 }}>
          {balance} VND
        </Text>
      )}

      {/* 🔥 DEPOSIT BUTTON */}
      <TouchableOpacity
        style={styles.depositButton}
        onPress={() => navigation.navigate("Deposit")}
      >
        <Text style={styles.depositText}>Deposit</Text>
      </TouchableOpacity>

      {/* Refresh */}
      <TouchableOpacity
        onPress={loadBalance}
        style={{
          backgroundColor: "green",
          padding: 10,
          marginVertical: 10,
        }}
      >
        <Text style={{ color: "white" }}>Refresh</Text>
      </TouchableOpacity>

      {/* Transactions */}
      <Button
        title="View Transactions"
        onPress={() => navigation.navigate("Transactions")}
      />

      {/* Transfer */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Transfer")}
        style={{ backgroundColor: "blue", padding: 10, marginTop: 10 }}
      >
        <Text style={{ color: "white" }}>Transfer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  depositButton: {
    backgroundColor: "#00c853",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  depositText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});