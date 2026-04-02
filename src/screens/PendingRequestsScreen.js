import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  getPendingRequests,
  acceptRequest,
  rejectRequest,
} from "../api/walletApi";

export default function PendingRequestsScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getPendingRequests();
      setData(res.data);
    } catch (err) {
      console.log("FETCH ERROR:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (id) => {
    try {
      await acceptRequest(id);
      Alert.alert("Success", "Accepted");

      // remove item khỏi list
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.log("ACCEPT ERROR:", err.response?.data || err.message);
      Alert.alert("Error", "Accept failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRequest(id);
      Alert.alert("Rejected");

      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.log("REJECT ERROR:", err.response?.data || err.message);
      Alert.alert("Error", "Reject failed");
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.email}>
          {item.receiver?.email || "Unknown"}
        </Text>

        <Text style={styles.amount}>{item.amount} VND</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, styles.accept]}
            onPress={() => handleAccept(item.id)}
          >
            <Text style={styles.btnText}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.reject]}
            onPress={() => handleReject(item.id)}
          >
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
      ListEmptyComponent={
        <Text style={{ textAlign: "center" }}>No pending requests</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  email: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  amount: {
    fontSize: 16,
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
  },
  accept: {
    backgroundColor: "green",
  },
  reject: {
    backgroundColor: "red",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});