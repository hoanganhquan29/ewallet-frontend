import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

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
    <View style={{ padding: 20 }}>
      <Text>Receiver Email</Text>
      <TextInput
        value={receiverEmail}
        onChangeText={setReceiverEmail}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Text>Amount</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 20 }}
      />

      <TouchableOpacity
        onPress={handleSendOtp}
        disabled={loading}
        style={{ backgroundColor: "blue", padding: 15 }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white" }}>Send OTP</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
