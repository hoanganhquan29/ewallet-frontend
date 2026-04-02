import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { createSplitBill } from "../../api/splitBillApi";

export default function SplitBillCreateScreen({ navigation }) {
  const [emails, setEmails] = useState([]);
  const [inputEmail, setInputEmail] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [equalSplit, setEqualSplit] = useState(true);
  const [customAmounts, setCustomAmounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

  const addEmail = () => {
  if (!inputEmail) return;

  if (!isValidEmail(inputEmail)) {
    setError("Invalid email");
    return;
  }

  if (emails.includes(inputEmail)) {
    setError("Email already added");
    return;
  }

  setEmails([...emails, inputEmail]);
  setInputEmail("");
};

  const handleCustomAmount = (email, value) => {
    setCustomAmounts({
      ...customAmounts,
      [email]: Number(value),
    });
  };

  const handleSubmit = async () => {
    try {
      setError("");

      if (!emails.length) {
        setError("Must add at least 1 user");
        return;
      }

      if (!totalAmount) {
        setError("Enter total amount");
        return;
      }

      if (!equalSplit) {
  if (Object.keys(customAmounts).length !== emails.length) {
    setError("Enter all custom amounts");
    return;
  }

  const totalCustom = Object.values(customAmounts)
    .reduce((sum, val) => sum + val, 0);

  if (totalCustom !== Number(totalAmount)) {
    setError("Custom amounts must equal total");
    return;
  }
}

      setLoading(true);

      const payload = {
        emails,
        totalAmount: Number(totalAmount),
        equalSplit,
        customAmounts: equalSplit ? {} : customAmounts,
      };

      await createSplitBill(payload);

      alert("Created successfully");

      navigation.goBack();

    } catch (err) {
      console.log("CREATE ERROR:", err.response?.data || err.message);
      setError("Create failed");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ marginBottom: 10 }}>
      <Text>{item}</Text>

      {!equalSplit && (
        <TextInput
          placeholder="Amount"
          keyboardType="numeric"
          onChangeText={(val) => handleCustomAmount(item, val)}
          style={{ borderWidth: 1, padding: 5 }}
        />
      )}
    </View>
  );

  return (
    <View style={{ padding: 16 }}>
      <Text>Add Email</Text>

      <TextInput
        value={inputEmail}
        onChangeText={setInputEmail}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Button title="Add" onPress={addEmail} />

      <FlatList
        data={emails}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />

      <Text>Total Amount</Text>
      <TextInput
        value={totalAmount}
        onChangeText={setTotalAmount}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <TouchableOpacity onPress={() => setEqualSplit(true)}>
          <Text style={{ marginRight: 20 }}>
            {equalSplit ? "✅ Equal" : "Equal"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setEqualSplit(false)}>
          <Text>
            {!equalSplit ? "✅ Custom" : "Custom"}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Send Request" onPress={handleSubmit} />
      )}

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
    </View>
  );
}