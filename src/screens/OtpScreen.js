import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { verifyTransfer } from "../api/walletApi";

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
    <View style={{ padding: 20 }}>
      <Text>Enter OTP</Text>

      <TextInput
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 20 }}
      />

      <TouchableOpacity
        onPress={handleVerify}
        disabled={loading}
        style={{ backgroundColor: "green", padding: 15 }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white" }}>Confirm Transfer</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
