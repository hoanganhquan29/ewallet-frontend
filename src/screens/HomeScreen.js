import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

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
        <Text style={{ fontSize: 30, marginVertical: 20 }}>{balance} VND</Text>
      )}

      <TouchableOpacity
        onPress={loadBalance}
        style={{
          backgroundColor: "green",
          padding: 10,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "white" }}>Refresh</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Transfer")}
        style={{ backgroundColor: "blue", padding: 10 }}
      >
        <Text style={{ color: "white" }}>Transfer</Text>
      </TouchableOpacity>
    </View>
  );
}
